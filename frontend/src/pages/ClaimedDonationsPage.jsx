import { useState, useEffect } from "react";
import { Link } from 'react-router';
import { ArrowLeft, MapPin, Package, Calendar, User, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../../utils/date';
import { apiUrl } from '../utils/api';
import toast from 'react-hot-toast';

const ClaimedDonationsPage = () => {
  const { user } = useAuthStore();
  const [claimedDonations, setClaimedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, donationId: null, rating: 0, comment: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(null);

  useEffect(() => {
    const fetchClaimedDonations = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/donations/claimed/${user._id}`), {
          withCredentials: true
        });
        console.log('Claimed donations response:', res.data);
        setClaimedDonations(res.data.donations || []);
      } catch (error) {
        console.log("Error fetching claimed donations:", error);
        setError("Failed to load claimed donations");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id && user?.userType === 'ngo') {
      fetchClaimedDonations();
    } else if (user?._id) {
      setLoading(false);
      setError("Access denied. Only NGOs can view claimed donations.");
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmitFeedback = async () => {
    if (feedbackModal.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingFeedback(feedbackModal.donationId);
    
    try {
      const response = await axios.post(apiUrl(`/api/donations/${feedbackModal.donationId}/feedback`), {
        rating: feedbackModal.rating,
        comment: feedbackModal.comment
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Feedback submitted successfully!');
        // Update the local donations list
        setClaimedDonations(prevDonations => 
          prevDonations.map(donation => 
            donation._id === feedbackModal.donationId 
              ? { ...donation, feedback: response.data.donation.feedback }
              : donation
          )
        );
        // Close modal
        setFeedbackModal({ isOpen: false, donationId: null, rating: 0, comment: '' });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(null);
    }
  };

  const openFeedbackModal = (donationId) => {
    setFeedbackModal({ isOpen: true, donationId, rating: 0, comment: '' });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ isOpen: false, donationId: null, rating: 0, comment: '' });
  };

  if (user?.userType !== 'ngo') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
          <p className="text-lg opacity-70 mb-4">Access denied. Only NGOs can view claimed donations.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
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
              ease: "easeInOut",
              delay: Math.random() * 2,
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
          <h1 className="text-3xl font-bold">My Claimed Donations</h1>
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
            <p>Loading claimed donations...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {claimedDonations.length === 0 && !loading && !error && (
          <div className="text-center py-10">
            <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
            <p className="text-lg opacity-70 mb-4">You haven't claimed any donations yet.</p>
            <Link to="/browse" className="btn btn-primary">Browse Available Donations</Link>
          </div>
        )}

        {claimedDonations.length > 0 && !loading && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {claimedDonations.map((donation, index) => (
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
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg bg-gradient-to-r from-amber-400 to-amber-600"
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
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-semibold text-gray-800">Donated by:</span>
                        <span className="ml-1 text-gray-700">{donation.donorName} ({donation.donorType})</span>
                      </div>
                      
                      <div className="flex items-center text-sm bg-gradient-to-r from-indigo-50 to-purple-50 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                        <span className="font-semibold text-gray-800">Claimed on:</span>
                        <span className="ml-1 text-gray-700">{formatDate(donation.claimedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions justify-between mt-6">
                      <div className="text-xs font-medium bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ✓ Claimed by your organization
                      </div>
                      <div className="flex gap-2">
                        {/* Show feedback if already submitted */}
                        {donation.feedback && donation.feedback.ngoRating ? (
                          <motion.div 
                            className="btn btn-success btn-sm bg-gradient-to-r from-green-500 to-emerald-600 border-none text-white shadow-lg btn-disabled"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            Rated {donation.feedback.ngoRating}/5
                          </motion.div>
                        ) : (
                          /* Show feedback button for all claimed donations */
                          <motion.button 
                            className="btn btn-warning btn-sm bg-gradient-to-r from-amber-500 to-orange-600 border-none text-white shadow-lg hover:shadow-xl"
                            onClick={() => openFeedbackModal(donation._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Give Feedback
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      </div>
    </motion.div>

    {/* Feedback Modal */}
    {feedbackModal.isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Rate Your Experience</h3>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">How was your experience with this donor?</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`btn btn-circle btn-sm ${
                      star <= feedbackModal.rating ? 'btn-warning' : 'btn-outline'
                    }`}
                    onClick={() => setFeedbackModal(prev => ({ ...prev, rating: star }))}
                  >
                    <Star className={`w-4 h-4 ${star <= feedbackModal.rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Comments about the pickup experience (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Share your experience with this donor..."
                value={feedbackModal.comment}
                onChange={(e) => setFeedbackModal(prev => ({ ...prev, comment: e.target.value }))}
                maxLength={500}
              />
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={closeFeedbackModal}
              >
                Cancel
              </button>
              <button 
                className={`btn btn-primary ${submittingFeedback === feedbackModal.donationId ? 'loading' : ''}`}
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback === feedbackModal.donationId || feedbackModal.rating === 0}
              >
                {submittingFeedback === feedbackModal.donationId ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClaimedDonationsPage;
