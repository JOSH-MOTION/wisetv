import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Card = ({ item }) => {
  // Framer Motion variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    hover: {
      scale: 1.03,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.7 } },
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  // Create platform-specific placeholder
  const createPlaceholderImage = (platform) => {
    const colors = {
      instagram: { bg: '#E4405F', text: '#FFFFFF' },
      facebook: { bg: '#1877F2', text: '#FFFFFF' },
      youtube: { bg: '#FF0000', text: '#FFFFFF' },
      twitter: { bg: '#1DA1F2', text: '#FFFFFF' },
      tiktok: { bg: '#000000', text: '#FFFFFF' },
      regular: { bg: '#CCCCCC', text: '#FFFFFF' },
    };

    const color = colors[platform?.toLowerCase()] || colors.regular;
    const platformName = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Post';

    const svg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="${color.bg}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
          ${platformName} Post
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Determine URLs
  const categoryUrl = `/${item.category}`;
  const detailUrl = item.type === 'social' ? item.url : `/posts/${item.id}`;
  const placeholderImage = item.type === 'social' ? createPlaceholderImage(item.platform) : createPlaceholderImage('regular');

  return (
    <Link
      to={categoryUrl}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="block"
    >
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200/50 transition-all duration-300"
      >
        {/* Fixed Image Container with proper aspect ratio */}
        <div className="relative w-full h-48 overflow-hidden">
          <motion.img
            src={item.image || placeholderImage}
            alt={item.title}
            variants={imageVariants}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = placeholderImage;
            }}
          />
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          >
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              {item.type === 'social' ? (
                <a
                  href={detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-orange-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play className="w-3 h-3 mr-1" />
                  View Now
                </a>
              ) : (
                <Link
                  to={detailUrl}
                  className="flex items-center bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-orange-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play className="w-3 h-3 mr-1" />
                  View Now
                </Link>
              )}
              {item.type === 'social' ? (
                <a
                  href={detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  More Info
                </a>
              ) : (
                <Link
                  to={detailUrl}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  More Info
                </Link>
              )}
            </div>
          </motion.div>
          {item.duration && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
              {item.duration}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-full text-xs font-semibold">
              {item.type === 'social' ? `${item.platform.toUpperCase()} - ${item.category.toUpperCase()}` : item.category.toUpperCase()}
            </span>
            {item.views !== undefined && (
              <div className="flex items-center text-gray-500 text-xs">
                <Eye className="w-3 h-3 mr-1" />
                {item.views.toLocaleString()}
              </div>
            )}
          </div>

          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-orange-500 transition-colors">
            {item.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.content || (item.type === 'social' ? item.url : '')}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(item.date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {item.author || 'Anonymous'}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default Card;