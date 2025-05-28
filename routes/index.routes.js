import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        pid: process.pid,
        status: 'active',
        message: 'Portal Service is running!',
        timestamp: new Date().toISOString()
    });
});

export default router;
