import express from 'express';
import { createBuilder, getAllBuilders, getBuilderById } from '../controllers/builder.controller.js';
const router = express.Router();

router.post('/create', createBuilder);
router.get('/all', getAllBuilders);
router.get('/:id', getBuilderById);

export default router;