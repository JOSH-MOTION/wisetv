import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Play, Clock, Calendar, User, Eye } from 'lucide-react';
import SocialMediaCard from '../components/SocialMediaCard';

const Documentaries = () => {
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch regular posts
      const postsQuery = query(collection(db, 'posts'), where('category', '==', 'documentaries'));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'regular' }));
      
      // Fetch social media posts
      const socialQuery = query(collection(db, 'socialLinks'), where('category', '==', 'documentaries'));
      const socialSnapshot = await getDocs(socialQuery);
      const socialData = socialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'social' }));
      
      // Set posts and social links separately
      setPosts(postsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setSocialLinks(socialData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch documentaries: ' + error.message);
      setPosts([]);
      setSocialLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  // Mock data fallback
  const mockPosts = [
    {
      id: 'climate-crisis',
      title: 'Climate Crisis: The Last Call',
      content: 'An urgent documentary exploring the devastating effects of climate change and potential solutions for our planet\'s future. Through interviews with leading scientists and activists, this film presents a comprehensive look at the environmental challenges we face.',
      date: '2024-12-15T10:00:00Z',
      author: 'Environmental Films',
      image: 'https://images.unsplash.com/photo-1569163139394-de44aa4a71d6?w=800&h=600&fit=crop',
      duration: '95 min',
      views: 15432,
      type: 'regular'
    },
    {
      id: 'ocean-guardians',
      title: 'Ocean Guardians',
      content: 'Follow marine conservationists as they work tirelessly to protect our oceans from pollution and overfishing. This documentary showcases the beauty of marine life while highlighting the urgent need for ocean conservation.',
      date: '2024-12-10T14:30:00Z',
      author: 'Blue Planet Productions',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      duration: '110 min',
      views: 23891,
      type: 'regular'
    },
  ];

  const displayPosts = posts.length > 0 ? posts : mockPosts;
  const displaySocialLinks = socialLinks;
  
  // Combine all content and sort by date
  const allContent = [...displayPosts, ...displaySocialLinks].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-300 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6">
                  <div className="h-48 bg-slate-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-300 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-[#fc561c]/20 backdrop-blur-sm border border-[#fc561c]/30 rounded-full px-6 py-2 mb-6">
              <Play className="w-4 h-4 mr-2 text-[#fc561c]" />
              <span className="text-[#fc561c] text-sm font-medium">DOCUMENTARY COLLECTION</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Stories That Change Perspectives
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Dive deep into compelling narratives that explore the most pressing issues of our time, told through the lens of award-winning documentarians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group inline-flex items-center bg-[#fc561c] text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Featured
              </button>
              <button className="inline-flex items-center border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300 backdrop-blur-sm">
                <Eye className="w-5 h-5 mr-2" />
                Browse All
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Documentaries Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Documentaries</h2>
            <p className="text-slate-600">Discover stories that matter</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>{allContent.length} items available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allContent.map(item => (
            item.type === 'social' ? (
              <SocialMediaCard key={item.id} item={item} />
            ) : (
              <article
                key={item.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-slate-200/50"
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600&fit=crop'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <button className="flex items-center bg-[#fc561c] text-white px-4 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </button>
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-colors"
                      >
                        {expandedPost === item.id ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  {item.duration && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {item.duration}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center bg-[#fc561c] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      DOCUMENTARY
                    </span>
                    {item.views && (
                      <div className="flex items-center text-slate-500 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        {item.views.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#fc561c] transition-colors">
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

                  {/* Expanded Content */}
                  {expandedPost === item.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            )
          ))}
        </div>

        {/* Empty State */}
        {allContent.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Play className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Documentaries Available</h3>
            <p className="text-slate-600">Check back later for new documentary releases!</p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Submit Your Documentary?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Share your story with our global audience. We're always looking for compelling documentaries that spark conversation and drive change.
          </p>
          <button className="bg-[#fc561c] text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors">
            Submit Your Film
          </button>
        </div>
      </section>
    </div>
  );
};

export default Documentaries;