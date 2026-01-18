import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import WiseLogo from '../assets/WISE.svg'; // Import the Wise.svg logo
import { FaTiktok, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { name: 'Home', path: '/' },
    { name: 'Documentaries', path: '/documentaries' },
    { name: 'News', path: '/news' },
    { name: 'Blog', path: '/blog' },
    { name: 'Reports', path: '/reports' },
    { name: 'Interviews', path: '/interviews' },
    { name: 'Movies', path: '/movies' },
    { name: 'Photojournalism', path: '/photojournalism' },
  ];

  const services = [
    'News Reports & Coverage',
    'Documentaries',
    'Commercials',
    'Live Streaming',
    'Events Coverage',
    'Photography',
    'Videography',
    'Voice Overs',
  ];

  const socialLinks = [
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: 'https://www.instagram.com/w_gh.tv?igsh=MXZzczd4amoxbmE1cQ==' },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: 'https://web.facebook.com/profile.php?id=61582270771234' },
    { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, url: 'https://www.youtube.com/@Wgh_Tv' },
    { name: 'X (Twitter)', icon: <FaXTwitter className="w-5 h-5" />, url: 'https://x.com/w_gh_tv' },
    { name: 'TikTok', icon: <FaTiktok className="w-5 h-5" />, url: 'https://www.tiktok.com/@wgh.tv?is_from_webapp=1&sender_device=pc' },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Subscribed to newsletter!');
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About and Newsletter */}
          <div className="lg:col-span-1">
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
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Empowering the next generation with inspiring stories through documentaries, news, and engaging content.
            </p>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-slate-200">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fc561c]"
                  required
                />
                <button className="bg-[#fc561c] hover:bg-[#e64d19] px-6 py-2 rounded-full font-medium transition-all duration-300">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Our Services</h4>
            <nav className="flex flex-col gap-2">
              {services.map((service) => (
                <span
                  key={service}
                  className="text-slate-300 text-sm hover:text-[#fc561c] hover:pl-2 transition-all duration-200 cursor-default"
                >
                  • {service}
                </span>
              ))}
            </nav>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Explore</h4>
            <nav className="flex flex-col gap-2">
              {exploreLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-slate-300 hover:text-[#fc561c] hover:pl-2 transition-all duration-200 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Contact Us</h4>
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:wghtv2@gmail.com" 
                className="flex items-start gap-2 text-slate-300 hover:text-[#fc561c] transition-all duration-200 text-sm"
              >
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>wghtv2@gmail.com</span>
              </a>
              <div className="flex items-start gap-2 text-slate-300 text-sm">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+233506217671" className="hover:text-[#fc561c] transition-all duration-200">
                    0506 217 671
                  </a>
                  <a href="tel:+233303981823" className="hover:text-[#fc561c] transition-all duration-200">
                    030 398 1823
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-300 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>WGH MULTIMEDIA</span>
                  <span>P.O.Box DD162, Dodowa</span>
                  <span className="text-xs text-slate-400 mt-1">Behind Dodowa Market</span>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Follow Us</h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm border border-slate-600 p-2 rounded-full text-slate-300 hover:text-[#fc561c] hover:border-[#fc561c] transition-all duration-300"
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
            <Link to="/privacy" className="text-slate-400 hover:text-[#fc561c] transition-all duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-400 hover:text-[#fc561c] transition-all duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-[#fc561c]/80 backdrop-blur-sm hover:bg-[#fc561c] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 group"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-200" />
      </button>
    </footer>
  );
};

export default Footer;