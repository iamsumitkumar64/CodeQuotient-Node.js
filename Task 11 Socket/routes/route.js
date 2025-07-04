import express from 'express';
import { join } from 'path';
import __dirname from '../index.js';

const router = express.Router();

router.route('/')
    .get((request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.sendFile(join(__dirname, 'views/private.html'));
    });

export default router;