import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageNGOProfilePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showAddNeed, setShowAddNeed] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    organizationName: '',
    description: '',
    location: '',
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    }
  });

  const [newNeed, setNewNeed] = useState({
    type: 'food',
    description: '',
    targetAmount: ''
  });

  useEffect(() => {
    if (user && user.userType === 'ngo') {
      fetchProfile();
    } else {
      setError('Access denied. Only NGOs can manage profiles.');
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', user);
      const response = await fetch('http://localhost:3004/api/ngo-profiles/my-profile', {
        method: 'GET',
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfile(data);
        setProfileForm({
          organizationName: data.organizationName || '',
          description: data.description || '',
          location: data.location || '',
          contactInfo: {
            phone: data.contactInfo?.phone || '',
            email: data.contactInfo?.email || '',
            website: data.contactInfo?.website || ''
          }
        });
      } else if (response.status === 404) {
        // No profile exists yet
        console.log('No profile found - 404');
        setProfile(null);
        setEditMode(true);
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contactInfo.')) {
      const contactField = name.split('.')[1];
      setProfileForm(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }));
    } else {
      setProfileForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNeedChange = (e) => {
    const { name, value } = e.target;
    setNewNeed(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(''); // Clear any existing errors
    
    // Validate required fields
    if (!profileForm.organizationName || !profileForm.description || !profileForm.location) {
      const errorMessage = 'Please fill in all required fields (Organization Name, Description, Location)';
      setError(errorMessage);
      toast.error(errorMessage);
      setSaving(false);
      return;
    }

    try {
      const url = profile 
        ? `http://localhost:3004/api/ngo-profiles/${profile._id}`
        : 'http://localhost:3004/api/ngo-profiles';
      
      const method = profile ? 'PUT' : 'POST';

      console.log('Saving profile with data:', profileForm);
      console.log('URL:', url, 'Method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileForm),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile saved successfully:', data);
        setProfile(data);
        setEditMode(false);
        setError('');
        toast.success('Profile saved successfully! Your changes have been saved.');
      } else {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        const errorMessage = errorData.message || 'Failed to save profile';
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error.message || 'Failed to save profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNeed = async () => {
    if (!profile) return;

    try {
      const needData = {
        ...newNeed,
        targetAmount: newNeed.type === 'money' ? parseFloat(newNeed.targetAmount) : undefined
      };

      const response = await fetch(`http://localhost:3004/api/ngo-profiles/${profile._id}/needs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(needData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setNewNeed({
          type: 'food',
          description: '',
          targetAmount: ''
        });
        setShowAddNeed(false);
        toast.success('New need added successfully!');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to add need';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding need:', error);
      toast.error(error.message || 'Failed to add need');
    }
  };

  const handleDeleteNeed = async (needId) => {
    if (!profile || !window.confirm('Are you sure you want to delete this need?')) return;

    try {
      const response = await fetch(`http://localhost:3004/api/ngo-profiles/${profile._id}/needs/${needId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        toast.success('Need deleted successfully!');
      } else {
        const errorMessage = 'Failed to delete need';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting need:', error);
      toast.error(error.message || 'Failed to delete need');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Your NGO Profile
          </h1>
          <p className="text-xl text-gray-600">
            {profile ? 'Update your organization details and current needs' : 'Create your organization profile to start receiving donations'}
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
              <h2 className="text-2xl font-bold">Organization Profile</h2>
              {profile && !editMode && (
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

          <div className="p-6">
            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={profileForm.organizationName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={profileForm.location}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="Enter location"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={profileForm.description}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="Describe your organization's mission and activities..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={profileForm.contactInfo.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={profileForm.contactInfo.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="Enter email address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="contactInfo.website"
                  value={profileForm.contactInfo.website}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="Enter website URL"
                />
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {editMode && (
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 flex items-center"
                >
                  <Save className="mr-2" size={18} />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                {profile && (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setError('');
                    }}
                    className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center"
                  >
                    <X className="mr-2" size={18} />
                    Cancel
                  </button>
                )}
              </div>
            )}

            {/* Current Needs Section */}
            {profile && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Current Needs</h3>
                  <button
                    onClick={() => setShowAddNeed(true)}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center"
                  >
                    <Plus className="mr-2" size={18} />
                    Add Need
                  </button>
                </div>

                {profile.needs.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No current needs listed. Add your first need to start receiving donations.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.needs.map((need, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 capitalize">{need.type}</h4>
                          <button
                            onClick={() => handleDeleteNeed(need._id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-gray-700 mb-3">{need.description}</p>
                        {need.type === 'money' && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium">
                                ${need.currentAmount || 0} / ${need.targetAmount}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(((need.currentAmount || 0) / need.targetAmount) * 100, 100)}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Need Modal */}
      {showAddNeed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Need</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Need
              </label>
              <select
                name="type"
                value={newNeed.type}
                onChange={handleNeedChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="food">Food</option>
                <option value="medical">Medical Equipment/Medicine</option>
                <option value="clothing">Clothing</option>
                <option value="money">Money</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={newNeed.description}
                onChange={handleNeedChange}
                rows="3"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe what you need and how it will help..."
              ></textarea>
            </div>

            {newNeed.type === 'money' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={newNeed.targetAmount}
                  onChange={handleNeedChange}
                  min="1"
                  step="0.01"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter target amount"
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddNeed(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNeed}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                Add Need
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ManageNGOProfilePage;
