// controllers/dashboardController.js
import * as dashboardService from '../services/dashboardService.js';

export const getSummary = async (req, res) => {
    try {
        const summary = await dashboardService.getSummary();
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};