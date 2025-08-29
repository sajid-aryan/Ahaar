import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Package, Heart, Clock, Phone, Info } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../../utils/date';
import toast from 'react-hot-toast';

const BrowsePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [claimingId, setClaimingId] = useState(null);
  const [likingId, setLikingId] = useState(null);

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

    setClaimingId(donationId);
    
    try {
      const response = await axios.post(`http://localhost:3004/api/donations/${donationId}/claim`, {
        claimerId: user._id,
        claimerName: user.name
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Donation claimed successfully!');
        // Update the local donations list to reflect the status change
        setDonations(prevDonations => 
          prevDonations.map(donation => 
            donation._id === donationId 
              ? { ...donation, status: 'claimed', claimerId: user._id, claimerName: user.name }
              : donation
          )
        );
      }
    } catch (error) {
      console.error('Error claiming donation:', error);
      toast.error(error.response?.data?.message || 'Failed to claim donation');
    } finally {
      setClaimingId(null);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Browse Donations</h1>
          <Link to="/" className="btn btn-ghost">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="card bg-base-100 shadow-xl">
                {donation.image && (
                  <figure>
                    <img 
                      src={`http://localhost:3004${donation.image}`}
                      alt={donation.title}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                )}
                
                <div className="card-body">
                  <h2 className="card-title">{donation.title}</h2>
                  
                  <div className="flex gap-2 mb-2">
                    <div className="badge badge-primary">{donation.category}</div>
                  </div>
                  
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
                      By {donation.donorName} ({donation.donorType})
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;