import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import WiseLogo from '../assets/WISE.svg';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6';

// ── Update this to your actual WhatsApp channel link ──
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb7cFqY2UPBJuaosrU3S';

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
    { name: 'Videos', path: '/videos' },
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
    // ── WhatsApp channel added to social icons row ──
    { name: 'WhatsApp', icon: <WhatsAppIcon size={20} />, url: WHATSAPP_CHANNEL_URL },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Subscribed to newsletter!');
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">

      {/* ── WhatsApp Channel Banner ── */}
      <div className="bg-[#25D366] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <WhatsAppIcon size={24} />
            <span className="font-semibold text-white">Join our WhatsApp Channel for instant updates</span>
          </div>
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white text-[#25D366] font-bold px-5 py-2 rounded-full hover:bg-green-50 transition-colors text-sm shadow"
          >
            Follow Now
          </a>
        </div>
      </div>

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
                  <a href="tel:+233506217671" className="hover:text-[#fc561c] transition-all duration-200">0506 217 671</a>
                  <a href="tel:+233303981823" className="hover:text-[#fc561c] transition-all duration-200">030 398 1823</a>
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
                  className={`border p-2 rounded-full transition-all duration-300 ${
                    social.name === 'WhatsApp'
                      ? 'bg-[#25D366]/20 border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/30 hover:border-[#25D366]'
                      : 'bg-white/10 backdrop-blur-sm border-slate-600 text-slate-300 hover:text-[#fc561c] hover:border-[#fc561c]'
                  }`}
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
            <Link to="/privacy" className="text-slate-400 hover:text-[#fc561c] transition-all duration-200">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-[#fc561c] transition-all duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-6 bg-[#fc561c]/80 backdrop-blur-sm hover:bg-[#fc561c] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 group"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-200" />
      </button>
    </footer>
  );
};

export default Footer;