// controllers/investmentController.js
import * as investmentService from '../services/investmentService.js';

export const getInvestments = async (req, res) => {
    try {
        const investments = await investmentService.getInvestmentsByUserId(req.user.id);
        res.status(200).json(investments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInvestment = async (req, res) => {
    try {
        const newInvestment = await investmentService.createInvestmentForUser(req.user.id, req.body);
        res.status(201).json(newInvestment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};