// routes/investmentCreditPaymentRoutes.js
import express from 'express';
import * as paymentController from '../controllers/investmentCreditPaymentController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', paymentController.createInvestmentPayment);
router.get('/investment/:investmentId', paymentController.getPaymentsForInvestment);
router.put('/:paymentId', paymentController.updateInvestmentPayment);
router.delete('/:paymentId', paymentController.deleteInvestmentPayment);

export default router;