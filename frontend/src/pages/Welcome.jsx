import React from 'react'
import { motion } from 'framer-motion'
import Hero from "../components/Hero.jsx";
// import HowItWorks from '../components/HowItWorks.jsx';

const Welcome = () => {
  return (
    <motion.div 
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ultra Dynamic Gradient Orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 opacity-20"
          style={{
            background: 'radial-gradient(circle, #ff9a9e 0%, #fecfef 50%, transparent 70%)',
            filter: 'blur(3px)'
          }}
          animate={{ 
            scale: [1, 1.4, 0.8, 1],
            rotate: [0, 120, 240, 360],
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 opacity-25"
          style={{
            background: 'radial-gradient(circle, #a8edea 0%, #fed6e3 50%, transparent 70%)',
            filter: 'blur(2px)'
          }}
          animate={{ 
            scale: [1, 1.6, 0.6, 1],
            rotate: [0, -90, -180, -360],
            x: [0, -60, 40, 0],
            y: [0, 30, -50, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div
          className="absolute top-1/3 -right-20 w-64 h-64 opacity-15"
          style={{
            background: 'radial-gradient(circle, #ffd89b 0%, #19547b 100%)',
            filter: 'blur(4px)'
          }}
          animate={{ 
            y: [0, -60, 40, 0],
            scale: [1, 1.3, 0.7, 1],
            rotate: [0, 180, 0]
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Advanced Particle System */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: `linear-gradient(45deg, ${
                ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'][i % 7]
              }, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${10 + Math.random() * 10}px ${
                ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'][i % 7]
              }`
            }}
            animate={{ 
              y: [0, -100 - Math.random() * 100, 0],
              x: [0, 50 - Math.random() * 100, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}

        {/* Morphing Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 h-20 opacity-15"
          style={{
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50% 20% 80% 40%'
          }}
          animate={{ 
            rotate: [0, 360],
            borderRadius: [
              '50% 20% 80% 40%',
              '20% 80% 40% 50%',
              '80% 40% 50% 20%',
              '40% 50% 20% 80%',
              '50% 20% 80% 40%'
            ],
            scale: [1, 1.5, 0.8, 1.2, 1],
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 15, -10, 0]
          }}
          transition={{ 
            duration: 16, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-32 h-32 opacity-20"
          style={{
            background: 'conic-gradient(from 0deg, #ff9a9e, #fecfef, #ff9a9e)',
            borderRadius: '30% 70% 40% 60%'
          }}
          animate={{ 
            rotate: [0, -360],
            borderRadius: [
              '30% 70% 40% 60%',
              '70% 30% 60% 40%',
              '40% 60% 30% 70%',
              '60% 40% 70% 30%',
              '30% 70% 40% 60%'
            ],
            scale: [1, 0.6, 1.4, 1],
            x: [0, -25, 15, 0],
            y: [0, 20, -15, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Dynamic Wave Interference Pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: `
              repeating-conic-gradient(from 0deg at 50% 50%, 
                transparent 0deg, 
                rgba(255, 255, 255, 0.3) 30deg, 
                transparent 60deg
              )
            `
          }}
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Flowing Energy Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#ff6b6b', stopOpacity:0.5}} />
              <stop offset="50%" style={{stopColor:'#4ecdc4', stopOpacity:0.3}} />
              <stop offset="100%" style={{stopColor:'#45b7d1', stopOpacity:0.5}} />
            </linearGradient>
          </defs>
          <motion.path
            d="M 0,200 Q 200,50 400,200 T 800,200"
            stroke="url(#grad1)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 0,400 Q 300,250 600,400 T 1200,400"
            stroke="url(#grad1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </svg>

        {/* Animated Mesh Gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(255, 182, 193, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(173, 216, 230, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 25% 75%, rgba(152, 251, 152, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 218, 185, 0.4) 0%, transparent 50%)
            `,
            filter: 'blur(1px)'
          }}
          animate={{
            background: [
              `radial-gradient(circle at 25% 25%, rgba(255, 182, 193, 0.4) 0%, transparent 50%),
               radial-gradient(circle at 75% 25%, rgba(173, 216, 230, 0.4) 0%, transparent 50%),
               radial-gradient(circle at 25% 75%, rgba(152, 251, 152, 0.4) 0%, transparent 50%),
               radial-gradient(circle at 75% 75%, rgba(255, 218, 185, 0.4) 0%, transparent 50%)`,
              `radial-gradient(circle at 75% 75%, rgba(255, 182, 193, 0.4) 0%, transparent 50%),
               radial-gradient(circle at 25% 75%, rgba(173, 216, 230, 0.4) 0%, transparent 50%),
               radial-gradient(circle at 75% 25%, rgba(152, 251, 152, 0.4) 0%, transparent 50%),
               radial-gradient(circle at 25% 25%, rgba(255, 218, 185, 0.4) 0%, transparent 50%)`
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <Hero />
    </motion.div>
  )
}

export default Welcome;