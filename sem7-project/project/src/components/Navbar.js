import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ isDarkMode, toggleTheme, isLoggedIn, logout }) => {
  // Example: 3 unread notifications (can be dynamic)
  const unreadCount = 3;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200 shadow-sm'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}
            >
              SubHub
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Home
              </Link>
              <Link 
                to="/facts" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Creators
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                About
              </Link>
              <Link 
                to="/subscriptions" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Subscriptions
              </Link>
              <Link 
                to="/contact" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Contact
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/edit-profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-blue-400 hover:text-white hover:bg-gray-700' : 'text-blue-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell Icon links to notifications page */}
            <Link to="/notifications" className="relative focus:outline-none group" aria-label="Notifications">
              <svg
                className={`w-6 h-6 ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'} transition-colors duration-200`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
              )}
            </Link>
            {isLoggedIn ? (
              <>
                <button
                  onClick={logout}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white bg-red-600 hover:bg-red-700' : 'text-white bg-red-600 hover:bg-red-700'}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-white bg-gray-900 hover:bg-gray-800'}`}
              >
                Login
              </Link>
            )}
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 