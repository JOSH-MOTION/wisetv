import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Play, Search, Grid, LayoutList, Film, Loader } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, 'videos'));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setVideos(data);
    } catch (e) {
      console.error('Failed to load videos', e);
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Build dynamic category list from video data
  const categories = useMemo(() => {
    const cats = new Set(videos.map((v) => v.videoCategory).filter(Boolean));
    return ['All', ...Array.from(cats).sort()];
  }, [videos]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesCategory =
        activeCategory === 'All' || v.videoCategory === activeCategory;
      const matchesSearch =
        !s ||
        (v.title || '').toLowerCase().includes(s) ||
        (v.description || '').toLowerCase().includes(s) ||
        (v.author || '').toLowerCase().includes(s) ||
        (v.videoCategory || '').toLowerCase().includes(s);
      return matchesCategory && matchesSearch;
    });
  }, [videos, activeCategory, search]);

  // Group by category for list view
  const grouped = useMemo(() => {
    if (activeCategory !== 'All') return { [activeCategory]: filtered };
    return filtered.reduce((acc, v) => {
      const cat = v.videoCategory || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(v);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  return (
    <div className="pt-20 min-h-screen bg-[#0d0d0d]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-white py-20 px-4">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#fc561c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#fc561c]/15 border border-[#fc561c]/30 rounded-full px-5 py-2 mb-6 text-[#fc561c] text-sm font-semibold tracking-widest uppercase"
          >
            <Film size={14} />
            Video Library
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Watch &{' '}
            <span className="text-[#fc561c]">Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-slate-400 text-lg max-w-xl mx-auto mb-10"
          >
            News reports, behind-the-scenes, funny moments and everything W-GH TV
            captures — in one place.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex items-center justify-center gap-8 text-sm text-slate-500"
          >
            <span>
              <span className="text-white font-bold text-lg">{videos.length}</span>{' '}
              Videos
            </span>
            <span className="w-px h-4 bg-slate-700" />
            <span>
              <span className="text-white font-bold text-lg">{categories.length - 1}</span>{' '}
              Categories
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Controls ── */}
      <div className="bg-[#111111] border-b border-white/5 sticky top-[72px] z-20">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc561c]/50 focus:border-[#fc561c]/40 transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#fc561c] text-white shadow-lg shadow-[#fc561c]/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#fc561c] text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#fc561c] text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-12">

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-8 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <Loader className="animate-spin mb-4 text-[#fc561c]" size={32} />
            <p>Loading videos…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-slate-500"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-5">
              <Play className="text-slate-600" size={36} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {search ? 'No results found' : 'No videos yet'}
            </h3>
            <p className="text-sm text-center max-w-xs">
              {search
                ? `No videos match "${search}". Try a different search.`
                : 'Videos posted by admins will appear here.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 text-[#fc561c] text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* Grid / List */}
        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              /* ── Grid view: grouped by category ── */
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-white/5" />
                      <h2 className="text-white font-bold text-xl tracking-tight shrink-0">
                        {cat}
                      </h2>
                      <span className="text-slate-600 text-sm shrink-0">{items.length} video{items.length !== 1 ? 's' : ''}</span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {items.map((v) => (
                        <VideoCard key={v.id} item={v} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              /* ── List view ── */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 max-w-4xl mx-auto"
              >
                {filtered.map((v) => (
                  <VideoListRow key={v.id} item={v} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

/* ── List Row Component ── */
const VideoListRow = ({ item }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#\s]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(item.url);
  const thumbnail = item.image || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null);

  const handleClick = () => {
    if (videoId) setModalOpen(true);
    else if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <motion.div
        whileHover={{ x: 4 }}
        className="flex gap-4 bg-white/5 hover:bg-white/8 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative w-44 shrink-0 bg-slate-900">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#fc561c]/80 flex items-center justify-center">
              <Play size={16} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
        <div className="flex-1 py-4 pr-4">
          {item.videoCategory && (
            <span className="text-[#fc561c] text-xs font-bold uppercase tracking-wider">
              {item.videoCategory}
            </span>
          )}
          <h3 className="text-white font-semibold text-sm mt-1 mb-2 line-clamp-2 leading-snug">
            {item.title || 'Untitled Video'}
          </h3>
          {item.description && (
            <p className="text-slate-500 text-xs line-clamp-2 mb-2">{item.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>{item.date ? new Date(item.date).toLocaleDateString() : ''}</span>
            {item.author && <span>• {item.author}</span>}
          </div>
        </div>
      </motion.div>

      {modalOpen && videoId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1"
            >
              ✕ Close
            </button>
            <div className="relative rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Videos;