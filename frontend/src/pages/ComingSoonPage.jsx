import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoonPage = () => {
  return (
    <motion.div 
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 overflow-hidden flex items-center justify-center"
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
        {['🚀', '⭐', '✨', '🌟', '💫', '🎉'].map((icon, index) => (
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
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Animated Icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="relative"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Clock className="w-24 h-24 text-purple-600" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We're working hard to bring you something amazing! This feature is currently under development and will be available soon.
          </motion.p>

          {/* Features Preview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: '🎯', title: 'New Features', desc: 'Enhanced functionality' },
              { icon: '🚀', title: 'Better Experience', desc: 'Improved user interface' },
              { icon: '💡', title: 'Innovation', desc: 'Cutting-edge technology' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.0 + index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2 + index * 0.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ComingSoonPage;
