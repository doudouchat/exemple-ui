import crypto from 'crypto';
import { Router } from 'express';

import { create, exists, get, remove } from '../services/auth.service';

const router = Router();

router.get('/oauth/authorize', (req, res) => {
    res.status(200)
        .location('http://localhost:8086/code=' + crypto.randomUUID())
        .send();
});

router.put('/ws/v1/logins/:username', (req, res) => {
    const isPresent = exists(req.params.username);
    console.log('create auth ' + req.params.username);
    create(req.params.username, req.body.password);
    res.status(isPresent ? 204 : 201).send();
});

router.delete('/ws/v1/logins/:username', (req, res) => {
    console.log('delete auth ' + req.params.username);
    const username = get(req.params.username) as string;
    remove(username);
    res.status(204).send();
});

router.post('/ws/v1/logins/move', (req, res) => {
    const toUsername = req.body.toUsername;
    const fromUsername = req.body.fromUsername;
    const password = get(fromUsername);
    if (password) {
        remove(fromUsername);
        create(toUsername, password);
        res.status(204).send();
    } else {
        res.status(404).send();
    }

});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (get(username) === password) {
        res.status(201)
            .header('x-auth-token', '123')
            .send();
    } else {
        res.status(401).send();
    }
});

router.post('/oauth/token', (req, res) => {
    res.status(200).send({
        expires_in: 6000
    });
});

export default router;