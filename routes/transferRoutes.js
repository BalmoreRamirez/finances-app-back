
// routes/transferRoutes.js
import express from 'express';
import * as transferController from '../controllers/transferController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', transferController.getTransfers);
router.post('/', transferController.createTransfer);

export default router;