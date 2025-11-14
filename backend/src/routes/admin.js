import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getAdminStats,
    getPendingVerifications,
    verifyNGO,
    rejectNGOVerification,
    getPendingReports,
    reviewReport,
    getVerifiedNGOs
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// Admin dashboard stats
router.get('/stats', getAdminStats);

// NGO verification management
router.get('/verifications/pending', getPendingVerifications);
router.get('/verifications/verified', getVerifiedNGOs);
router.post('/verifications/:ngoId/approve', verifyNGO);
router.post('/verifications/:ngoId/reject', rejectNGOVerification);

// Report management
router.get('/reports/pending', getPendingReports);
router.post('/reports/:reportId/review', reviewReport);

export default router;