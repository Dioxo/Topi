import express from 'express';
import { readdir } from 'node:fs/promises';
export const router = express.Router();

/* GET home page. */
router.get('/flags', async (req, res) => {
    try {
        const files = await readdir('/home/dioxo/');
        console.log(files);
    } catch (err) {
        console.error(err);
    }
    res.status(200).json({ ok: '123' });
});
