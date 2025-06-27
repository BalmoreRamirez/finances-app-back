// routes/transactionRoutes.js
import express from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
// Aquí podrías añadir rutas para actualizar o eliminar transacciones si es necesario

export default router;