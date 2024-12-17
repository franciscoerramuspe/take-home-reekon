import express from 'express';
import AuthController from '../controllers/auth/authController.js';

const router = express.Router();

router.post('/register', AuthController.register.bind(AuthController));

export default router;
