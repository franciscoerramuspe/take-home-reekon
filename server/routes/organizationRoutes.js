import express from 'express';
import OrganizationController from '../controllers/organization/organizationController.js';

const router = express.Router();

router.post('/register', OrganizationController.register.bind(OrganizationController));

export default router; 