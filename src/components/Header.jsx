import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { User, LogOut, Menu, X } from 'lucide-react';
import WiseLogo from '../assets/WISE.svg';

// ── Update to your actual WhatsApp channel link ──
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb7cFqY2UPBJuaosrU3S';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY === 0);
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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/documentaries', label: 'Documentaries' },
    { to: '/news', label: 'News' },
    { to: '/blog', label: 'Blog' },
    { to: '/reports', label: 'Reports' },
    { to: '/interviews', label: 'Interviews' },
    { to: '/movies', label: 'Movies' },
    { to: '/photojournalism', label: 'Photojournalism' },
    { to: '/videos', label: 'Videos' },
  ];

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
              e.target.src = 'https://via.placeholder.com/100x40/CCCCCC/FFFFFF?text=Logo';
            }}
          />
        </Link>

        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        <nav
          className={`lg:flex items-center gap-1 ${
            isOpen
              ? 'block absolute top-16 left-0 w-full bg-[#fc561c] bg-opacity-95 p-4 rounded-b-2xl shadow-lg backdrop-blur-sm'
              : 'hidden lg:flex'
          }`}
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="block lg:inline-block hover:text-gray-200 py-2 px-2 rounded transition-all duration-200 hover:bg-white/10 text-sm whitespace-nowrap"
            >
              {label}
            </Link>
          ))}

          {/* ── WhatsApp channel pill ── */}
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="block lg:inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-1.5 px-3 rounded-full text-xs transition-colors whitespace-nowrap shadow-sm ml-1"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>

          {user && (
            <div className="relative lg:inline-block ml-1">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="block lg:inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all text-sm"
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