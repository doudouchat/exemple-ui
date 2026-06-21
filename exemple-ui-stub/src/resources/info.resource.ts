import { Router } from 'express';

const router = Router();

router.get('', (req, res) => {
    res.status(200).send({
        version: 'version:4.0.0-SNAPSHOT',
        buildTime: new Date()
    });
});

export default router;