import express from 'express';
import city_routes from './city.routes.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        pid: process.pid,
        status: 'active',
        message: 'Portal Service is running!',
        timestamp: new Date().toISOString()
    });
});

router.use('/city', city_routes);

export default router;
