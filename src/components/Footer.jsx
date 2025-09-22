// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Documentaries', path: '/documentaries' },
    { name: 'News', path: '/news' },
    { name: 'Reports', path: '/reports' },
    { name: 'Interviews', path: '/interviews' },
    { name: 'Movies', path: '/movies' },
    { name: 'Photojournalism', path: '/photojournalism' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.012.388c-.526.197-1.005.462-1.427.884-.422.422-.687.901-.884 1.427-.184.508-.306 1.082-.34 2.029C2.013 7.989 2 8.396 2 12.017s.013 4.028.048 4.976c.034.947.156 1.521.34 2.029.197.526.462 1.005.884 1.427.422.422.901.687 1.427.884.508.184 1.082.306 2.029.34C7.989 21.987 8.396 22 12.017 22s4.028-.013 4.976-.048c.947-.034 1.521-.156 2.029-.34.526-.197 1.005-.462 1.427-.884.422-.422.687-.901.884-1.427.184-.508.306-1.082.34-2.029C21.987 16.045 22 15.638 22 12.017s-.013-4.028-.048-4.976c-.034-.947-.156-1.521-.34-2.029-.197-.526-.462-1.005-.884-1.427-.422-.422-.901-.687-1.427-.884-.508-.184-1.082-.306-2.029-.34C16.045 2.013 15.638 2 12.017 2H12.017zm0 1.982c3.557 0 3.982.013 5.384.048.877.035 1.352.142 1.671.236.42.16.719.351 1.035.667.316.316.507.615.667 1.035.094.319.201.794.236 1.671.035 1.402.048 1.827.048 5.384s-.013 3.982-.048 5.384c-.035.877-.142 1.352-.236 1.671-.16.42-.351.719-.667 1.035-.316.316-.615.507-1.035.667-.319.094-.794.201-1.671.236-1.402.035-1.827.048-5.384.048s-3.982-.013-5.384-.048c-.877-.035-1.352-.142-1.671-.236-.42-.16-.719-.351-1.035-.667-.316-.316-.507-.615-.667-1.035-.094-.319-.201-.794-.236-1.671C2.995 16.045 2.982 15.62 2.982 12.017s.013-3.982.048-5.384c.035-.877.142-1.352.236-1.671.16-.42.351-.719.667-1.035.316-.316.615-.507 1.035-.667.319-.094.794-.201 1.671-.236 1.402-.035 1.827-.048 5.384-.048zm0 3.37c-3.706 0-6.715 3.009-6.715 6.715s3.009 6.715 6.715 6.715 6.715-3.009 6.715-6.715-3.009-6.715-6.715-6.715zm0 11.058c-2.396 0-4.343-1.947-4.343-4.343s1.947-4.343 4.343-4.343 4.343 1.947 4.343 4.343-1.947 4.343-4.343 4.343zM18.533 5.235c0-.866.702-1.568 1.568-1.568s1.568.702 1.568 1.568-.702 1.568-1.568 1.568-1.568-.702-1.568-1.568z"/>
        </svg>
      ),
      url: 'https://instagram.com/wisetv',
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: 'https://facebook.com/wisetv',
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      url: 'https://youtube.com/@wisetv',
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: 'https://twitter.com/wisetv',
    },
    {
      name: 'TikTok',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
      url: 'https://tiktok.com/@wisetv',
    },
  ];

  const categories = [
    'Documentaries',
    'News',
    'Reports',
    'Interviews',
    'Movies',
    'Photojournalism',
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-red-600 p-2 rounded-lg mr-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6.977c0 .8-.6 1.482-1.4 1.6l-18.4 2.7c-.8.1-1.2-.4-1.2-1.2v-2.154c0-.8.6-1.482 1.4-1.6l18.4-2.7c.8-.1 1.2.4 1.2 1.2v2.154zm0 4.023c0 .8-.6 1.482-1.4 1.6l-18.4 2.7c-.8.1-1.2-.4-1.2-1.2v-2.154c0-.8.6-1.482 1.4-1.6l18.4-2.7c.8-.1 1.2.4 1.2 1.2v2.154zm0 4c0 .8-.6 1.482-1.4 1.6l-18.4 2.7c-.8.1-1.2-.4-1.2-1.2v-2.154c0-.8.6-1.482 1.4-1.6l18.4-2.7c.8-.1 1.2.4 1.2 1.2v2.154z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">WiseTV</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering the next generation with inspiring stories. Your trusted source for documentaries, news, interviews, and engaging content that drives positive change.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium transition duration-200">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition duration-200 group"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-gray-300 hover:text-white hover:pl-2 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/${category.toLowerCase()}`}
                  className="block text-gray-300 hover:text-white hover:pl-2 transition-all duration-200"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="bg-red-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:info@wisetv.com" className="text-gray-300 hover:text-white transition duration-200">
                  info@wisetv.com
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-red-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+233123456789" className="text-gray-300 hover:text-white transition duration-200">
                  +233 123 456 789
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-red-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-300">Accra, Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} WiseTV. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition duration-200">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition duration-200">
                Cookie Policy
              </Link>
            </div>

            <div className="text-gray-400 text-sm">
              Made with ❤️ in Ghana
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition duration-200 z-50 group"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;