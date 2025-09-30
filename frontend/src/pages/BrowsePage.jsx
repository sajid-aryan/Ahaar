import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Package, Heart, Clock, Phone, Info, Star } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../../utils/date';
import toast from 'react-hot-toast';
import ClaimConfirmationModal from '../components/ClaimConfirmationModal';

const BrowsePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [claimingId, setClaimingId] = useState(null);
  const [likingId, setLikingId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    donation: null
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:3004/api/donations");
        console.log('Donations response:', res.data);
        setDonations(res.data.donations || []);
      } catch (error) {
        console.log("Error fetching donations:", error);
        setError("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations
    .filter(donation => {
      // Filter out expired, claimed, and completed donations
      if (donation.status === 'expired' || donation.status === 'claimed' || donation.status === 'completed') {
        return false;
      }
      
      // Check if donation has expired based on expiry date
      if (donation.expiryDate) {
        const expiryDate = new Date(donation.expiryDate);
        const currentDate = new Date();
        if (expiryDate < currentDate) {
          return false;
        }
      }
      
      // Apply category filter
      if (filter === 'all') return true;
      return donation.category === filter;
    })
    .sort((a, b) => {
      // Sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const categories = ['all', 'food', 'clothing', 'medical', 'other'];

  const handleClaimDonation = async (donationId) => {
    if (!user || user.userType !== 'ngo') {
      toast.error('Only NGOs can claim donations');
      return;
    }

    // Check if the donation was created by the same NGO
    const donation = donations.find(d => d._id === donationId);
    if (donation && String(donation.donorId) === String(user._id)) {
      toast.error('You cannot claim your own donation');
      return;
    }

    // Show confirmation modal
    setConfirmationModal({
      isOpen: true,
      donation: donation
    });
  };

  const confirmClaimDonation = async () => {
    const donationId = confirmationModal.donation._id;
    setClaimingId(donationId);
    
    try {
      const response = await axios.post(`http://localhost:3004/api/donations/${donationId}/claim`, {
        claimerId: user._id,
        claimerName: user.name
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('🎉 Donation claimed successfully! The donor has been notified.');
        // Update the local donations list to reflect the status change
        setDonations(prevDonations => 
          prevDonations.map(donation => 
            donation._id === donationId 
              ? { ...donation, status: 'claimed', claimerId: user._id, claimerName: user.name }
              : donation
          )
        );
        
        // Close confirmation modal
        setConfirmationModal({ isOpen: false, donation: null });
      }
    } catch (error) {
      console.error('Error claiming donation:', error);
      toast.error(error.response?.data?.message || 'Failed to claim donation');
    } finally {
      setClaimingId(null);
    }
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, donation: null });
  };

  const handleLikeDonation = async (donationId) => {
    if (!user) {
      toast.error('Please log in to like donations');
      return;
    }

    setLikingId(donationId);
    
    try {
      const response = await axios.post(`http://localhost:3004/api/donations/${donationId}/like`, {}, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Update the local donations list to reflect the new like count
        setDonations(prevDonations => 
          prevDonations.map(donation => 
            donation._id === donationId 
              ? { 
                  ...donation, 
                  likes: response.data.donation.likes,
                  likedBy: response.data.donation.likedBy
                }
              : donation
          )
        );
      }
    } catch (error) {
      console.error('Error liking donation:', error);
      toast.error(error.response?.data?.message || 'Failed to like donation');
    } finally {
      setLikingId(null);
    }
  };

  const closeRatingModal = () => {
    setRatingModal({ isOpen: false, donationId: null, rating: 0, comment: '' });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-3 h-3 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-3 h-3 text-gray-300" />
        );
      }
    }
    
    return stars;
  };

  return (
    <>
    <motion.div 
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ultra-Enhanced Background Effects */}
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

        {/* Floating Food Icons */}
        {['🍎', '🥖', '🥕', '🍇', '🥑', '🍊', '🥬', '🍌'].map((icon, index) => (
          <motion.div
            key={index}
            className="absolute text-6xl opacity-15"
            style={{
              left: `${10 + (index * 10)}%`,
              top: `${20 + (index * 8)}%`,
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
              delay: index * 0.5
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
              delay: Math.random() * 2,
              ease: "easeInOut"
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
      <div className="container mx-auto px-6 py-8">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Browse Donations</h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="btn btn-ghost">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`btn btn-sm ${filter === category ? 'btn-primary' : 'btn-outline'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="text-center text-primary py-10">
            <span className="loading loading-spinner loading-lg"></span>
            <p>Loading donations...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {filteredDonations.length === 0 && !loading && !error && (
          <div className="text-center py-10">
            <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
            <p className="text-lg opacity-70">No donations available in this category.</p>
          </div>
        )}

        {filteredDonations.length > 0 && !loading && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {filteredDonations.map((donation, index) => (
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
                  <figure className="relative overflow-hidden">
                    <img 
                      src={`http://localhost:3004${donation.image}`}
                      alt={donation.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Image Overlay Effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </figure>
                )}
                
                <motion.div className="card-body relative z-10">
                  <motion.h2 
                    className="card-title text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {donation.title}
                  </motion.h2>
                  
                  <motion.div 
                    className="flex gap-2 mb-3"
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                  >
                    <motion.div 
                      className={`badge text-white font-semibold shadow-lg backdrop-blur-sm border-0 px-3 py-2 ${
                        donation.category === 'food' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        donation.category === 'clothing' ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                        donation.category === 'medical' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                        'bg-gradient-to-r from-orange-500 to-red-600'
                      } transition-all duration-200`}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {donation.category}
                      </span>
                    </motion.div>
                  </motion.div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">{donation.description}</p>
                  
                  {/* Pickup Instructions - Only visible to NGOs */}
                  {user?.userType === 'ngo' && donation.pickupInstructions && (
                    <div className="flex items-start gap-1 text-sm text-blue-600 mt-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Pickup:</span> {donation.pickupInstructions}
                      </div>
                    </div>
                  )}
                  
                  {/* Contact Phone - Only visible to NGOs */}
                  {user?.userType === 'ngo' && donation.contactPhone && (
                    <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                      <Phone className="w-4 h-4" />
                      <span>Contact: {donation.contactPhone}</span>
                    </div>
                  )}
                  
                  {/* Expiry Date */}
                  {donation.expiryDate && (
                    <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
                      <Clock className="w-4 h-4" />
                      <span>Expires: {formatDate(donation.expiryDate)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mt-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold mb-1">
                        {donation.quantity}
                      </span>
                      {donation.location && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {donation.location}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      {/* Right side content can go here if needed */}
                    </div>
                  </div>
                  
                  <div className="card-actions justify-between mt-4">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>By</span>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Link 
                            to={`/donor-profile/${donation.donorId._id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                          >
                            {donation.donorName}
                          </Link>
                        </motion.div>
                        {donation.donorId.averageRating > 0 ? (
                          <motion.div 
                            className="flex items-center gap-1 ml-2 p-1 bg-yellow-50/50 rounded-md backdrop-blur-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="flex">
                              {renderStars(donation.donorId.averageRating)}
                            </div>
                            <span className="text-xs text-yellow-700 font-medium">
                              {donation.donorId.averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({donation.donorId.totalRatings})
                            </span>
                          </motion.div>
                        ) : (
                          <span className="text-xs text-gray-400 ml-2 italic">
                            Not Rated
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {/* Like Button and Count */}
                      <div className="flex items-center gap-1">
                        {/* Like Button - only for logged in users */}
                        {user && (
                          <button 
                            className={`btn btn-sm ${
                              donation.likedBy && donation.likedBy.includes(user._id)
                                ? 'btn-error text-white' 
                                : 'btn-outline btn-error'
                            } ${likingId === donation._id ? 'loading' : ''}`}
                            onClick={() => handleLikeDonation(donation._id)}
                            disabled={likingId === donation._id}
                          >
                            <Heart className={`w-4 h-4 ${
                              donation.likedBy && donation.likedBy.includes(user._id)
                                ? 'fill-current' 
                                : ''
                            }`} />
                          </button>
                        )}
                        
                        {/* Like Count - visible to everyone */}
                        {!user && donation.likes > 0 && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-600 fill-current" />
                            <span className="text-red-600 font-semibold text-sm">
                              {donation.likes}
                            </span>
                          </div>
                        )}
                        
                        {user && donation.likes > 0 && (
                          <span 
                            className="text-red-600 font-semibold text-sm transition-all duration-300 ease-out transform hover:scale-110"
                            key={donation.likes}
                          >
                            {donation.likes}
                          </span>
                        )}
                      </div>
                      
                      {/* Claim Button for NGOs */}
                      {user?.userType === 'ngo' && user?._id && (
                        <>
                          {String(donation.donorId) !== String(user._id) ? (
                            <button 
                              className={`btn btn-warning btn-sm ${claimingId === donation._id ? 'loading' : ''}`}
                              onClick={() => handleClaimDonation(donation._id)}
                              disabled={claimingId === donation._id}
                            >
                              {claimingId === donation._id ? 'Claiming...' : 'Claim'}
                            </button>
                          ) : (
                            <button 
                              className="btn btn-disabled btn-sm"
                              disabled
                              title="You cannot claim your own donation"
                            >
                              Your Donation
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      </div>
    </motion.div>

    {/* Claim Confirmation Modal */}
    <ClaimConfirmationModal
      isOpen={confirmationModal.isOpen}
      onClose={closeConfirmationModal}
      onConfirm={confirmClaimDonation}
      donation={confirmationModal.donation}
      isLoading={claimingId !== null}
    />
  </>
  );
};

export default BrowsePage;