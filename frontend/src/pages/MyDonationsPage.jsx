import { useState, useEffect } from "react";
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Package, Calendar, User, Star, Trash2, Edit, X, Save } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../../utils/date';
import { apiUrl } from '../utils/api';
import toast from 'react-hot-toast';

const MyDonationsPage = () => {
  const { user } = useAuthStore();
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/donations/my/${user._id}`), {
          withCredentials: true
        });
        console.log('My donations response:', res.data);
        setMyDonations(res.data.donations || []);
      } catch (error) {
        console.log("Error fetching my donations:", error);
        setError("Failed to load your donations");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchMyDonations();
    } else {
      setLoading(false);
      setError("Please log in to view your donations.");
    }
  }, [user]);

  const handleDeleteDonation = async (donationId) => {
    if (!confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      return;
    }

    setDeletingId(donationId);
    
    try {
      const response = await axios.delete(apiUrl(`/api/donations/${donationId}`), {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Donation deleted successfully!');
        // Remove the deleted donation from local state
        setMyDonations(prevDonations => 
          prevDonations.filter(donation => donation._id !== donationId)
        );
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast.error(error.response?.data?.message || 'Failed to delete donation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStart = (donation) => {
    setEditingId(donation._id);
    setEditFormData({
      title: donation.title,
      description: donation.description,
      category: donation.category,
      quantity: donation.quantity,
      location: donation.location
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditSave = async () => {
    if (!editFormData.title || !editFormData.description || !editFormData.category || 
        !editFormData.quantity || !editFormData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.put(apiUrl(`/api/donations/${editingId}`), 
        editFormData, 
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Donation updated successfully!');
        // Update the donation in local state
        setMyDonations(prevDonations => 
          prevDonations.map(donation => 
            donation._id === editingId 
              ? { ...donation, ...editFormData }
              : donation
          )
        );
        setEditingId(null);
        setEditFormData({});
      }
    } catch (error) {
      console.error('Error updating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to update donation');
    }
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const canEdit = (donation) => {
    return donation.status === 'available';
  };

  const canDelete = (donation) => {
    return donation.status === 'available';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
          <p className="text-lg opacity-70 mb-4">Please log in to view your donations.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 overflow-hidden"
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
        {['📦', '💝', '🏠', '❤️', '🎁', '✨'].map((icon, index) => (
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

        {/* Sparkle Effects */}
        {Array.from({ length: 10 }).map((_, i) => (
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
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
      <div className="container mx-auto px-6 py-8">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">My Donations</h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/browse" className="btn btn-ghost">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Browse
            </Link>
          </motion.div>
        </motion.div>
        
        {loading && (
          <div className="text-center text-primary py-10">
            <span className="loading loading-spinner loading-lg"></span>
            <p>Loading your donations...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {myDonations.length === 0 && !loading && !error && (
          <div className="text-center py-10">
            <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
            <p className="text-lg opacity-70 mb-4">You haven't created any donations yet.</p>
            <Link to="/create-donation" className="btn btn-primary">Create Your First Donation</Link>
          </div>
        )}

        {myDonations.length > 0 && !loading && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {myDonations.map((donation, index) => (
              <motion.div 
                key={donation._id} 
                className="group card bg-base-100/80 backdrop-blur-sm shadow-xl transition-all duration-200 glass-card relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                {donation.image && (
                  <figure className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={apiUrl(donation.image)}
                      alt={donation.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </figure>
                )}
                
                <div className="card-body">
                  {editingId === donation._id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Title</span>
                        </label>
                        <input
                          type="text"
                          value={editFormData.title || ''}
                          onChange={(e) => handleEditChange('title', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="Donation title"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Description</span>
                        </label>
                        <textarea
                          value={editFormData.description || ''}
                          onChange={(e) => handleEditChange('description', e.target.value)}
                          className="textarea textarea-bordered textarea-sm h-20"
                          placeholder="Donation description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Category</span>
                          </label>
                          <select
                            value={editFormData.category || ''}
                            onChange={(e) => handleEditChange('category', e.target.value)}
                            className="select select-bordered select-sm"
                          >
                            <option value="">Select category</option>
                            <option value="food">Food</option>
                            <option value="clothing">Clothing</option>
                            <option value="medical">Medical Supplies</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Quantity</span>
                          </label>
                          <input
                            type="text"
                            value={editFormData.quantity || ''}
                            onChange={(e) => handleEditChange('quantity', e.target.value)}
                            className="input input-bordered input-sm"
                            placeholder="e.g., 50 meals"
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Location</span>
                        </label>
                        <input
                          type="text"
                          value={editFormData.location || ''}
                          onChange={(e) => handleEditChange('location', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="Pickup location"
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={handleEditCancel}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={handleEditSave}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode - Enhanced styling
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="card-title text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                        {donation.title}
                      </h2>
                      
                      <div className="flex gap-2 mb-3">
                        <motion.div 
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg relative overflow-hidden ${
                            donation.category === 'food' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            donation.category === 'clothing' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                            donation.category === 'medical' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                            'bg-gradient-to-r from-purple-400 to-purple-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {donation.category}
                        </motion.div>
                        
                        <motion.div 
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg ${
                            donation.status === 'available' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                            donation.status === 'claimed' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                            donation.status === 'completed' ? 'bg-gradient-to-r from-sky-400 to-sky-600' : 
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {donation.status}
                        </motion.div>
                      </div>
                      
                      <p className="text-sm text-gray-700 line-clamp-3 mb-4 leading-relaxed">{donation.description}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm bg-gradient-to-r from-purple-50 to-blue-50 p-2 rounded-lg">
                          <Package className="w-4 h-4 mr-2 text-purple-600" />
                          <span className="font-semibold text-gray-800">Quantity:</span>
                          <span className="ml-1 text-gray-700">{donation.quantity}</span>
                        </div>
                        
                        {donation.location && (
                          <div className="flex items-center text-sm bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg">
                            <MapPin className="w-4 h-4 mr-2 text-green-600" />
                            <span className="font-semibold text-gray-800">Location:</span>
                            <span className="ml-1 text-gray-700">{donation.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-semibold text-gray-800">Created:</span>
                          <span className="ml-1 text-gray-700">{formatDate(donation.createdAt)}</span>
                        </div>
                        
                        {donation.status === 'claimed' && donation.claimerName && (
                          <div className="flex items-center text-sm bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-lg">
                            <User className="w-4 h-4 mr-2 text-amber-600" />
                            <span className="font-semibold text-gray-800">Claimed by:</span>
                            <span className="ml-1 text-gray-700">{donation.claimerName}</span>
                          </div>
                        )}

                        {donation.ratings && donation.ratings.length > 0 && (
                          <div className="flex items-center text-sm bg-gradient-to-r from-yellow-50 to-amber-50 p-2 rounded-lg">
                            <Star className="w-4 h-4 mr-2 text-yellow-600" />
                            <span className="font-semibold text-gray-800">Average Rating:</span>
                            <span className="ml-1 text-gray-700">
                              {(donation.ratings.reduce((sum, r) => sum + r.rating, 0) / donation.ratings.length).toFixed(1)}/5
                              ({donation.ratings.length} rating{donation.ratings.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-actions justify-between mt-6">
                        <div className="text-xs font-medium bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ✓ Created by you
                          {!canEdit(donation) && !canDelete(donation) && (
                            <div className="text-gray-500 mt-1 font-normal">
                              {donation.status === 'claimed' ? 'Cannot edit/delete claimed donations' : 
                               donation.status === 'expired' ? 'Cannot edit/delete expired donations' : 
                               'Cannot edit/delete this donation'}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {canEdit(donation) && (
                            <motion.button 
                              className="btn btn-primary btn-sm bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white shadow-lg hover:shadow-xl"
                              onClick={() => handleEditStart(donation)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </motion.button>
                          )}
                          {canDelete(donation) && (
                            <motion.button 
                              className={`btn btn-error btn-sm bg-gradient-to-r from-red-500 to-pink-600 border-none text-white shadow-lg hover:shadow-xl ${deletingId === donation._id ? 'loading' : ''}`}
                              onClick={() => handleDeleteDonation(donation._id)}
                              disabled={deletingId === donation._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              {deletingId === donation._id ? (
                                'Deleting...'
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      </div>
    </motion.div>
  );
};

export default MyDonationsPage;
