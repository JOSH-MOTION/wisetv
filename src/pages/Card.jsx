import React from 'react';
import { Play, Calendar, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Card = ({ item, onToggleExpand, isExpanded }) => {
  return (
    <article
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-slate-200/50"
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.image || 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <Link
              to={`/${item.category}`}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              View Now
            </Link>
            <button
              onClick={() => onToggleExpand(item.id)}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-colors"
            >
              {isExpanded ? 'Less Info' : 'More Info'}
            </button>
          </div>
        </div>
        {item.duration && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
            {item.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
            {item.category.toUpperCase()}
          </span>
          {item.views && (
            <div className="flex items-center text-slate-500 text-xs">
              <Eye className="w-3 h-3 mr-1" />
              {item.views.toLocaleString()}
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
          {item.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {item.content}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(item.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {item.author || 'Anonymous'}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-slate-700 text-sm leading-relaxed">
              {item.content}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default Card;