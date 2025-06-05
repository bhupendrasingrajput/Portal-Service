import express from 'express';
import { createCity } from '../controllers/city.controller.js';
const router = express.Router();

router.post('/create', createCity);

export default router;