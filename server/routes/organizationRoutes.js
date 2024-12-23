import express from 'express';
import organizationController from '../controllers/organization/organizationController.js';

const router = express.Router();

router.post('/register', organizationController.register);
router.get('/', organizationController.list);

export default router; 