import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ArrowLeft, Calendar, User, Share2, Eye } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const ref = doc(db, 'posts', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setError('Post not found.');
        setPost(null);
      } else {
        const data = { id: snap.id, ...snap.data() };
        setPost(data);
        
        // Increment view count
        try {
          await updateDoc(ref, {
            views: increment(1)
          });
        } catch (e) {
          console.log('Could not increment views:', e);
        }
      }
    } catch (e) {
      console.error('Failed to load post', e);
      setError('Failed to load the post.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const tryShare = async () => {
    if (!post) return;
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: post.title || 'Blog post', 
          text: post.content?.substring(0, 150) || post.title,
          url 
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } else {
        window.prompt('Copy this link', url);
      }
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-10 w-40 bg-slate-200 rounded mb-6 animate-pulse" />
          <div className="h-8 bg-slate-200 rounded mb-4 animate-pulse" />
          <div className="h-64 bg-slate-200 rounded mb-6 animate-pulse" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft size={18} /> Back
          </button>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const dateStr = post.date ? new Date(post.date).toLocaleDateString() : '';
  const postUrl = `${window.location.origin}/posts/${post.id}`;
  const postImage = post.image || `${window.location.origin}/default-og-image.jpg`;

  return (
    <>
      {/* SEO and Open Graph Meta Tags for proper sharing */}
      <Helmet>
        <title>{post.title} - W-GH TV</title>
        <meta name="description" content={post.content?.substring(0, 160) || post.title} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content?.substring(0, 160) || post.title} />
        <meta property="og:image" content={postImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={postUrl} />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:description" content={post.content?.substring(0, 160) || post.title} />
        <meta property="twitter:image" content={postImage} />
        
        {/* Article specific */}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author || 'Anonymous'} />
        {post.category && <meta property="article:section" content={post.category} />}
      </Helmet>

      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <article className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <ArrowLeft size={18} /> Back
              </button>
              <button onClick={tryShare} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <Share2 size={18} /> Share
              </button>
            </div>

            {post.image && (
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow mb-6" 
              />
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-8">
              {post.category && (
                <Link to={`/${post.category}`} className="uppercase tracking-wide text-[#fc561c] font-semibold">
                  {post.category}
                </Link>
              )}
              {dateStr && (
                <span className="inline-flex items-center gap-1">
                  <Calendar size={16} /> {dateStr}
                </span>
              )}
              {post.author && (
                <span className="inline-flex items-center gap-1">
                  <User size={16} /> {post.author}
                </span>
              )}
              {post.views !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Eye size={16} /> {post.views.toLocaleString()} views
                </span>
              )}
            </div>

            <div className="prose prose-slate max-w-none">
              {(post.content || '').split(/\n\n+/).map((para, idx) => (
                <p key={idx} className="mb-4 text-slate-700 leading-relaxed">{para}</p>
              ))}
            </div>

            {/* Share Buttons at bottom */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Share this article</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={tryShare}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogPost;