import crypto from 'crypto';
import { Router } from 'express';

import { create, exists, get, remove } from '../services/login.service';

const router = Router();

router.head('/:username', (req, res) => {
    if (exists(req.params.username)) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

router.get('/:username', (req, res) => {
    const id = get(req.params.username);
    if (id) {
        res.status(200)
            .contentType('application/json')
            .send(`"${id}"`);
    } else {
        res.status(404).send();
    }
});

router.post('', (req, res) => {
    console.log('create login ' + JSON.stringify(req.body));
    const username = req.body.username;
    create(username, crypto.randomUUID());
    res.status(201).send();
});

export default router;