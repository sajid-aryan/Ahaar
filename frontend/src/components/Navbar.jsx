import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Menu, Home, UserPlus, LogIn, LogOut, User, History, Package, Building2, Settings, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import NotificationBell from './NotificationBell';
import NotificationDropdown from './NotificationPanel';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false); // Close dropdown after logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -10
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
    <motion.div 
      className="navbar py-4 bg-transparent backdrop-blur-sm relative z-50" 
      data-theme="garden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex-1">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="btn btn-ghost text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold">
            Ahaar
          </Link>
        </motion.div>
      </div>
      
      <div className="flex-none gap-2">
        {/* Notification Bell - Only show when user is logged in */}
        {isAuthenticated && (
          <div className="relative">
            <NotificationBell 
              onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
              className="mr-2"
            />
            <NotificationDropdown 
              isOpen={isNotificationDropdownOpen}
              onClose={() => setIsNotificationDropdownOpen(false)}
            />
          </div>
        )}
        
        <div className="relative" ref={dropdownRef}>
          <motion.button 
            onClick={toggleDropdown}
            className="btn btn-ghost"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={isDropdownOpen ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Menu />
          </motion.button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul 
                className="menu absolute right-0 top-full mt-2 bg-neutral-50 rounded-box z-[9999] w-52 p-2 shadow-lg border border-gray-200"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                  <Link to="/" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-green-100">
                    <Home /> Home
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                  <Link to="/coming-soon" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-blue-100">
                    <Info /> About
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                  <Link to="/ngo-profiles" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-purple-100">
                    <Building2 /> NGO Profiles
                  </Link>
                </motion.li>
                {isAuthenticated ? (
                  <>
                    <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                      <Link to="/browse" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-yellow-100">
                        <Home /> Browse Donations
                      </Link>
                    </motion.li>
                    <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                      <Link to="/create-donation" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-green-100">
                        <UserPlus /> Create Donation
                      </Link>
                    </motion.li>
                    <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                      <Link to="/my-donations" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-orange-100">
                        <Package /> My Donations
                      </Link>
                    </motion.li>
                    {user?.userType === 'admin' && (
                      <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                        <Link to="/admin" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-purple-100">
                          <Shield /> Admin Dashboard
                        </Link>
                      </motion.li>
                    )}
                    {user?.userType === 'ngo' ? (
                      <>
                        <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                          <Link to="/claimed-donations" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-indigo-100">
                            <History /> My Claimed Donations
                          </Link>
                        </motion.li>
                        <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                          <Link to="/manage-profile" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-pink-100">
                            <Settings /> {user?.name} - Manage Profile
                          </Link>
                        </motion.li>
                      </>
                    ) : (
                      <>
                        <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                          <Link to="/manage-user-profile" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-pink-100">
                            <Settings /> {user?.name} - Manage Profile
                          </Link>
                        </motion.li>
                      </>
                    )}
                    <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                      <button onClick={handleLogout} className="flex items-center gap-2 transition-colors hover:bg-red-100">
                        <LogOut /> Logout
                      </button>
                    </motion.li>
                  </>
                ) : (
                  <>
                    <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                      <Link to="/login" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-green-100">
                        <LogIn /> Login
                      </Link>
                    </motion.li>
                    <motion.li variants={itemVariants} whileHover={{ x: 5 }}>
                      <Link to="/signup" onClick={closeDropdown} className="flex items-center gap-2 transition-colors hover:bg-blue-100">
                        <UserPlus /> Sign Up
                      </Link>
                    </motion.li>
                  </>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  </>
  );
};

export default Navbar;