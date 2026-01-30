import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ArrowLeft, Calendar, User, Share2, Eye } from 'lucide-react';

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#\s]+)/,
    /youtube\.com\/watch\?.*v=([^&?#\s]+)/,
    /youtu\.be\/([^&?#\s]+)/,
    /youtube\.com\/embed\/([^&?#\s]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

// Component to render YouTube embed
const YouTubeEmbed = ({ url }) => {
  const videoId = getYouTubeVideoId(url);
  
  if (!videoId) return null;
  
  return (
    <div className="my-6 relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Component to process and render content with embedded videos and links
const RichContent = ({ content }) => {
  if (!content) return null;

  // Split content by double line breaks to create paragraphs
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="prose prose-slate max-w-none">
      {paragraphs.map((para, idx) => {
        // Check if paragraph contains a YouTube link
        const youtubeMatch = para.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#\s]+)/);
        
        if (youtubeMatch) {
          const [youtubeUrl] = youtubeMatch;
          // Split the paragraph at the YouTube link
          const parts = para.split(youtubeUrl);
          
          return (
            <div key={idx}>
              {parts[0] && (
                <p className="mb-4 text-slate-700 leading-relaxed">
                  {renderTextWithLinks(parts[0])}
                </p>
              )}
              <YouTubeEmbed url={youtubeUrl} />
              {parts[1] && (
                <p className="mt-4 text-slate-700 leading-relaxed">
                  {renderTextWithLinks(parts[1])}
                </p>
              )}
            </div>
          );
        }
        
        // Regular paragraph with link detection
        return (
          <p key={idx} className="mb-4 text-slate-700 leading-relaxed">
            {renderTextWithLinks(para)}
          </p>
        );
      })}
    </div>
  );
};

// Helper function to render text with clickable links
const renderTextWithLinks = (text) => {
  // Regular expression to match URLs (excluding YouTube URLs which are handled separately)
  const urlPattern = /https?:\/\/(?!(?:www\.)?(?:youtube\.com|youtu\.be))([^\s]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlPattern.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the link
    const url = match[0];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#fc561c] hover:underline font-medium"
      >
        {url}
      </a>
    );
    
    lastIndex = match.index + url.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

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

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // If no history, go to blog page
      navigate('/blog');
    }
  };

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
          <button onClick={handleBack} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
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
  
  const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dfff3hdrf/image/upload/v1768046400/default-og-image_f5hzm7.png';
  const postImage = post.image && post.image.startsWith('http') 
    ? post.image 
    : DEFAULT_OG_IMAGE;
  
  const postDescription = post.content?.substring(0, 160).replace(/[<>&"]/g, '') || post.title || 'Read this article on W-GH TV';
  const postTitle = post.title || 'W-GH TV Blog Post';

  return (
    <>
      <Helmet>
        <title>{postTitle} - W-GH TV</title>
        <meta name="description" content={postDescription} />
        
        <meta property="og:site_name" content="W-GH TV" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDescription} />
        
        <meta property="og:image" content={postImage} />
        <meta property="og:image:secure_url" content={postImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={postTitle} />
        <meta property="og:locale" content="en_US" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wghtv" />
        <meta name="twitter:creator" content={post.author ? `@${post.author}` : "@wghtv"} />
        <meta name="twitter:url" content={postUrl} />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />
        <meta name="twitter:image:alt" content={postTitle} />
        
        {post.date && <meta property="article:published_time" content={post.date} />}
        <meta property="article:author" content={post.author || 'W-GH TV'} />
        {post.category && <meta property="article:section" content={post.category} />}
        {post.category && <meta property="article:tag" content={post.category} />}
        {post.subcategory && <meta property="article:tag" content={post.subcategory} />}
        
        <link rel="canonical" href={postUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={post.author || 'W-GH TV'} />
      </Helmet>

      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <article className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={handleBack} 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={18} /> Back to {post.category || 'Blog'}
              </button>
              <button 
                onClick={tryShare} 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
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
                <div className="flex items-center gap-2">
                  <Link to={`/${post.category}`} className="uppercase tracking-wide text-[#fc561c] font-semibold hover:underline">
                    {post.category}
                  </Link>
                  {post.subcategory && (
                    <>
                      <span className="text-slate-400">/</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {post.subcategory}
                      </span>
                    </>
                  )}
                </div>
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

            <RichContent content={post.content} />

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