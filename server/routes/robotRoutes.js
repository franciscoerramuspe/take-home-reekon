import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { robotController } from '../controllers/robot/robotController.js';

const router = express.Router();

router.post('/', authenticateToken, robotController.createRobot);
router.get('/', authenticateToken, robotController.getRobots);
router.patch('/:robotId/status', authenticateToken, robotController.updateRobotStatus);
router.post('/:robotId/tasks', authenticateToken, robotController.assignTask);
router.get('/:robotId/analytics', authenticateToken, robotController.getRobotAnalytics);
router.delete('/:robotId', authenticateToken, robotController.deleteRobot);

export default router; 