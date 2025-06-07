import express from 'express';
import { createAmenity, updateAmenity, deleteAmenity, getAllAmenities } from '../controllers/amenity.controller.js';
const router = express.Router();

router.post('/', createAmenity);
router.get('/', getAllAmenities);
router.put('/:id', updateAmenity);
router.delete('/:id', deleteAmenity);

export default router;