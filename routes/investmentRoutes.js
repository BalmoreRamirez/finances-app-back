import express from 'express';
import * as investmentController from '../controllers/investmentController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Rutas específicas primero
router.get('/types', investmentController.getInvestmentTypes);

// Rutas generales después
router.get('/', investmentController.getInvestments);
router.post('/', investmentController.createInvestment);

// Rutas con parámetros al final
router.get('/:id', investmentController.getInvestmentById); // Asumiendo que tienes esta ruta
router.put('/:id', investmentController.updateInvestment);   // Asumiendo que tienes esta ruta
router.delete('/:id', investmentController.deleteInvestment); // Asumiendo que tienes esta ruta

export default router;