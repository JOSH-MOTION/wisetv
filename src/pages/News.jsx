import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaSearch } from 'react-icons/fa';
import { Play, Clock, Eye } from 'lucide-react';
import Card from './Card'; // Import the reusable Card component

// Import placeholder images from assets
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';
import pic4 from '../assets/pic4.jpg';
import pic5 from '../assets/pic5.jpg';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [email, setEmail] = useState('');

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/YourPage', icon: <FaFacebookF className="text-blue-600" /> },
    { name: 'X', url: 'https://x.com/wisetv010', icon: <FaTwitter className="text-sky-500" /> },
    { name: 'Instagram', url: 'https://www.instagram.com/wisetv.2?igsh=MXZzczd4amoxbmE1cQ==', icon: <FaInstagram className="text-pink-500" /> },
    { name: 'YouTube', url: 'https://www.youtube.com/@WiseTv.2', icon: <FaYoutube className="text-red-600" /> },
  ];

  const mockPosts = [
    {
      id: 1,
      title: 'Climate Changes in the Recent Perspective',
      content: 'The effects of climate change are becoming more evident with rising global temperatures, melting ice caps, and extreme weather events. Scientists urge immediate action to mitigate these impacts.',
      date: '2025-04-10T10:00:00',
      category: 'news',
      image: pic1,
      author: 'Environmental News',
      views: 12345,
    },
    {
      id: 2,
      title: 'East Bengal Kerala Blasters Have Lost',
      content: 'In a surprising turn of events, East Bengal and Kerala Blasters faced a tough defeat in the latest football match, leaving fans in shock.',
      date: '2025-04-09T15:30:00',
      category: 'news',
      image: pic2,
      author: 'Sports Desk',
      views: 9876,
    },
    {
      id: 3,
      title: 'Boris Johnson Tells Brits Lockdown Easing',
      content: 'Former UK Prime Minister Boris Johnson comments on the easing of lockdown restrictions and its implications for the economy and public health.',
      date: '2025-04-08T12:00:00',
      category: 'news',
      image: pic3,
      author: 'Political Correspondent',
      views: 7654,
    },
    {
      id: 4,
      title: 'Watch How Robots Said It Would Be A',
      content: 'Advancements in robotics are paving the way for automation in industries, raising questions about the future of human labor.',
      date: '2025-04-07T09:00:00',
      category: 'news',
      image: pic4,
      author: 'Tech Insights',
      views: 5432,
    },
    {
      id: 5,
      title: 'A Particular Method By Which Science Is Used',
      content: 'Scientists have developed a new method to harness renewable energy, potentially revolutionizing the energy sector.',
      date: '2025-04-06T14:00:00',
      category: 'news',
      image: pic5,
      author: 'Science Weekly',
      views: 8765,
    },
    {
      id: 6,
      title: 'Half A Million Tons of Recycling Dumped',
      content: 'A recent report highlights the alarming amount of recycling waste being dumped each year, calling for better waste management systems.',
      date: '2025-04-05T11:00:00',
      category: 'news',
      image: pic1,
      author: 'Eco Watch',
      views: 6543,
    },
    {
      id: 7,
      title: 'An Open Projects Debunking Vaccine Misinformation',
      content: 'A new initiative aims to combat vaccine misinformation by providing transparent and scientifically accurate information to the public.',
      date: '2025-04-04T13:00:00',
      category: 'news',
      image: pic2,
      author: 'Health Matters',
      views: 9876,
    },
    {
      id: 8,
      title: 'What We’re Looking Forward to in 2025 For',
      content: 'A roundup of the most anticipated events, innovations, and trends expected in 2025 across various sectors.',
      date: '2025-04-03T10:00:00',
      category: 'news',
      image: pic3,
      author: 'Future Trends',
      views: 4321,
    },
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'posts'), where('category', '==', 'news'));
      const postsSnapshot = await getDocs(q);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedPosts = postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch news posts: ' + error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleExpand = useCallback((postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  }, [expandedPost]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Mock newsletter signup logic
    alert(`Subscribed with email: ${email}`);
    setEmail('');
  };

  const sharePost = (platform, post) => {
    const shareUrls = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(post.title)}`,
      X: `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`,
      Instagram: 'https://www.instagram.com', // Instagram doesn't have direct sharing via URL
      YouTube: 'https://www.youtube.com', // YouTube doesn't have direct sharing via URL
    };
    if (platform === 'Instagram' || platform === 'YouTube') {
      alert(`Please share "${post.title}" manually on ${platform}!`);
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const displayPosts = posts.length > 0 ? posts : mockPosts;

  const filteredPosts = displayPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery) &&
      (selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory)
  );

  const categories = ['all', 'climate', 'sports', 'politics', 'technology', 'health', 'trending'];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Hero Section (Main News) */}
      {filteredPosts.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-6">
                <Play className="w-4 h-4 mr-2 text-red-400" />
                <span className="text-red-300 text-sm font-medium">FEATURED NEWS</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {filteredPosts[0].title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                {filteredPosts[0].content.substring(0, 150)}...
              </p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                <div className="flex items-center gap-4">
                  <span>{new Date(filteredPosts[0].date).toLocaleDateString()}</span>
                  <span>• By {filteredPosts[0].author || 'Anonymous'}</span>
                  {filteredPosts[0].views && (
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {filteredPosts[0].views.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {socialLinks.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => sharePost(platform.name, filteredPosts[0])}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label={`Share on ${platform.name}`}
                    >
                      {platform.icon}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toggleExpand(filteredPosts[0].id)}
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all duration-300"
              >
                {expandedPost === filteredPosts[0].id ? 'Read Less' : 'Read More'}
              </button>
              {expandedPost === filteredPosts[0].id && (
                <div className="mt-6 text-slate-300 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <p>{filteredPosts[0].content}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Bar */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-lg shadow-lg p-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-medium ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                } transition-colors`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending News Ticker */}
      <section className="bg-slate-800 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-hidden">
            <span className="inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-1 mr-4">
              <Play className="w-4 h-4 mr-2 text-red-400" />
              Trending
            </span>
            <div className="animate-marquee whitespace-nowrap">
              {filteredPosts.slice(0, 5).map((post, index) => (
                <span key={post.id} className="mx-4">
                  {post.title} •
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Latest News</h2>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>{filteredPosts.length} news articles available</span>
          </div>
        </div>
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6">
                  <div className="h-48 bg-slate-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-300 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                item={post}
                onToggleExpand={toggleExpand}
                isExpanded={expandedPost === post.id}
              />
            ))}
          </div>
        )}
        {filteredPosts.length <= 1 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Play className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">No News Available</h3>
            <p className="text-slate-600">Check back later for new news releases!</p>
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed with WISE TV</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest news, updates, and exclusive content delivered straight to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Social Feed */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6 text-slate-900">Follow Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialLinks.map((platform, index) => (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-lg flex items-center gap-3 hover:shadow-xl transition-all duration-300 border border-slate-200/50"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full shadow-sm">
                {platform.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{platform.name}</p>
                <p className="text-xs text-slate-600">{Math.floor(Math.random() * 10000)} Followers</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default News;