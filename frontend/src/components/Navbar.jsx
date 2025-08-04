import React from 'react'
import { Link } from 'react-router'
import { Info, Menu, Home, UserPlus } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="navbar py-4 bg-neutral-50 shadow-lg" data-theme="lights">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold">
          Ahaar
        </Link>
      </div>
      
      <div className="flex-none gap-2">
        <details className="dropdown dropdown-end">
          <summary className="btn btn-ghost shadow-md hover:shadow-2xl transition">
            <Menu />
          </summary>
          <ul className="menu dropdown-content bg-neutral-50 rounded-box z-[1] w-40 p-2 shadow">
            <li><Link to="/" className="flex items-center gap-2"><Home /> Home</Link></li>
            <li><Link to="/about" className="flex items-center gap-2"><Info /> About</Link></li>
            <li><Link to="/signup" className="flex items-center gap-2"><UserPlus /> Sign Up</Link></li>
          </ul>
        </details>
      </div>
    </div>
  );
};

export default Navbar;