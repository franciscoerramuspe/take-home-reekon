import express from 'express';
import AuthController from '../controllers/auth/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', AuthController.register.bind(AuthController));
router.post('/login', AuthController.login.bind(AuthController));
router.post('/logout', authenticateToken, AuthController.logout.bind(AuthController));

export default router;
