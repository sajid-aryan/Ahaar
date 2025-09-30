import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  const { isAuthenticated, user } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.section 
      className="relative text-center py-20 px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative z-10">
      {isAuthenticated && user ? (
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h2 
            className="text-2xl font-semibold text-gray-700 mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Welcome back, {user.name}! 👋
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 capitalize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Ready to make a difference?
          </motion.p>
        </motion.div>
      ) : null}
      
      <motion.h1 
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 gradient-text"
        variants={itemVariants}
        style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: '1.1',
          marginBottom: '1.5rem'
        }}
      >
        Give More, Waste Less – Empower Communities with Ahaar
      </motion.h1>
      
      <motion.p 
        className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        variants={itemVariants}
      >
        A platform where restaurants and individuals donate surplus food, clothes, and essentials to NGOs helping those in need.
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-center gap-4 items-center"
        variants={itemVariants}
      >
        {isAuthenticated ? (
          <>
            {user?.userType === 'donor' ? (
              <>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/create-donation" className="btn btn-success transition-all duration-300 shadow-lg glass-card sparkle animate-pulse-glow">
                    Start Donating
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/browse" className="btn btn-outline btn-success transition-all duration-300 shadow-lg animate-shimmer">
                    Browse Donations
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/ngo-profiles" className="btn btn-outline btn-info transition-all duration-300 shadow-lg">
                    See How You Can Help
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/browse" className="btn btn-outline btn-success transition-all duration-300 shadow-lg animate-shimmer">
                    Browse Donations
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/ngo-profiles" className="btn btn-outline btn-info transition-all duration-300 shadow-lg">
                    See How You Can Help
                  </Link>
                </motion.div>
              </>
            )}
          </>
        ) : (
          <>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link to="/signup" className="btn btn-success transition-all duration-300 shadow-lg glass-card sparkle animate-pulse-glow">
                Get Started
              </Link>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link to="/ngo-profiles" className="btn btn-outline btn-info transition-all duration-300 shadow-lg animate-shimmer">
                See How You Can Help
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
