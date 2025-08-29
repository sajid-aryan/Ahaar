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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 py-8">
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
  );
}
