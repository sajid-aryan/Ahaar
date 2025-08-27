import React from 'react'
import { Link } from 'react-router-dom'
import { Info, Menu, Home, UserPlus, LogIn, LogOut, User, History, Package, Building2, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar py-4 bg-gradient-to-b from-rose-200 to-red-150" data-theme="garden">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold">
          Ahaar
        </Link>
      </div>
      
      <div className="flex-none gap-2">
        <details className="dropdown dropdown-end">
          <summary className="btn btn-ghost transition duration-300 ease-in-out hover:scale-105 transform">
            <Menu />
          </summary>
          <ul className="menu dropdown-content bg-neutral-50 rounded-box z-[1] w-52 p-2 shadow">
            <li><Link to="/" className="flex items-center gap-2"><Home /> Home</Link></li>
            <li><Link to="/about" className="flex items-center gap-2"><Info /> About</Link></li>
            <li><Link to="/ngo-profiles" className="flex items-center gap-2"><Building2 /> NGO Profiles</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/browse" className="flex items-center gap-2"><Home /> Browse Donations</Link></li>
                <li><Link to="/create-donation" className="flex items-center gap-2"><UserPlus /> Create Donation</Link></li>
                <li><Link to="/my-donations" className="flex items-center gap-2"><Package /> My Donations</Link></li>
                {user?.userType === 'ngo' ? (
                  <>
                    <li><Link to="/claimed-donations" className="flex items-center gap-2"><History /> My Claimed Donations</Link></li>
                    <li><Link to="/manage-profile" className="flex items-center gap-2"><Settings /> {user?.name} - Manage Profile</Link></li>
                  </>
                ) : (
                  <li><a className="flex items-center gap-2"><User /> {user?.name} ({user?.userType})</a></li>
                )}
                <li><button onClick={handleLogout} className="flex items-center gap-2"><LogOut /> Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="flex items-center gap-2"><LogIn /> Login</Link></li>
                <li><Link to="/signup" className="flex items-center gap-2"><UserPlus /> Sign Up</Link></li>
              </>
            )}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default Navbar;