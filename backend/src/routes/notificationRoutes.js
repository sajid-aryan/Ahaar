import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    createTestNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get notifications for the authenticated user
router.get('/', getNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Test function to create sample notifications
router.post('/test', createTestNotifications);

// Mark a specific notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', markAllAsRead);

// Clear all notifications
router.delete('/clear-all', clearAllNotifications);

// Delete a specific notification
router.delete('/:notificationId', deleteNotification);

export default router;
