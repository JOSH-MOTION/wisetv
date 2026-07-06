import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Play, Search, Grid, LayoutList, Film, Loader } from 'lucide-react';
import VideoCard from '../components/VideoCard';

// ── WhatsApp channel link — update this URL to your actual channel ──
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb7cFqY2UPBJuaosrU3S';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

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

  const categories = useMemo(() => {
    const cats = new Set(videos.map((v) => v.videoCategory).filter(Boolean));
    return ['All', ...Array.from(cats).sort()];
  }, [videos]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesCategory = activeCategory === 'All' || v.videoCategory === activeCategory;
      const matchesSearch =
        !s ||
        (v.title || '').toLowerCase().includes(s) ||
        (v.description || '').toLowerCase().includes(s) ||
        (v.author || '').toLowerCase().includes(s) ||
        (v.videoCategory || '').toLowerCase().includes(s);
      return matchesCategory && matchesSearch;
    });
  }, [videos, activeCategory, search]);

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
    // pt-16 accounts for the main navbar height — adjust if your navbar is taller
    <div className="pt-16 min-h-screen bg-[#0d0d0d]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-white py-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#0B132B]/15 border border-[#0B132B]/30 rounded-full px-5 py-2 mb-6 text-blue-400 text-sm font-semibold tracking-widest uppercase"
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
            <span className="text-[#3B82F6]">Experience</span>
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex items-center justify-center gap-8 text-sm text-slate-500"
          >
            <span>
              <span className="text-white font-bold text-lg">{videos.length}</span>{' '}Videos
            </span>
            <span className="w-px h-4 bg-slate-700" />
            <span>
              <span className="text-white font-bold text-lg">{categories.length - 1}</span>{' '}Categories
            </span>
          </motion.div>

          {/* ── WhatsApp channel CTA ── */}
          <motion.a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 mt-8 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-[#25D366]/20 transition-colors"
          >
            {/* WhatsApp SVG icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Follow our WhatsApp Channel
          </motion.a>
        </div>
      </section>

      {/* ── Controls bar — sticky just below the main navbar ── */}
      {/* 
        Change top-16 to match your navbar height exactly:
        - 64px  navbar  →  top-16
        - 72px  navbar  →  top-[72px]
        - 80px  navbar  →  top-20
      */}
      <div className="bg-[#111111] border-b border-white/5 sticky top-16 z-20">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B132B]/50 focus:border-[#0B132B]/40 transition-all"
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
                    ? 'bg-[#0B132B] text-white shadow-lg shadow-[#0B132B]/20'
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
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#0B132B] text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#0B132B] text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-12">

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-8 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <Loader className="animate-spin mb-4 text-[#3B82F6]" size={32} />
            <p>Loading videos…</p>
          </div>
        )}

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
                className="mt-4 text-[#3B82F6] text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-white/5" />
                      <h2 className="text-white font-bold text-xl tracking-tight shrink-0">{cat}</h2>
                      <span className="text-slate-600 text-sm shrink-0">
                        {items.length} video{items.length !== 1 ? 's' : ''}
                      </span>
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

      {/* ── WhatsApp floating button ── */}
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Join our WhatsApp Channel"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-xl shadow-black/30 flex items-center justify-center transition-colors"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
};

/* ── List Row (unchanged, just kept here) ── */
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
            <img src={thumbnail} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#0B132B]/80 flex items-center justify-center">
              <Play size={16} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
        <div className="flex-1 py-4 pr-4">
          {item.videoCategory && (
            <span className="text-[#3B82F6] text-xs font-bold uppercase tracking-wider">
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
        <AnimatePresence>
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
        </AnimatePresence>
      )}
    </>
  );
};

export default Videos;