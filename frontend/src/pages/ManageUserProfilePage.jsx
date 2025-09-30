import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Edit, Save, X, User, Package, DollarSign } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3004/api" : "/api";

export default function ManageUserProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userStats, setUserStats] = useState({
    donationsCount: 0,
    totalMoneyDonated: 0
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_URL}/user-profile/stats`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validate required fields
    if (!formData.name || !formData.email) {
      const errorMessage = 'Please fill in all required fields (Name, Email)';
      setError(errorMessage);
      toast.error(errorMessage);
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        updateUserProfile(data.user);
        setEditMode(false);
        setError('');
        toast.success('Profile updated successfully!');
      } else {
        const errorMessage = data.message || 'Failed to update profile';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = 'An error occurred while updating profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div 
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 overflow-hidden py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Gradient Orbs */}
        <motion.div
          className="absolute top-10 right-10 w-60 h-60 opacity-30"
          style={{
            background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(40px)',
          }}
          animate={{ 
            rotate: [0, 360],
            borderRadius: [
              '60% 40% 30% 70% / 60% 30% 70% 40%',
              '40% 60% 70% 30% / 40% 70% 30% 60%',
              '30% 70% 40% 60% / 70% 40% 60% 30%',
              '60% 40% 30% 70% / 60% 30% 70% 40%'
            ]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 opacity-25"
          style={{
            background: 'radial-gradient(circle, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            borderRadius: '30% 70% 40% 60% / 50% 60% 40% 50%',
            filter: 'blur(50px)',
          }}
          animate={{ 
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, -360],
            borderRadius: [
              '30% 70% 40% 60% / 50% 60% 40% 50%',
              '70% 30% 60% 40% / 30% 50% 60% 50%',
              '40% 60% 30% 70% / 60% 40% 50% 60%',
              '30% 70% 40% 60% / 50% 60% 40% 50%'
            ]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Icons */}
        {['👤', '📋', '✏️', '💼', '📊', '✨'].map((icon, index) => (
          <motion.div
            key={index}
            className="absolute text-6xl opacity-15"
            style={{
              left: `${15 + (index * 12)}%`,
              top: `${25 + (index * 10)}%`,
            }}
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 8 + index * 2, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.7
            }}
          >
            {icon}
          </motion.div>
        ))}

        {/* Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 opacity-20"
          style={{
            background: 'linear-gradient(45deg, #ff9a9e, #fecfef)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute bottom-1/3 right-1/3 w-24 h-24 opacity-25"
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
          }}
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sparkle Effects */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Mesh Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
            `,
            animation: 'aurora 15s ease-in-out infinite'
          }}
        />
      </div>

      <div className="relative z-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Your Profile
          </h1>
          <p className="text-xl text-gray-600">
            Update your personal information and contact details
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-500 to-green-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <User className="mr-3" size={24} />
                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                </div>
              </div>
              <div className="flex gap-3">
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 flex items-center"
                  >
                    <Edit className="mr-2" size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* View My Donations Button */}
              {!editMode && (
                <div className="mb-8">
                  <button
                    onClick={() => navigate('/my-donations')}
                    className="w-full bg-gradient-to-r from-pink-500 to-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center"
                  >
                    <Package className="mr-2" size={20} />
                    View My Donations
                  </button>
                </div>
              )}

              {/* Save/Cancel Buttons */}
              {editMode && (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 flex items-center"
                  >
                    <Save className="mr-2" size={18} />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setError('');
                      // Reset form data to original values
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || ''
                      });
                    }}
                    className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center"
                  >
                    <X className="mr-2" size={18} />
                    Cancel
                  </button>
                </div>
              )}

              {/* Profile Information Display */}
              {!editMode && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Account Type:</span>
                      <span className="text-sm text-gray-900 capitalize">{user?.userType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Donations Made:</span>
                      <span className="text-sm text-gray-900 flex items-center">
                        <Package className="w-4 h-4 mr-1 text-green-600" />
                        {userStats.donationsCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Money Donated:</span>
                      <span className="text-sm text-gray-900 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        {userStats.totalMoneyDonated.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Member Since:</span>
                      <span className="text-sm text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Last Login:</span>
                      <span className="text-sm text-gray-900">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
      </div>
    </motion.div>
  );
}
