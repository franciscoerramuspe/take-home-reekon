import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { robotController } from '../controllers/robot/robotController.js';

const router = express.Router();

router.post('/', authenticateToken, robotController.createRobot);
router.get('/', authenticateToken, robotController.getRobots);

export default router; 