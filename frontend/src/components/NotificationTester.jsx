import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, TestTube } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NotificationTester = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createTestNotifications = async () => {
    setIsCreating(true);
    try {
      const response = await axios.post('http://localhost:3004/api/notifications/test', {
        count: 3 // Create 3 test notifications
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(`✅ Created ${response.data.notifications.length} test notifications!`);
      } else {
        throw new Error('Failed to create test notifications');
      }
    } catch (error) {
      console.error('Error creating test notifications:', error);
      if (error.response?.status === 401) {
        toast.error('❌ Please log in to test notifications');
      } else {
        toast.error('❌ Failed to create test notifications');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={createTestNotifications}
        disabled={isCreating}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg font-medium transition-all duration-200 ${
          isCreating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600 text-white'
        }`}
        whileHover={!isCreating ? { scale: 1.05 } : {}}
        whileTap={!isCreating ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isCreating ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <TestTube className="w-4 h-4" />
        )}
        
        <span className="text-sm">
          {isCreating ? 'Creating...' : 'Test Notifications'}
        </span>
        
        <Bell className="w-4 h-4" />
      </motion.button>
      
      <div className="mt-2 text-xs text-gray-600 text-center">
        Click to create sample notifications
      </div>
    </div>
  );
};

export default NotificationTester;