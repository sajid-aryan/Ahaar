import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Star, Package, Gift, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { apiUrl } from '../utils/api';
import toast from 'react-hot-toast';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3004/api/notifications', {
        withCredentials: true,
        params: { limit: 10 } // Limit to 10 recent notifications for dropdown
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.pagination.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3004/api/notifications/${notificationId}/read`, {}, {
        withCredentials: true
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, read: true, readAt: new Date() }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:3004/api/notifications/${notificationId}`, {
        withCredentials: true
      });
      
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:3004/api/notifications/mark-all-read', {}, {
        withCredentials: true
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true, readAt: new Date() }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const clearAllNotifications = async () => {
    // Confirm before clearing all notifications
    if (!window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await axios.delete('http://localhost:3004/api/notifications/clear-all', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications([]);
        setUnreadCount(0);
        toast.success(`✅ Cleared ${response.data.deletedCount} notifications`);
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      toast.error('Failed to clear all notifications');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation_claimed':
        return <Gift className="w-4 h-4 text-green-500" />;
      case 'feedback_received':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'donation_completed':
        return <Check className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationDate.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-green-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex gap-2 mt-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-pink-100 hover:text-white transition-all duration-200 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 font-medium"
                  >
                    ✓ Mark all read
                  </button>
                )}
                
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-pink-100 hover:text-red-200 transition-all duration-200 px-3 py-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 font-medium"
                >
                  🗑️ Clear all
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-gray-500">
                <Bell className="w-8 h-8 mb-1 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 border-b border-gray-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-green-50 transition-colors cursor-pointer group ${
                      !notification.read ? 'bg-gradient-to-r from-pink-50 to-green-50 border-l-4 border-l-pink-500' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification._id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium text-gray-900 mb-1 line-clamp-1 ${
                          !notification.read ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </h4>
                        
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {notification.data?.rating && (
                          <div className="mt-2 flex items-center">
                            <span className="text-xs text-gray-500 mr-1">Rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < notification.data.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600 ml-1">
                              ({notification.data.rating}/5)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {notifications.length >= 10 && (
                  <div className="p-3 text-center border-t border-gray-200 bg-gradient-to-r from-pink-50 to-green-50">
                    <button className="text-sm text-pink-600 hover:text-pink-800 font-medium">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
