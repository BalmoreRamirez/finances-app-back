// routes/accountRoutes.js
import express from 'express';
import * as accountController from '../controllers/accountController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

// Proteger todas las rutas de este módulo
router.use(protect);

router.get('/', accountController.getAccounts);
router.get('/types', accountController.getAccountTypes);
router.post('/', accountController.createAccount);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

export default router;