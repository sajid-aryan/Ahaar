import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  User, 
  Calendar, 
  TrendingUp, 
  Heart,
  Package,
  MessageSquare,
  Award
} from 'lucide-react';
import axios from 'axios';
import { formatDate } from '../../utils/date';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DonorProfilePage = () => {
  const { donorId } = useParams();
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonorProfile();
  }, [donorId]);

  const fetchDonorProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3004/api/donations/donor/${donorId}`);
      
      if (response.data.success) {
        setDonorData(response.data);
      } else {
        throw new Error('Failed to fetch donor profile');
      }
    } catch (error) {
      console.error('Error fetching donor profile:', error);
      setError('Failed to load donor profile');
      toast.error('Failed to load donor profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-5 h-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }
    
    return stars;
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-orange-100 text-orange-800',
      clothing: 'bg-blue-100 text-blue-800',
      medical: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getUserTypeLabel = (userType) => {
    const labels = {
      individual: 'Individual',
      restaurant: 'Restaurant',
      ngo: 'NGO'
    };
    return labels[userType] || userType;
  };

  if (loading) return <LoadingSpinner />;

  if (error || !donorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Donor Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested donor profile could not be found.'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-gradient-to-r from-pink-500 to-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-green-600 transition-all duration-300"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const { donor, reviews, reviewCount } = donorData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/browse')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Browse
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donor Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{donor.name}</h1>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getUserTypeLabel(donor.userType)}
                </span>
              </div>

              {/* Rating Section */}
              <div className="text-center mb-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex justify-center items-center mb-2">
                  {renderStars(donor.averageRating)}
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {donor.averageRating > 0 ? donor.averageRating.toFixed(1) : 'No ratings yet'}
                </p>
                <p className="text-sm text-gray-600">
                  Based on {donor.totalRatings} review{donor.totalRatings !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Total Donations</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{donor.donationsCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Completed</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{donor.completedDonationsCount}</span>
                </div>

                {donor.totalMoneyDonated > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Money Donated</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">${donor.totalMoneyDonated}</span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Member Since</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">
                    {formatDate(donor.createdAt).split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {reviewCount} Review{reviewCount !== 1 ? 's' : ''}
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No reviews yet</h3>
                  <p className="text-gray-400">This donor hasn't received any reviews from NGOs yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(review.category)}`}>
                              {review.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            {renderStars(review.feedback.ngoRating)}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.feedback.feedbackDate)}
                          </p>
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-gray-700 mb-4">{review.description}</p>

                      {/* Feedback */}
                      {review.feedback.ngoComment && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700 italic">"{review.feedback.ngoComment}"</p>
                        </div>
                      )}

                      {/* Reviewer Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Reviewed by: {review.claimerId.name}</span>
                        <span>Completed: {formatDate(review.completedAt)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfilePage;
