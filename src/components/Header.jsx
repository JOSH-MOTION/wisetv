import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { User, LogOut, Menu, X } from 'lucide-react';
import WiseLogo from '../assets/WISE.svg';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsUserMenuOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`bg-[#fc561c] bg-opacity-90 text-white fixed z-30 top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl rounded-2xl shadow-xl transition-transform duration-300 mb-6 ${
        showNav ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
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
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>

        <nav
          className={`lg:flex space-x-6 ${
            isOpen
              ? 'block absolute top-16 left-0 w-full bg-[#fc561c] bg-opacity-95 p-4 rounded-b-2xl shadow-lg backdrop-blur-sm'
              : 'hidden lg:block'
          }`}
        >
          <Link
            to="/"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            Home
          </Link>
          <Link
            to="/documentaries"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            Documentaries
          </Link>
          <Link
            to="/news"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            News
          </Link>
          <Link
            to="/blog"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            Blog
          </Link>
          <Link
            to="/reports"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            Reports
          </Link>
          <Link
            to="/interviews"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            Interviews
          </Link>
          <Link
            to="/movies"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            Movies
          </Link>
          <Link
            to="/photojournalism"
            onClick={closeMenu}
            className="block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-[#fc561c]"
          >
            Photojournalism
          </Link>
          <Link to="/videos" onClick={closeMenu} className="block hover:text-gray-200 py-2 px-2 rounded ...">
  Videos
</Link>

          {user && (
            <div className="relative lg:inline-block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="block lg:inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                {user.email.split('@')[0]}
              </button>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isUserMenuOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                className={`lg:absolute lg:right-0 lg:mt-2 lg:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${
                  isUserMenuOpen ? 'block' : 'hidden'
                }`}
              >
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </motion.div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;