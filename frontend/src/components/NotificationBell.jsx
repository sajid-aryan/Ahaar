import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const NotificationBell = ({ onClick, className = '' }) => {
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Check for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:3004/api/notifications/unread-count', {
        withCredentials: true
      });
      
      if (response.data.success) {
        const newCount = response.data.unreadCount;
        
        // Animate if count increased
        if (newCount > unreadCount) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        }
        
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Don't render if user is not logged in
  if (!user) return null;

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <motion.div
        animate={isAnimating ? { 
          rotate: [0, -15, 15, -15, 15, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <Bell size={24} />
      </motion.div>
      
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.span>
      )}
    </button>
  );
};

export default NotificationBell;
