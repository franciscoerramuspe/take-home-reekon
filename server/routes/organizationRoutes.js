import express from 'express';
import organizationController from '../controllers/organization/organizationController.js';

const router = express.Router();

router.post('/register', organizationController.register);
router.get('/', organizationController.list);
router.patch('/:id', organizationController.update);

export default router; 