import { Router } from 'express';
import jsonpatch from 'jsonpatch';

import { create, get, remove, save } from '../services/account.service';
import { create as createLogin, get as getLogin, remove as removeLogin } from '../services/login.service';

const router = Router();

router.post('', (req, res) => {
    console.log('create account ' + JSON.stringify(req.body));
    const accountId = create(req.body);
    createLogin(req.body.email, accountId);
    res.status(201).location('http://localhost:8086/accounts/' + accountId).send();
});

router.get('/:id', (req, res) => {
    const account = get(req.params.id);
    if (account) {
        res.status(200).send(account);
        console.log('get account ' + JSON.stringify(account));
    } else {
        res.status(404).send();
    }
});

router.patch('/:id', (req, res) => {
    console.log('update account ' + JSON.stringify(req.body));
    const account = get(req.params.id);
    if (account) {
        save(req.params.id, jsonpatch.apply_patch(account, req.body));
        console.log('updated account ' + JSON.stringify(get(req.params.id)));
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

router.delete('/:username', (req, res) => {
    console.log('delete account ' + req.params.username);
    const id = getLogin(req.params.username);
    if (id) {
        remove(id);
        removeLogin(req.params.username);
    }
    res.status(204).send();
});

export default router;