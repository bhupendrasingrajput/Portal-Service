import express from 'express';
import city_routes from './city.routes.js';
import zone_routes from './zone.routes.js';
import location_routes from './location.routes.js';
import builder_routes from './builder.routes.js';
import amenity_routes from './amenity.routes.js';

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
router.use('/zone', zone_routes);
router.use('/location', location_routes);
router.use('/builder', builder_routes);
router.use('/amenity', amenity_routes);

export default router;
