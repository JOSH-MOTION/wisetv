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
  
  // Create a high-quality fallback OG image if no image exists
  const createFallbackOGImage = () => {
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fc561c;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff8a5b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#grad)"/>
        <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
          W-GH TV
        </text>
        <text x="50%" y="52%" font-family="Arial, sans-serif" font-size="28" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" opacity="0.95">
          ${(post.title || '').substring(0, 60).replace(/[<>&"]/g, '')}${post.title?.length > 60 ? '...' : ''}
        </text>
        <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="20" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
          ${post.category ? post.category.toUpperCase() : 'BLOG POST'}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };
  
  const postImage = post.image || createFallbackOGImage();
  const postDescription = post.content?.substring(0, 160).replace(/[<>&"]/g, '') || post.title || 'Read this article on W-GH TV';

  return (
    <>
      {/* Enhanced SEO and Open Graph Meta Tags for social sharing */}
      <Helmet>
        <title>{post.title} - W-GH TV</title>
        <meta name="description" content={postDescription} />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:site_name" content="W-GH TV" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:image" content={postImage} />
        <meta property="og:image:secure_url" content={postImage} />
        <meta property="og:image:type" content={post.image ? "image/jpeg" : "image/svg+xml"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wghtv" />
        <meta name="twitter:creator" content={post.author ? `@${post.author}` : "@wghtv"} />
        <meta name="twitter:url" content={postUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />
        <meta name="twitter:image:alt" content={post.title} />
        
        {/* Article specific */}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author || 'Anonymous'} />
        {post.category && <meta property="article:section" content={post.category} />}
        <meta property="article:tag" content={post.category} />
        
        {/* Additional meta tags for better indexing and sharing */}
        <link rel="canonical" href={postUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={post.author || 'W-GH TV'} />
        {post.instagramHandle && <meta name="instagram:handle" content={post.instagramHandle} />}
        {post.facebookHandle && <meta name="facebook:handle" content={post.facebookHandle} />}
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

            {/* Social Handles */}
            {(post.instagramHandle || post.facebookHandle) && (
              <div className="mt-8 p-6 bg-slate-100 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Connect with the author</h3>
                <div className="space-y-2">
                  {post.instagramHandle && (
                    <p className="text-slate-700">
                      📱 Instagram: <a href={`https://instagram.com/${post.instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#fc561c] hover:underline">{post.instagramHandle}</a>
                    </p>
                  )}
                  {post.facebookHandle && (
                    <p className="text-slate-700">
                      👥 Facebook: <a href={`https://facebook.com/${post.facebookHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#fc561c] hover:underline">{post.facebookHandle}</a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Share this article</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Facebook
                </button>
                <button
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium text-sm"
                >
                  Twitter
                </button>
                <button
                  onClick={() => {
                    const url = `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + postUrl)}`;
                    window.open(url, '_blank');
                  }}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  WhatsApp
                </button>
                <button
                  onClick={tryShare}
                  className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
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