import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Play, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import Card from './Card'; // Import the reusable Card component
import WiseLogo from '../assets/WISE.svg'; // Import the Wise.svg logo

// Import placeholder images
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';

const Photojournalism = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for fallback
  const mockPosts = [
    {
      id: 1,
      title: 'Captured Moments: A glimpse of life',
      content: 'A powerful photograph capturing the essence of daily life in urban settings.',
      date: '2025-04-10T10:00:00',
      category: 'photojournalism',
      image: pic1,
      author: 'John Doe',
      views: 1234,
    },
    {
      id: 2,
      title: 'Street Life: Untold Stories',
      content: 'Exploring the raw beauty of street life through a photojournalist’s lens.',
      date: '2025-04-09T15:30:00',
      category: 'photojournalism',
      image: pic2,
      author: 'Jane Smith',
      views: 987,
    },
    {
      id: 3,
      title: 'Urban Journey: City Chronicles',
      content: 'Documenting the untold stories of city dwellers in vibrant photographs.',
      date: '2025-04-08T12:00:00',
      category: 'photojournalism',
      image: pic3,
      author: 'Alex Brown',
      views: 765,
    },
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'posts'), where('category', '==', 'photojournalism'));
      const postsSnapshot = await getDocs(q);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedPosts = postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching photojournalism posts:', error);
      setError('Failed to fetch photojournalism posts: ' + error.message);
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
      post.title.toLowerCase().includes(searchQuery) &&
      (selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory)
  );
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal Viewer
  const galleryImages = filteredPosts.map(post => ({
    src: post.image || pic1,
    description: post.title || 'Untitled Photo',
  }));

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImageIndex(0);
  };

  const handleModalNav = (direction) => {
    const newIndex =
      direction === 'next'
        ? (currentImageIndex + 1) % galleryImages.length
        : (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentImageIndex(newIndex);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const shareImage = (platform, image) => {
    const shareUrls = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(image.src)}&quote=${encodeURIComponent(image.description)}`,
      Twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(image.description)}&url=${encodeURIComponent(image.src)}`,
      Instagram: 'https://www.instagram.com',
      YouTube: 'https://www.youtube.com',
    };
    if (platform === 'Instagram' || platform === 'YouTube') {
      alert(`Please share "${image.description}" manually on ${platform}!`);
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const categories = ['all', 'urban', 'nature', 'culture', 'events'];

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
            <h3 className="text-3xl font-bold text-white">Photojournalism</h3>
          </div>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            Discover powerful stories told through the lens of our photojournalists, capturing moments that inspire and inform.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-2xl shadow-lg p-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search photos..."
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
        <h4 className="text-2xl font-bold mb-6 text-slate-900">Latest Stories</h4>
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
                <Card
                  key={post.id}
                  item={post}
                  onToggleExpand={() => setModalOpen(post.id)}
                  isExpanded={modalOpen === post.id}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Play className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Stories Available</h3>
                <p className="text-slate-600">Check back later for new photojournalism stories!</p>
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

      {/* Photo Gallery Section */}
      <div className="container mx-auto px-4 py-12">
        <h4 className="text-2xl font-bold mb-6 text-slate-900">Photo Gallery</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.src}
                alt={img.description}
                className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onClick={() => openModal(index)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-semibold">{img.description}</p>
                <div className="flex gap-2">
                  {['Facebook', 'Twitter'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => shareImage(platform, img)}
                      className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                      aria-label={`Share on ${platform}`}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <img
                src={WiseLogo}
                alt="WiseTV Watermark"
                className="absolute bottom-2 right-2 h-6 w-auto opacity-30"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Viewer */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl w-full mx-4">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => handleModalNav('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleModalNav('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <img
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].description}
              className="w-full h-[60vh] object-contain rounded-xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-semibold">{galleryImages[currentImageIndex].description}</p>
              <img
                src={WiseLogo}
                alt="WiseTV Watermark"
                className="h-6 w-auto mx-auto mt-2 opacity-50"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Photojournalism;