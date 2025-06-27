// controllers/transferController.js
import * as transferService from '../services/transferService.js';

export const getTransfers = async (req, res) => {
    try {
        const transfers = await transferService.getTransfersByUserId(req.user.id);
        res.status(200).json(transfers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTransfer = async (req, res) => {
    try {
        const newTransfer = await transferService.createTransferForUser(req.user.id, req.body);
        res.status(201).json(newTransfer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};