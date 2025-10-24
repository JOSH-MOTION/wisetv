import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Clock, Share2, Search } from 'lucide-react';
import Card from './Card';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch (_) {
    return '';
  }
}

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchBlogPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Prefer Firestore-side sort by date desc when possible
      // Firestore cannot order by non-indexed composite here; safest is client-side after fetch
      const q = query(collection(db, 'posts'), where('category', '==', 'blog'));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data(), type: 'regular' }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(data);
    } catch (e) {
      console.error('Failed to load blog posts', e);
      setError('Failed to load blog posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return posts;
    return posts.filter((p) =>
      (p.title || '').toLowerCase().includes(s) ||
      (p.content || '').toLowerCase().includes(s) ||
      (p.author || '').toLowerCase().includes(s)
    );
  }, [posts, search]);

  const tryShare = async (post) => {
    const url = `${window.location.origin}/posts/${post.id}`;
    const shareText = post.title || 'Blog post';
    try {
      if (navigator.share) {
        await navigator.share({ title: shareText, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } else {
        window.prompt('Copy this link', url);
      }
    } catch (_) {
      // user cancelled or share failed; ignore
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Blog</h1>
            <p className="text-slate-600 mt-2">Stories, updates, and behind-the-scenes from W-GH TV.</p>
          </div>
          <div className="relative w-full md:w-80">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blog..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#fc561c] bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-40 bg-slate-200 rounded mb-3" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No blog posts yet</h3>
            <p className="text-slate-600">Check back soon for new stories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <div key={post.id} className="group bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                <Card item={post} />
                <div className="flex items-center justify-between px-4 pb-4">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-sm text-[#fc561c] hover:underline"
                  >
                    Read more
                  </Link>
                  <button
                    onClick={() => tryShare(post)}
                    className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
