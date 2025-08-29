import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Phone, Mail, Globe, UtensilsCrossed, Stethoscope, Shirt, DollarSign, ArrowLeft, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const NGOProfileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ngoProfile, setNgoProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [donationForm, setDonationForm] = useState({
    amount: '',
    paymentMethod: 'credit_card',
    message: ''
  });
  const [donationLoading, setDonationLoading] = useState(false);

  useEffect(() => {
    fetchNGOProfile();
  }, [id]);

  const fetchNGOProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3004/api/ngo-profiles/public/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setNgoProfile(data.profile || data);
      } else {
        throw new Error('Failed to fetch NGO profile');
      }
    } catch (error) {
      console.error('Error fetching NGO profile:', error);
      setError('Failed to load NGO profile');
    } finally {
      setLoading(false);
    }
  };

  const getNeedIcon = (type) => {
    switch (type) {
      case 'food':
        return <UtensilsCrossed className="text-orange-500" />;
      case 'medical':
        return <Stethoscope className="text-red-500" />;
      case 'clothing':
        return <Shirt className="text-blue-500" />;
      case 'money':
        return <DollarSign className="text-green-500" />;
      default:
        return <Heart className="text-pink-500" />;
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const isTargetReached = (need) => {
    if (need.type !== 'money') return false;
    return (need.currentAmount || 0) >= need.targetAmount;
  };

  const handleDonateClick = (need) => {
    if (need.type === 'money') {
      // Check if user is authenticated
      if (!user) {
        toast.error('You must be logged in to make a donation. Please log in and try again.');
        return;
      }
      
      // Check if user is trying to donate to their own profile
      if (user._id === ngoProfile.userId) {
        toast.error('You cannot donate to yourself');
        return;
      }
      
      setSelectedNeed(need);
      setShowDonationForm(true);
      setDonationForm({
        amount: '',
        paymentMethod: 'credit_card',
        message: ''
      });
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!donationForm.amount || parseFloat(donationForm.amount) < 1) {
      toast.error('Please enter a valid donation amount (minimum $1)');
      return;
    }

    setDonationLoading(true);

    try {
      const response = await fetch(`http://localhost:3004/api/ngo-profiles/${id}/needs/${selectedNeed._id}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(donationForm.amount),
          paymentMethod: donationForm.paymentMethod,
          message: donationForm.message
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // Refresh the profile to show updated amounts
        await fetchNGOProfile();
        setShowDonationForm(false);
        setDonationForm({
          amount: '',
          paymentMethod: 'credit_card',
          message: ''
        });
        toast.success(`Thank you for your $${donationForm.amount} donation! Your contribution makes a difference.`);
      } else {
        throw new Error(responseData.message || 'Failed to process donation');
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error(error.message || 'Failed to process donation. Please try again.');
    } finally {
      setDonationLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <LoadingSpinner />;

  if (error || !ngoProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">NGO Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested NGO profile could not be found.'}</p>
          <button
            onClick={() => navigate('/ngo-profiles')}
            className="bg-gradient-to-r from-pink-500 to-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-green-600 transition-all duration-300"
          >
            Back to NGO Profiles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/ngo-profiles')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to NGO Profiles
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-pink-500 to-green-500 p-8 text-white">
            <div className="flex items-center mb-4">
              {ngoProfile.logo && (
                <img
                  src={`http://localhost:3004${ngoProfile.logo}`}
                  alt={`${ngoProfile.organizationName} logo`}
                  className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{ngoProfile.organizationName}</h1>
                <p className="text-lg flex items-center opacity-90">
                  <MapPin className="mr-2" size={20} />
                  {ngoProfile.location}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Organization</h2>
              <p className="text-gray-700 leading-relaxed">{ngoProfile.description}</p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ngoProfile.contactInfo?.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="mr-3 text-blue-500" size={18} />
                    <span>{ngoProfile.contactInfo.phone}</span>
                  </div>
                )}
                {ngoProfile.contactInfo?.email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="mr-3 text-blue-500" size={18} />
                    <span>{ngoProfile.contactInfo.email}</span>
                  </div>
                )}
                {ngoProfile.contactInfo?.website && (
                  <div className="flex items-center text-gray-700">
                    <Globe className="mr-3 text-blue-500" size={18} />
                    <a
                      href={ngoProfile.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit our website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Current Needs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How You Can Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ngoProfile.needs.map((need, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-3">
                      {getNeedIcon(need.type)}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3 capitalize">
                        {need.type === 'money' ? 'Financial Support' : need.type}
                      </h3>
                    </div>

                    <p className="text-gray-700 mb-4">{need.description}</p>

                    {need.type === 'money' && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-500">
                            ${need.currentAmount || 0} / ${need.targetAmount}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              isTargetReached(need) 
                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                                : 'bg-gradient-to-r from-green-400 to-green-600'
                            }`}
                            style={{
                              width: `${getProgressPercentage(need.currentAmount || 0, need.targetAmount)}%`
                            }}
                          ></div>
                        </div>
                        <p className={`text-sm mt-2 ${
                          isTargetReached(need) ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                        }`}>
                          {isTargetReached(need) 
                            ? '🎉 Goal achieved! Thank you to all donors!' 
                            : `${getProgressPercentage(need.currentAmount || 0, need.targetAmount).toFixed(1)}% of goal reached`
                          }
                        </p>
                      </div>
                    )}

                    {need.type === 'money' ? (
                      isTargetReached(need) ? (
                        <div className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center cursor-not-allowed">
                          <CreditCard className="mr-2" size={18} />
                          Target Reached!
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDonateClick(need)}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center"
                        >
                          <CreditCard className="mr-2" size={18} />
                          Donate Now
                        </button>
                      )
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Contact us to learn how you can contribute {need.type} donations.
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Donation Modal */}
      {showDonationForm && selectedNeed && (
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Donate to {ngoProfile.organizationName}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Donating as:</span> {user?.name} ({user?.email})
              </p>
            </div>
            
            <form onSubmit={handleDonationSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={donationForm.amount}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={donationForm.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bkash">bKash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={donationForm.message}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Share a message of support..."
                ></textarea>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDonationForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={donationLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                >
                  {donationLoading ? 'Processing...' : 'Donate'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NGOProfileDetailPage;
