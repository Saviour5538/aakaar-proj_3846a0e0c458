import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              GraphMind
            </Link>
            <div className="hidden md:block ml-10">
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Dashboard
              </Link>
              <Link to="/documents" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Documents
              </Link>
              <Link to="/conversations" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Conversations
              </Link>
              <Link to="/chat" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Chat
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Dashboard
            </Link>
            <Link to="/documents" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Documents
            </Link>
            <Link to="/conversations" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Conversations
            </Link>
            <Link to="/chat" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Chat
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;