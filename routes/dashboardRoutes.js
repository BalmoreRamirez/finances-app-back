// routes/dashboardRoutes.js
import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', dashboardController.getSummary);

export default router;