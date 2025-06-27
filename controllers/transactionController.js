// controllers/transactionController.js
import * as transactionService from '../services/transactionService.js';

export const getTransactions = async (req, res) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTransaction = async (req, res) => {
    try {
        const newTransaction = await transactionService.createTransaction(req.body);
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};