import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle, User, Calendar, MapPin, Package } from 'lucide-react';

const ClaimConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  donation, 
  isLoading 
}) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!confirmed) {
      alert('Please confirm that you understand the responsibilities');
      return;
    }
    onConfirm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryEmoji = (category) => {
    switch (category?.toLowerCase()) {
      case 'food': return '🍽️';
      case 'clothing': return '👕';
      case 'medical': return '💊';
      default: return '📦';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'food': return 'from-green-500 to-emerald-600';
      case 'clothing': return 'from-blue-500 to-blue-600';
      case 'medical': return 'from-red-500 to-red-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  if (!donation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <h2 className="text-2xl font-bold">Confirm Donation Claim</h2>
              </div>
              
              <p className="text-orange-100">
                Please review the donation details and confirm your commitment
              </p>
            </div>

            {/* Donation Details */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCategoryColor(donation.category)} flex items-center justify-center text-white text-xl`}>
                    {getCategoryEmoji(donation.category)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{donation.title}</h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{donation.description}</p>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">Donor:</span>
                        <span className="ml-1">{donation.donorName}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Package className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium">Category:</span>
                        <span className="ml-1 capitalize">{donation.category}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <span className="font-medium">Location:</span>
                        <span className="ml-1">{donation.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="font-medium">Posted:</span>
                        <span className="ml-1">{formatDate(donation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-yellow-600" />
                  Your Responsibilities
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Contact the donor promptly to arrange pickup</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Coordinate pickup timing and location</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Ensure proper handling and distribution of items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Provide feedback and rating after completion</span>
                  </li>
                </ul>
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  id="confirm-responsibilities"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                  disabled={isLoading}
                />
                <label 
                  htmlFor="confirm-responsibilities" 
                  className="ml-3 text-sm text-gray-700 cursor-pointer"
                >
                  I understand my responsibilities and commit to following through with this donation claim. 
                  I will contact the donor and arrange pickup in a timely manner.
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleConfirm}
                  disabled={!confirmed || isLoading}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    confirmed && !isLoading
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Claiming...
                    </div>
                  ) : (
                    'Confirm Claim'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClaimConfirmationModal;
