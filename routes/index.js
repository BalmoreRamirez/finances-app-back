// routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import accountRoutes from './accountRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import investmentRoutes from './investmentRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import categoryRoutes from './categoryRoutes.js'; // Nuevo
import transferRoutes from './transferRoutes.js';   // Nuevo
import investmentCreditPaymentRoutes from './investmentCreditPaymentRoutes.js'; // Nuevo

const router = express.Router();

// Rutas públicas para autenticación
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/investments', investmentRoutes);
router.use('/investment-payments', investmentCreditPaymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categories', categoryRoutes);
router.use('/transfers', transferRoutes);

export default router;