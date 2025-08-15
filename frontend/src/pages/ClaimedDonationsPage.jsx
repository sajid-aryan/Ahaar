import { useState, useEffect } from "react";
import { Link } from 'react-router';
import { ArrowLeft, MapPin, Package, Calendar, User, Star } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../../utils/date';
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
        const res = await axios.get(`http://localhost:3004/api/donations/claimed/${user._id}`, {
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
      const response = await axios.post(`http://localhost:3004/api/donations/${feedbackModal.donationId}/feedback`, {
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
          <p className="text-lg opacity-70 mb-4">Access denied. Only NGOs can view claimed donations.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Claimed Donations</h1>
          <Link to="/browse" className="btn btn-ghost">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Browse
          </Link>
        </div>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claimedDonations.map((donation) => (
              <div key={donation._id} className="card bg-base-100 shadow-xl border border-orange-200">
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
                    <div className="badge badge-warning">
                      {donation.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">{donation.description}</p>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-semibold">Quantity:</span>
                      <span className="ml-1">{donation.quantity}</span>
                    </div>
                    
                    {donation.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-semibold">Location:</span>
                        <span className="ml-1">{donation.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-semibold">Donated by:</span>
                      <span className="ml-1">{donation.donorName} ({donation.donorType})</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-semibold">Claimed on:</span>
                      <span className="ml-1">{formatDate(donation.claimedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions justify-between mt-4">
                    <div className="text-xs text-success font-medium">
                      ✓ Claimed by your organization
                    </div>
                    <div className="flex gap-2">
                      {/* Show feedback if already submitted */}
                      {donation.feedback && donation.feedback.ngoRating ? (
                        <div className="btn btn-success btn-sm btn-disabled">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Rated {donation.feedback.ngoRating}/5
                        </div>
                      ) : (
                        /* Show feedback button for all claimed donations */
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => openFeedbackModal(donation._id)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Give Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default ClaimedDonationsPage;
