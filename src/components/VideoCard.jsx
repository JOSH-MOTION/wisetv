import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, User, Eye, ExternalLink, X } from 'lucide-react';

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#\s]+)/,
    /youtube\.com\/watch\?.*v=([^&?#\s]+)/,
    /youtu\.be\/([^&?#\s]+)/,
    /youtube\.com\/embed\/([^&?#\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

const VideoModal = ({ videoId, title, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative w-full max-w-4xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
      >
        <X size={18} /> Close
      </button>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.div>
  </motion.div>
);

const VideoCard = ({ item }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const videoId = getYouTubeVideoId(item.url);
  const thumbnail = item.image ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);

  const fallbackThumbnail = `data:image/svg+xml;base64,${btoa(`
    <svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b"/>
          <stop offset="100%" style="stop-color:#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#g)"/>
      <circle cx="320" cy="180" r="48" fill="#fc561c" opacity="0.9"/>
      <polygon points="308,162 308,198 344,180" fill="white"/>
    </svg>
  `)}`;

  const handleClick = () => {
    if (videoId) {
      setModalOpen(true);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const categoryColor = item.videoCategory
    ? `hsl(${[...item.videoCategory].reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 65%, 50%)`
    : '#fc561c';

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 border border-slate-100 cursor-pointer"
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={thumbnail || fallbackThumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = fallbackThumbnail; }}
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-[#fc561c] flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {videoId ? (
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              ) : (
                <ExternalLink className="w-6 h-6 text-white" />
              )}
            </motion.div>
          </div>

          {/* Persistent play indicator (small) */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
            <Play size={10} fill="white" />
            {videoId ? 'Watch' : 'View'}
          </div>

          {/* Video category pill */}
          {item.videoCategory && (
            <div
              className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
              style={{ backgroundColor: categoryColor }}
            >
              {item.videoCategory}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-[#fc561c] transition-colors leading-snug">
            {item.title || 'Untitled Video'}
          </h3>

          {item.description && (
            <p className="text-slate-500 text-sm mb-3 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {item.date ? new Date(item.date).toLocaleDateString() : ''}
            </span>
            <span className="flex items-center gap-1">
              <User size={12} />
              {item.author || 'W-GH TV'}
            </span>
            {item.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {item.views.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </motion.article>

      {/* Modal */}
      {modalOpen && videoId && (
        <VideoModal
          videoId={videoId}
          title={item.title}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default VideoCard;