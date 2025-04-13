import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNav(false); // scrolling down
      } else {
        setShowNav(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
    className={`bg-red-600 bg-opacity-90 text-white fixed z-30 top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl rounded-2xl shadow-xl transition-transform duration-300 ${
      showNav ? 'translate-y-0' : '-translate-y-full'
    }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">WiseTv</h1>
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
          className={`lg:flex space-x-4 ${
            isOpen
              ? 'block absolute top-16 left-0 w-full bg-red-600 p-4'
              : 'hidden lg:block'
          }`}
        >
          <Link to="/" className="block hover:text-gray-200 py-2">Home</Link>
          <Link to="/documentaries" className="block hover:text-gray-200 py-2">Documentaries</Link>
          <Link to="/news" className="block hover:text-gray-200 py-2">News</Link>
          <Link to="/reports" className="block hover:text-gray-200 py-2">Reports</Link>
          <Link to="/interviews" className="block hover:text-gray-200 py-2">Interviews</Link>
          <Link to="/movies" className="block hover:text-gray-200 py-2">Movies</Link>
          <Link to="/photojournalism" className="block hover:text-gray-200 py-2">Photojournalism</Link>
          <Link to="/admin" className="block hover:text-gray-200 py-2">Admin</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
