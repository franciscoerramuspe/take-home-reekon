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
router.put('/:robotId/location', authenticateToken, robotController.updateRobotLocation);
router.get('/:robotId/location', authenticateToken, robotController.getRobotLocation);
router.get('/locations', authenticateToken, robotController.getAllRobotLocations);
router.get('/:robotId/location/history', authenticateToken, robotController.getLocationHistory);
router.get('/:robotId', authenticateToken, robotController.getRobotDetails);
router.get('/:robotId/errors', authenticateToken, robotController.getRobotErrors);
router.get('/:robotId/jobs', authenticateToken, robotController.getRobotJobs);

export default router; 