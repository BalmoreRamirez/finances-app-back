// controllers/investmentCreditPaymentController.js
import * as paymentService from '../services/investmentCreditPaymentService.js';

export const createInvestmentPayment = async (req, res, next) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

export const getPaymentsForInvestment = async (req, res, next) => {
    try {
        const { investmentId } = req.params;
        const payments = await paymentService.getPaymentsByInvestmentId(investmentId);
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
};

export const updateInvestmentPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const payment = await paymentService.updatePayment(paymentId, req.body);
        res.status(200).json(payment);
    } catch (error) {
        next(error);
    }
};

export const deleteInvestmentPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        await paymentService.deletePayment(paymentId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};