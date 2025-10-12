import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import WiseTvCarousel from '../components/Carousel';
import Card from './Card';
import SocialMediaCard from '../components/SocialMediaCard';
import { Sparkles, TrendingUp, Play, Newspaper, BarChart, Mic, Film, Camera, Target, Globe, Zap } from 'lucide-react';

// Import local images for mock posts (only used as fallback)
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';
import pic4 from '../assets/pic4.jpg';
import pic5 from '../assets/pic5.jpg';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch regular posts
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        type: 'regular'
      }));

      // Fetch social media links
      const socialSnapshot = await getDocs(collection(db, 'socialLinks'));
      const socialData = socialSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        type: 'social'
      }));

      setPosts(postsData);
      setSocialLinks(socialData);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch content: ' + error.message);
      setPosts([]);
      setSocialLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Mock data as fallback
  const mockPosts = [
    {
      id: '1',
      title: 'The Future of Renewable Energy',
      content: 'Exploring the latest innovations in solar and wind energy that could power the world sustainably.',
      date: '2025-04-10T10:00:00',
      category: 'documentaries',
      image: pic1,
      author: 'Green Energy Films',
      views: 12345,
      type: 'regular'
    },
    {
      id: '2',
      title: 'Breaking News: Global Summit',
      content: 'World leaders gather to discuss climate action and economic policies.',
      date: '2025-04-09T15:30:00',
      category: 'news',
      image: pic2,
      author: 'Global News Network',
      views: 9876,
      type: 'regular'
    },
    {
      id: '3',
      title: 'Tech Innovators Speak',
      content: 'Exclusive interviews with tech pioneers shaping the future.',
      date: '2025-04-08T12:00:00',
      category: 'interviews',
      image: pic3,
      author: 'Tech Insights',
      views: 7654,
      type: 'regular'
    },
    {
      id: '4',
      title: 'City Life Through a Lens',
      content: 'A photojournalism series capturing urban stories.',
      date: '2025-04-07T09:00:00',
      category: 'photojournalism',
      image: pic4,
      author: 'Urban Snaps',
      views: 5432,
      type: 'regular'
    },
    {
      id: '5',
      title: 'Epic Cinematic Journey',
      content: 'A new blockbuster movie exploring human resilience.',
      date: '2025-04-06T14:00:00',
      category: 'movies',
      image: pic5,
      author: 'Cinema Studios',
      views: 8765,
      type: 'regular'
    }
  ];

  const categories = [
    { name: 'documentaries', icon: <Play className="w-5 h-5" />, color: 'from-purple-600 to-pink-600' },
    { name: 'news', icon: <Newspaper className="w-5 h-5" />, color: 'from-blue-600 to-cyan-600' },
    { name: 'reports', icon: <BarChart className="w-5 h-5" />, color: 'from-green-600 to-teal-600' },
    { name: 'interviews', icon: <Mic className="w-5 h-5" />, color: 'from-orange-600 to-red-600' },
    { name: 'movies', icon: <Film className="w-5 h-5" />, color: 'from-indigo-600 to-purple-600' },
    { name: 'photojournalism', icon: <Camera className="w-5 h-5" />, color: 'from-pink-600 to-rose-600' },
  ];

  // Use real data if available, otherwise fallback to mock data
  const displayPosts = posts.length > 0 ? posts : mockPosts;
  const displaySocialLinks = socialLinks;
  const allContent = [...displayPosts, ...displaySocialLinks].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const getCategoryContent = (category) => {
    const regularPosts = displayPosts.filter(post => post.category === category);
    const socialPosts = displaySocialLinks.filter(link => link.category === category);
    return [...regularPosts, ...socialPosts].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.03,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-4"
        >
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm">
            {error}
          </div>
        </motion.div>
      )}

      {/* Hero Section with Carousel */}
      <WiseTvCarousel />

      {/* About WISE TV Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 py-16"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center bg-orange-500/20 border border-orange-500/30 rounded-full px-5 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
              <span className="text-orange-500 text-sm font-medium">ABOUT W-GH TV</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Empowering Voices,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                Driving Change
              </span>
            </h2>
            <p className="text-gray-300 text-base leading-relaxed mb-8">
              W-GH TV is a pioneering online media platform dedicated to empowering the next generation
              and amplifying the voices of the masses.
            </p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { icon: <Target className="w-6 h-6" />, title: 'Our Mission', text: 'Educate and inspire through diverse perspectives' },
                { icon: <Globe className="w-6 h-6" />, title: 'Global Reach', text: 'Connecting communities worldwide' },
                { icon: <Zap className="w-6 h-6" />, title: 'Impact First', text: 'Creating meaningful social change' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <div className="text-orange-500 mb-2">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Content Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-5 py-2 mb-4"
          >
            <Play className="w-4 h-4 mr-2 text-orange-500" />
            <span className="text-orange-500 text-sm font-medium">FEATURED CONTENT</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Watch Now</h2>
          <p className="text-gray-600 text-base">Our latest featured video content</p>
        </div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/q-eWGrfaTmc?si=4T0082sGwNLVPL-V"
              title="Featured Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>
      </motion.section>

      {/* Latest Updates Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16 bg-gray-50"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-5 py-2 mb-4"
            >
              <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
              <span className="text-orange-500 text-sm font-medium">TRENDING NOW</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Updates</h2>
            <p className="text-gray-600 text-base">Fresh content from all categories</p>
          </div>
          <Link
            to="/all"
            className="hidden md:inline-flex items-center bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View All
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {allContent.slice(0, 8).map(item => (
              <motion.div key={item.id} variants={cardVariants} whileHover="hover">
                {item.type === 'social' ? (
                  <SocialMediaCard item={item} />
                ) : (
                  <Card item={item} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Categorized Sections */}
      {categories.map((category, index) => {
        const categoryContent = getCategoryContent(category.name);
        if (categoryContent.length === 0 && !loading) return null;

        return (
          <motion.section
            key={category.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`container mx-auto px-4 py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`inline-flex items-center bg-gradient-to-r ${category.color} bg-opacity-10 rounded-full px-5 py-2 mb-4`}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-sm font-medium uppercase tracking-wide">{category.name}</span>
                </motion.div>
                <h3 className="text-2xl font-bold capitalize text-gray-900">{category.name}</h3>
              </div>
              <Link
                to={`/${category.name}`}
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold transition-colors group"
              >
                View All
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {loading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {categoryContent.slice(0, 4).map(item => (
                  <motion.div key={item.id} variants={cardVariants} whileHover="hover">
                    {item.type === 'social' ? (
                      <SocialMediaCard item={item} />
                    ) : (
                      <Card item={item} />
                    )}
                  </motion.div>
                ))}
                {categoryContent.length === 0 && (
                  <div className="col-span-full text-center py-10 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-5xl mb-3">{category.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h4>
                    <p className="text-gray-600 text-sm">Exciting {category.name} content is on the way!</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.section>
        );
      })}

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 py-16"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Stay Updated with W-GH TV
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/90 text-base mb-8 max-w-xl mx-auto"
          >
            Subscribe to our newsletter and never miss out on the latest stories, documentaries, and exclusive content.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-md"
            >
              Subscribe
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;