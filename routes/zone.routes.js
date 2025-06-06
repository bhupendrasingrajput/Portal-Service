import express from 'express';
import { createZone, getAllZones } from '../controllers/zone.controller.js';

const router = express.Router();

router.post('/create', createZone);
router.get('/all', getAllZones);

export default router;