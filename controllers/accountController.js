// controllers/accountController.js
import * as accountService from '../services/accountService.js';

export const getAccounts = async (req, res) => {
    try {
        const accounts = await accountService.getAccountsByUserId(req.user.id);
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const createAccount = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const newAccount = await accountService.createAccountForUser(userId, req.body);
        res.status(201).json(newAccount);
    } catch (error) {
        console.log('Error creating account:', error);
        res.status(400).json({message: error.message});
    }
};

export const updateAccount = async (req, res) => {
    try {
        const updatedAccount = await accountService.updateAccountForUser(req.user.id, req.params.id, req.body);
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({message: error.message});
    }
};

export const deleteAccount = async (req, res) => {
    try {
        await accountService.deleteAccountForUser(req.user.id, req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 500).json({message: error.message});
    }
};