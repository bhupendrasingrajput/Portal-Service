import express from 'express';
import { createLocation, getAllLocations } from '../controllers/location.controller.js';
const router = express.Router();

router.post('/create', createLocation);
router.get('/all', getAllLocations);

export default router;