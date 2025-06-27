// controllers/authController.js
import * as authService from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', userId: user.user_id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};