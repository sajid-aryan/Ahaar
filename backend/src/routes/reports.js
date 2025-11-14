import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    createReport,
    getUserReports,
    getReportDetails,
    updateReport
} from '../controllers/reportController.js';

const router = express.Router();

// All report routes require authentication
router.use(authenticateToken);

// Create a new report
router.post('/', createReport);

// Get user's reports
router.get('/my-reports', getUserReports);

// Get specific report details
router.get('/:reportId', getReportDetails);

// Update report (withdraw)
router.put('/:reportId', updateReport);

export default router;