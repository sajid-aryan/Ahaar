import Notification from '../models/Notification.js';

// Create a new notification
export const createNotification = async ({ userId, type, title, message, data = {} }) => {
    try {
        const notification = new Notification({
            userId,
            type,
            title,
            message,
            data
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        
        const query = { userId };
        if (unreadOnly === 'true') {
            query.read = false;
        }
        
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('data.donationId', 'title category')
            .populate('data.claimerId', 'name userType');
            
        const totalNotifications = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ userId, read: false });
        
        res.status(200).json({
            success: true,
            notifications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalNotifications / limit),
                totalNotifications,
                unreadCount
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;
        
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true, readAt: new Date() },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification',
            error: error.message
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        
        await Notification.updateMany(
            { userId, read: false },
            { read: true, readAt: new Date() }
        );
        
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notifications',
            error: error.message
        });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;
        
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            userId
        });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

// Clear all notifications for a user
export const clearAllNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        
        const result = await Notification.deleteMany({
            userId
        });
        
        res.status(200).json({
            success: true,
            message: `Cleared ${result.deletedCount} notifications`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing all notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing all notifications',
            error: error.message
        });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;
        
        const unreadCount = await Notification.countDocuments({
            userId,
            read: false
        });
        
        res.status(200).json({
            success: true,
            unreadCount
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting unread count',
            error: error.message
        });
    }
};

// Test function to create sample notifications
export const createTestNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const { count = 3 } = req.body;
        
        // Sample notification data
        const sampleNotifications = [
            {
                type: 'donation_claimed',
                title: '🎉 Your donation has been claimed!',
                message: 'Great news! NGO Helper has claimed your "Fresh Vegetables" donation. They will be in touch for pickup arrangements.',
                data: {
                    donationId: null,
                    claimerId: null,
                    claimerName: 'NGO Helper'
                }
            },
            {
                type: 'feedback_received',
                title: '⭐ New feedback from Helping Hands NGO!',
                message: 'You received a Excellent (5/5) rating for your "Winter Clothes" donation. They also left a comment: "Amazing quality clothes, helped many families!"',
                data: {
                    donationId: null,
                    claimerId: null,
                    claimerName: 'Helping Hands NGO',
                    rating: 5,
                    feedback: 'Amazing quality clothes, helped many families!'
                }
            },
            {
                type: 'donation_completed',
                title: '✅ Donation completed successfully!',
                message: 'Your "Food Packages" donation has been successfully completed and distributed. Thank you for making a difference!',
                data: {
                    donationId: null,
                    claimerId: null,
                    claimerName: 'Community Kitchen'
                }
            },
            {
                type: 'feedback_received',
                title: '⭐ New feedback from Street Angels!',
                message: 'You received a Very Good (4/5) rating for your "Medical Supplies" donation. They also left a comment: "Very helpful supplies, reached those in need quickly."',
                data: {
                    donationId: null,
                    claimerId: null,
                    claimerName: 'Street Angels',
                    rating: 4,
                    feedback: 'Very helpful supplies, reached those in need quickly.'
                }
            },
            {
                type: 'donation_claimed',
                title: '🎉 Another donation claimed!',
                message: 'Wonderful! Food Bank Central has claimed your "Canned Goods" donation. They will contact you soon for pickup details.',
                data: {
                    donationId: null,
                    claimerId: null,
                    claimerName: 'Food Bank Central'
                }
            }
        ];
        
        const notifications = [];
        
        for (let i = 0; i < Math.min(count, sampleNotifications.length); i++) {
            const notificationData = {
                userId,
                ...sampleNotifications[i]
            };
            
            const notification = await createNotification(notificationData);
            notifications.push(notification);
        }
        
        res.status(200).json({
            success: true,
            message: `Successfully created ${notifications.length} test notifications`,
            notifications
        });
    } catch (error) {
        console.error('Error creating test notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test notifications',
            error: error.message
        });
    }
};
