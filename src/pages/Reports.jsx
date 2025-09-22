import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Play, Share2 } from 'lucide-react';
import Card from './Card'; // Import the reusable Card component
import WiseLogo from '/WISE.svg'; // Import the Wise.svg logo

const Reports = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fallback mock data (aligned with Firestore and Card component)
  const mockPosts = [
    {
      id: 'investigative-report',
      title: 'Investigative Report',
      content: 'In-depth analysis of current issues affecting society.',
      date: '2025-04-10T10:00:00',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      author: 'John Doe',
      category: 'reports',
      views: 1234,
    },
    {
      id: 'tech-trends',
      title: 'Tech Trends',
      content: 'Exploring the latest innovations in technology.',
      date: '2025-04-09T15:30:00',
      image: 'https://images.unsplash.com/photo-1551288049-b5f3c2c8c372',
      author: 'Jane Smith',
      category: 'reports',
      views: 987,
    },
    {
      id: 'global-insights',
      title: 'Global Insights',
      content: 'A deep dive into international economic trends.',
      date: '2025-04-08T12:00:00',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
      author: 'Alex Brown',
      category: 'reports',
      views: 765,
    },
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'posts'), where('category', '==', 'reports'));
      const postsSnapshot = await getDocs(q);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedPosts = postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports: ' + error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const displayPosts = posts.length > 0 ? posts : mockPosts;
  const filteredPosts = displayPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory)
  );
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const sharePost = (platform, post) => {
    const shareUrls = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/reports/${post.id}`)}&quote=${encodeURIComponent(post.title)}`,
      Twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${window.location.origin}/reports/${post.id}`)}`,
      Instagram: 'https://www.instagram.com',
      YouTube: 'https://www.youtube.com',
    };
    if (platform === 'Instagram' || platform === 'YouTube') {
      alert(`Please share "${post.title}" manually on ${platform}!`);
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const categories = ['all', 'investigative', 'tech', 'global', 'social'];

  return (
    <section className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Header Section with Logo */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-600 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center mb-6">
            <Link to="/">
              <img
                src={WiseLogo}
                alt="WiseTV Logo"
                className="h-10 w-auto mr-3 drop-shadow-md"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x40/CCCCCC/FFFFFF?text=Logo';
                }}
              />
            </Link>
            <h3 className="text-3xl font-bold text-white">Reports</h3>
          </div>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            Dive into in-depth analyses and investigative reports that uncover the stories shaping our world.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-2xl shadow-lg p-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
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
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-12">
        <h4 className="text-2xl font-bold mb-6 text-slate-900">Latest Reports</h4>
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
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <div key={post.id} className="relative">
                  <Card
                    item={{
                      ...post,
                      image: post.image || 'https://via.placeholder.com/300x200?text=Image+Not+Found',
                    }}
                    onToggleExpand={() => {}}
                    isExpanded={false}
                  />
                  <img
                    src={WiseLogo}
                    alt="WiseTV Watermark"
                    className="absolute bottom-6 right-6 h-6 w-auto opacity-30"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {['Facebook', 'Twitter'].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => sharePost(platform, post)}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                        aria-label={`Share on ${platform}`}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Play className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Reports Available</h3>
                <p className="text-slate-600">Check back later for new reports!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredPosts.length > 0 && (
        <div className="container mx-auto px-4 flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-red-600 text-white rounded-full disabled:opacity-50 hover:bg-red-700 transition-all"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg font-semibold text-slate-900">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-red-600 text-white rounded-full disabled:opacity-50 hover:bg-red-700 transition-all"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Reports;