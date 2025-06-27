// routes/investmentRoutes.js
import express from 'express';
import * as investmentController from '../controllers/investmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', investmentController.getInvestments);
router.post('/', investmentController.createInvestment);
// Aquí podrías añadir rutas para actualizar o eliminar inversiones

export default router;