import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Phone, Mail, Globe, UtensilsCrossed, Stethoscope, Shirt, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const NGOProfilesPage = () => {
  const [ngoProfiles, setNgoProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNGOProfiles();
  }, []);

  const fetchNGOProfiles = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/ngo-profiles/public', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setNgoProfiles(data.profiles || data);
      } else {
        throw new Error('Failed to fetch NGO profiles');
      }
    } catch (error) {
      console.error('Error fetching NGO profiles:', error);
      setError('Failed to load NGO profiles');
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Make an Impact
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover NGOs in your community and see how you can help them achieve their mission. 
            Every contribution makes a difference in someone's life.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-600 mb-8"
          >
            {error}
          </motion.div>
        )}

        {ngoProfiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Heart className="text-6xl text-gray-300 mx-auto mb-4" size={96} />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No NGO Profiles Available</h3>
            <p className="text-gray-500">Check back later to see how you can make an impact!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ngoProfiles.map((ngo, index) => (
              <motion.div
                key={ngo._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* NGO Header */}
                  <div className="flex items-center mb-4">
                    {ngo.logo && (
                      <img
                        src={`http://localhost:3004${ngo.logo}`}
                        alt={`${ngo.organizationName} logo`}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{ngo.organizationName}</h3>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="mr-1" size={16} />
                        {ngo.location}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {ngo.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {ngo.contactInfo?.phone && (
                      <div className="flex items-center">
                        <Phone className="mr-2" size={16} />
                        {ngo.contactInfo.phone}
                      </div>
                    )}
                    {ngo.contactInfo?.email && (
                      <div className="flex items-center">
                        <Mail className="mr-2" size={16} />
                        {ngo.contactInfo.email}
                      </div>
                    )}
                    {ngo.contactInfo?.website && (
                      <div className="flex items-center">
                        <Globe className="mr-2" size={16} />
                        <a
                          href={ngo.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Current Needs */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Current Needs:</h4>
                    <div className="space-y-2">
                      {ngo.needs.slice(0, 2).map((need, needIndex) => (
                        <div key={needIndex} className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getNeedIcon(need.type)}
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                              {need.type === 'money' ? `$${need.targetAmount} needed` : need.type}
                            </span>
                          </div>
                          {need.type === 'money' && (
                            <div className="flex-1 ml-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getProgressPercentage(need.currentAmount || 0, need.targetAmount)}%`
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                ${need.currentAmount || 0} / ${need.targetAmount}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      {ngo.needs.length > 2 && (
                        <p className="text-sm text-gray-500">
                          +{ngo.needs.length - 2} more needs
                        </p>
                      )}
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Link
                    to={`/ngo-profile/${ngo._id}`}
                    className="w-full bg-gradient-to-r from-pink-500 to-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-pink-600 hover:to-green-600 transition-all duration-300 block text-center"
                  >
                    View Full Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOProfilesPage;
