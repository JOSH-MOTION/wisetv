import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';

const SocialMediaCard = ({ item }) => {
  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: <FaInstagram className="w-6 h-6" />,
      facebook: <FaFacebook className="w-6 h-6" />,
      youtube: <FaYoutube className="w-6 h-6" />,
      twitter: <FaTwitter className="w-6 h-6" />,
      tiktok: <FaTiktok className="w-6 h-6" />,
    };
    return icons[platform.toLowerCase()] || <ExternalLink className="w-6 h-6" />;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
      facebook: 'bg-blue-600',
      youtube: 'bg-red-600',
      twitter: 'bg-sky-500',
      tiktok: 'bg-black',
    };
    return colors[platform.toLowerCase()] || 'bg-slate-600';
  };

  const getPlatformName = (platform) => {
    const names = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      youtube: 'YouTube',
      twitter: 'Twitter/X',
      tiktok: 'TikTok',
    };
    return names[platform.toLowerCase()] || platform;
  };

  const createPlaceholderSVG = (platform) => {
    const colors = {
      instagram: { bg: '#E4405F', text: '#FFFFFF' },
      facebook: { bg: '#1877F2', text: '#FFFFFF' },
      youtube: { bg: '#FF0000', text: '#FFFFFF' },
      twitter: { bg: '#1DA1F2', text: '#FFFFFF' },
      tiktok: { bg: '#000000', text: '#FFFFFF' },
    };
    
    const color = colors[platform.toLowerCase()] || { bg: '#CCCCCC', text: '#FFFFFF' };
    const platformName = getPlatformName(platform);
    
    const svg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="${color.bg}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
          ${platformName}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getDefaultThumbnail = (platform) => {
    return createPlaceholderSVG(platform);
  };

  return (
    <article
      onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-slate-200/50 cursor-pointer relative"
    >
      {/* Platform Badge - Top Right */}
      <div className={`absolute top-3 right-3 z-10 ${getPlatformColor(item.platform)} text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg`}>
        {getPlatformIcon(item.platform)}
        <span className="text-xs font-semibold">{getPlatformName(item.platform)}</span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={item.image || getDefaultThumbnail(item.platform)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            e.target.src = getDefaultThumbnail(item.platform);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
            <div className="flex items-center bg-white text-slate-900 px-4 py-2 rounded-full font-medium shadow-lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on {getPlatformName(item.platform)}
            </div>
          </div>
        </div>
        
        {/* Social Media Badge Overlay */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-300">
          <div className={`${getPlatformColor(item.platform)} rounded-full p-8`}>
            {getPlatformIcon(item.platform)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
            SOCIAL POST
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#fc561c] transition-colors line-clamp-2">
          {item.title || 'Social Media Post'}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(item.date).toLocaleDateString()}
          </div>
          {item.author && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {item.author}
            </div>
          )}
        </div>

        {/* Social Handles */}
        {(item.instagramHandle || item.facebookHandle) && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-1">
            {item.instagramHandle && (
              <p className="text-sm text-slate-600 flex items-center">
                <FaInstagram className="mr-2 text-pink-500" />
                {item.instagramHandle}
              </p>
            )}
            {item.facebookHandle && (
              <p className="text-sm text-slate-600 flex items-center">
                <FaFacebook className="mr-2 text-blue-600" />
                {item.facebookHandle}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default SocialMediaCard;