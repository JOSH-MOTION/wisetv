import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import WiseLogo from '../assets/WISE.svg'; // Import the Wise.svg logo

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { name: 'Home', path: '/' },
    { name: 'Documentaries', path: '/documentaries' },
    { name: 'News', path: '/news' },
    { name: 'Reports', path: '/reports' },
    { name: 'Interviews', path: '/interviews' },
    { name: 'Movies', path: '/movies' },
    { name: 'Photojournalism', path: '/photojournalism' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/wisetv' },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: 'https://facebook.com/wisetv' },
    { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com/@wisetv' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/wisetv' },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Subscribed to newsletter!');
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About and Newsletter */}
          <div>
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center">
                <img
                  src='/WISE.svg'
                  alt="WiseTV Logo"
                  className="h-10 w-auto mr-3"
                  onError={(e) => {
                    console.log('Failed to load WiseTV logo');
                    e.target.src = 'https://via.placeholder.com/100x40/CCCCCC/FFFFFF?text=Logo';
                  }}
                />
              </Link>
            </div>
            <p className="text-slate-300 mb-6 max-w-md text-sm leading-relaxed">
              Empowering the next generation with inspiring stories through documentaries, news, and engaging content.
            </p>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-slate-200">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-medium transition-all duration-300">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Explore Links and Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Explore</h4>
            <nav className="grid grid-cols-2 gap-2 mb-6">
              {exploreLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-slate-300 hover:text-red-300 hover:pl-2 transition-all duration-200 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm border border-slate-600 p-2 rounded-full text-slate-300 hover:text-red-300 hover:border-red-500 transition-all duration-300"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © {currentYear} WiseTV. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-slate-400 hover:text-red-300 transition-all duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-400 hover:text-red-300 transition-all duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-red-600/80 backdrop-blur-sm hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 group"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-200" />
      </button>
    </footer>
  );
};

export default Footer;