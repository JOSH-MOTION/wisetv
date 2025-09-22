import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WiseLogo from '../assets/WISE.svg'; // Import the Wise.svg logo

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to close menu
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`bg-red-600 bg-opacity-90 text-white fixed z-30 top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl rounded-2xl shadow-xl transition-transform duration-300 mb-6 ${
        showNav ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img
            src={WiseLogo}
            alt="WiseTV Logo"
            className="h-8 w-auto"
            onError={(e) => {
              console.log('Failed to load WiseTV logo');
              e.target.src = 'https://via.placeholder.com/100x40/CCCCCC/FFFFFF?text=Logo';
            }}
          />
        </Link>
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16m-7 6h7'
              }
            />
          </svg>
        </button>
        <nav
          className={`lg:flex space-x-6 ${
            isOpen
              ? 'block absolute top-16 left-0 w-full bg-red-600 bg-opacity-95 p-4 rounded-b-2xl shadow-lg backdrop-blur-sm'
              : 'hidden lg:block'
          }`}
        >
          <Link 
            to="/" 
            onClick={closeMenu} 
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-red-700"
          >
            Home
          </Link>
          <Link 
            to="/documentaries" 
            onClick={closeMenu} 
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-red-700"
          >
            Documentaries
          </Link>
          <Link 
            to="/news" 
            onClick={closeMenu} 
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-red-700"
          >
            News
          </Link>
          <Link 
            to="/reports" 
            onClick={closeMenu} 
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-red-700"
          >
            Reports
          </Link>
          <Link 
            to="/interviews" 
            onClick={closeMenu} 
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-red-700"
          >
            Interviews
          </Link>
          <Link 
            to="/movies" 
            onClick={closeMenu} 
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-red-700"
          >
            Movies
          </Link>
          <Link 
            to="/photojournalism" 
            onClick={closeMenu} 
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-red-700"
          >
            Photojournalism
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;