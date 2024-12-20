import express from 'express';
import jobController from '../controllers/job/jobController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// List all jobs
router.get('/', authenticateToken, jobController.listJobs);

// Get single job
router.get('/:jobId', authenticateToken, jobController.getJobDetails);

// Create new job
router.post('/', authenticateToken, jobController.createJob);

// Update job status
router.post('/:jobId/:action', authenticateToken, jobController.updateJobStatus);

export default router; 