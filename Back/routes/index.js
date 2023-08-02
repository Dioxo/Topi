import express from 'express';
export const router = express.Router();
import { writeFile, copyFile, readFile } from 'node:fs/promises';
import { readdir } from 'node:fs';
import countryCodes from '../public/country-code.js';
import { exec } from 'child_process';

let locationsCache = [];

router.use((_, __, next) => {
    if(locationsCache.length === 0) {
        console.log("test");
        readdir(process.env.TORGUARD_FILES, null, (error, filesNames ) => {
            if(error != null){
                throw new Error(error);
            }
            const torguardFiles = filesNames.filter((fileName) => /TorGuard.*/.test(fileName));

            locationsCache = torguardFiles.map((t) => {
                // torguard file has the scheme TorGuard.COUNTRY.CITY or TorGuard.IP
                const countryOrIp = t.replace('TorGuard.', '').replace('.ovpn', '');
                const icon = countryCodes.get(countryOrIp.toUpperCase()) || countryCodes.get(countryOrIp.split('.')[0].toUpperCase());

                return ({
                    name: countryOrIp,
                    // get code from pattern COUNTRY or COUNTRY.CITY, Otherwise undefined if IP
                    icon: icon ? `https://flagcdn.com/${icon.toLowerCase()}.svg` : undefined,
                });
            });

            next();
        });
    }else{
        next();
    }
})

const reloadOpenVpn = () => {
    if (process.env.ENV === 'prod') {
        exec('sudo systemctl restart openvpn@server.service');
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 5000)
        });
    }

    //return Promise.resolve();
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 5000)
    });
}

/**
 * @swagger
 * definitions:
 *   Flag:
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *       icon:
 *         type: string
 */

/**
 * @swagger
 * tags:
 *   name: Topi
 */

/**
 * @openapi
 * /countries:
 *   get:
 *     description: get all available countries
 *     tags: [Topi]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Flag'
 */
router.get('/countries', async (_, res) => {
    res.status(200).json(locationsCache);
});

/**
 * @openapi
 * /country:
 *   post:
 *     description: change vpn country
 *     tags: [Topi]
 *     parameters:
 *         - name: current
 *           in: query
 *           required: true
 *           type: string
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: bar request
 */
router.post('/country', async (req, res) => {

    if (!req.query.current || !locationsCache.some((f) => f.name === req.query.current)) {
        res.status(400).send();
    } else {
        // file to save the current vpn config name
        await writeFile(`${process.env.TORGUARD_FILES}/Topi_current`, req.query.current);
        // copy this file to be used as the current ovpn file
        // ovpn takes the file with .conf as default
        await copyFile(`${process.env.TORGUARD_FILES}/TorGuard.${req.query.current}.ovpn`, `${process.env.TORGUARD_FILES}/server.conf`);

        await reloadOpenVpn();
        res.status(200).send();
    }
});

/**
 * @openapi
 * /cache:
 *   delete:
 *     description: clean cache
 *     tags: [Topi]
 *     responses:
 *       200:
 *         description: success
 */
router.delete('/cache', (_, res) => {
    locationsCache = [];
    res.status(200).send();
});

/**
 * @openapi
 * /current:
 *   get:
 *     description: get selected country for vpn
 *     tags: [Topi]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Flag'
 *       400:
 *         description: bar request
 */
router.get('/current', async (_, res) => {
    try {
        const name = (await readFile(`${process.env.TORGUARD_FILES}/Topi_current`, 'utf8'));
        res.status(200).json(locationsCache.find(a => a.name === name));
    } catch (error) {
        console.error(error);
        res.status(400).send({ error });
    }
});

/**
 * @openapi
 * /restart-ovpn:
 *   get:
 *     description: restart openvpn
 *     tags: [Topi]
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: bar request
 */
router.get('/restart-ovpn', async (_, res) => {
    try {
        await reloadOpenVpn();
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
});
