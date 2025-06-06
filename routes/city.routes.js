import express from 'express';
import { createCity, getAllCities } from '../controllers/city.controller.js';
const router = express.Router();

router.post('/create', createCity);
router.get('/all', getAllCities);

export default router;