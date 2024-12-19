import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import errorReportController from '../controllers/error/errorReportController.js';

const router = express.Router();

router.get('/', authenticateToken, errorReportController.listErrors);
router.get('/analytics', authenticateToken, errorReportController.getErrorAnalytics);

export default router;
