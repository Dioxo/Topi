import express from 'express';
export const router = express.Router();
import { readdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import countryCodes from '../public/country-code.js';
import { exec } from 'child_process';

let flagsCache = [];

/**
 * @openapi
 * /countries:
 *   get:
 *     description: get all available countries
 *     responses:
 *       200:
 *         description: success
 */
router.get('/countries', async (_, res) => {
    if (flagsCache.length === 0) {
        const filesNames = await readdir(process.env.TORGUARD_FILES);
        const torguardFiles = filesNames.filter((fileName) => /TorGuard.*/.test(fileName));
        torguardFiles.map((t) => {
            // torguard file has the scheme TorGuard.COUNTRY.CITY or TorGuard.IP
            const countryOrIp = t.replace('TorGuard.', '').replace('.ovpn', '');
            const icon = countryCodes.get(countryOrIp.toUpperCase()) || countryCodes.get(countryOrIp.split('.')[0].toUpperCase());
            flagsCache.push({
                name: countryOrIp,
                // get code from pattern COUNTRY or COUNTRY.CITY, Otherwise null if IP
                icon: icon ? `https://flagcdn.com/${icon.toLowerCase()}.svg` : undefined,
            });
        });
    }
    res.status(200).json(flagsCache);
});

/**
 * @openapi
 * /country:
 *   post:
 *     description: change vpn country
 *     parameters:
 *         - name: current
 *           in: query
 *           required: true
 *           type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post('/country', async (req, res) => {
    if (!req.query.current || flagsCache.length === 0 || !flagsCache.some((f) => f.name === req.query.current)) {
        res.status(400).send();
    } else {
        // file to save the current vpn config name
        await writeFile(`${process.env.TORGUARD_FILES}/Topi_current`, `TorGuard.${req.query.current}.ovpn`);
        // copy this file to be used as the current ovpn file
        await copyFile(`${process.env.TORGUARD_FILES}/TorGuard.${req.query.current}.ovpn`, `${process.env.TORGUARD_FILES}/server.conf`);
        res.status(200).send();
    }
});

/**
 * @openapi
 * /countries:
 *   delete:
 *     description: change vpn country
 *     responses:
 *       200:
 *         description: success
 */
router.delete('/countries', (_, res) => {
    flagsCache = [];
    res.status(200).send();
});

/**
 * @openapi
 * /current:
 *   get:
 *     description: get selected country for vpn
 *     responses:
 *       200:
 *         description: success
 */
router.get('/current', async (req, res) => {
    try {
        const name = (await readFile(`${process.env.TORGUARD_FILES}/Topi_current`, 'utf8')).replace('TorGuard.', '').replace('.ovpn', '');
        if (process.env.ENV === 'prod') {
            exec('sudo systemctl restart openvpn@server.service');
        }
        res.status(200).send({ name });
    } catch (error) {
        res.status(400).send({ error });
    }
});
