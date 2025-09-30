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
    <motion.div 
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 overflow-hidden py-8"
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
        {['🏥', '🤝', '❤️', '🌟', '🏠', '✨'].map((icon, index) => (
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
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {ngoProfiles.map((ngo, index) => (
              <motion.div
                key={ngo._id}
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
                <motion.div className="card-body relative z-10">
                  {/* NGO Header */}
                  <motion.div 
                    className="flex items-center mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {ngo.logo && (
                      <motion.img
                        src={`http://localhost:3004${ngo.logo}`}
                        alt={`${ngo.organizationName} logo`}
                        className="w-12 h-12 rounded-full object-cover mr-3 shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <div>
                      <motion.h3 
                        className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {ngo.organizationName}
                      </motion.h3>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="mr-1" size={16} />
                        {ngo.location}
                      </p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.p 
                    className="text-gray-700 mb-4 line-clamp-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    {ngo.description}
                  </motion.p>

                  {/* Contact Info */}
                  <motion.div 
                    className="space-y-2 mb-4 text-sm text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
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
                          className="text-blue-600 hover:underline transition-colors duration-200"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </motion.div>

                  {/* Current Needs */}
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">Current Needs:</h4>
                    <div className="space-y-2">
                      {ngo.needs.slice(0, 2).map((need, needIndex) => (
                        <motion.div 
                          key={needIndex} 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.7 + needIndex * 0.1 }}
                        >
                          <div className="flex items-center">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              transition={{ duration: 0.2 }}
                            >
                              {getNeedIcon(need.type)}
                            </motion.div>
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                              {need.type === 'money' ? `$${need.targetAmount} needed` : need.type}
                            </span>
                          </div>
                          {need.type === 'money' && (
                            <div className="flex-1 ml-3">
                              <motion.div 
                                className="w-full bg-gray-200 rounded-full h-2"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: index * 0.1 + 0.8 + needIndex * 0.1, duration: 0.5 }}
                              >
                                <motion.div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getProgressPercentage(need.currentAmount || 0, need.targetAmount)}%`
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${getProgressPercentage(need.currentAmount || 0, need.targetAmount)}%` 
                                  }}
                                  transition={{ delay: index * 0.1 + 0.9 + needIndex * 0.1, duration: 0.7 }}
                                />
                              </motion.div>
                              <span className="text-xs text-gray-500">
                                ${need.currentAmount || 0} / ${need.targetAmount}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {ngo.needs.length > 2 && (
                        <motion.p 
                          className="text-sm text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 1.0 }}
                        >
                          +{ngo.needs.length - 2} more needs
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* View Profile Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 1.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={`/ngo-profile/${ngo._id}`}
                      className="w-full bg-gradient-to-r from-pink-500 to-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-pink-600 hover:to-green-600 transition-all duration-300 block text-center shadow-lg hover:shadow-xl backdrop-blur-sm"
                    >
                      View Full Profile
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      </div>
    </motion.div>
  );
};

export default NGOProfilesPage;
