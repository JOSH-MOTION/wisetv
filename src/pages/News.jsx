import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

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

  const fetchPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const newsPosts = postsData
        .filter(post => post.category === 'news')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(newsPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch news posts: ' + error.message);
      setPosts([]); // Fallback to mockPosts if Firestore fails
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);



  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/YourPage",
      icon: <FaFacebookF className="text-blue-600" />,
    },
    {
      name: "X",
      url: "https://x.com/wisetv010",
      icon: <FaTwitter className="text-sky-500" />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/wisetv.2?igsh=MXZzczd4amoxbmE1cQ==",
      icon: <FaInstagram className="text-pink-500" />,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@WiseTv.2",
      icon: <FaYoutube className="text-red-600" />,
    },
  ];

  // Mock data with images (used as fallback)
  const mockPosts = [
    {
      id: 1,
      title: 'Climate Changes in the Recent Perspective',
      content:
        'The effects of climate change are becoming more evident with rising global temperatures, melting ice caps, and extreme weather events. Scientists urge immediate action to mitigate these impacts.',
      date: '2025-04-10T10:00:00',
      category: 'news',
      image: pic1,
    },
    {
      id: 2,
      title: 'East Bengal Kerala Blasters Have Lost',
      content:
        'In a surprising turn of events, East Bengal and Kerala Blasters faced a tough defeat in the latest football match, leaving fans in shock.',
      date: '2025-04-09T15:30:00',
      category: 'news',
      image: pic2,
    },
    {
      id: 3,
      title: 'Boris Johnson Tells Brits Lockdown Easing',
      content:
        'Former UK Prime Minister Boris Johnson comments on the easing of lockdown restrictions and its implications for the economy and public health.',
      date: '2025-04-08T12:00:00',
      category: 'news',
      image: pic3,
    },
    {
      id: 4,
      title: 'Watch How Robots Said It Would Be A',
      content:
        'Advancements in robotics are paving the way for automation in industries, raising questions about the future of human labor.',
      date: '2025-04-07T09:00:00',
      category: 'news',
      image: pic4,
    },
    {
      id: 5,
      title: 'A Particular Method By Which Science Is Used',
      content:
        'Scientists have developed a new method to harness renewable energy, potentially revolutionizing the energy sector.',
      date: '2025-04-06T14:00:00',
      category: 'news',
      image: pic5,
    },
    {
      id: 6,
      title: 'Half A Million Tons of Recycling Dumped',
      content:
        'A recent report highlights the alarming amount of recycling waste being dumped each year, calling for better waste management systems.',
      date: '2025-04-05T11:00:00',
      category: 'news',
      image: pic1,
    },
    {
      id: 7,
      title: 'An Open Projects Debunking Vaccine Misinformation',
      content:
        'A new initiative aims to combat vaccine misinformation by providing transparent and scientifically accurate information to the public.',
      date: '2025-04-04T13:00:00',
      category: 'news',
      image: pic2,
    },
    {
      id: 8,
      title: 'What We’re Looking Forward to in 2025 For',
      content:
        'A roundup of the most anticipated events, innovations, and trends expected in 2025 across various sectors.',
      date: '2025-04-03T10:00:00',
      category: 'news',
      image: pic3,
    },
  ];

  const toggleExpand = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  // Use mock data if no posts are available
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  // Main News (newest post)
  const mainNews = displayPosts.length > 0 ? displayPosts[0] : null;

  // Categorize remaining posts
  const educationNews = displayPosts.slice(1).filter(post => post.title.toLowerCase().includes('education'));
  const worldNews = displayPosts.slice(1).filter(post => post.title.toLowerCase().includes('world'));
  const politicsNews = displayPosts.slice(1).filter(post => post.title.toLowerCase().includes('politics'));
  const previousNews = displayPosts.slice(1).filter(
    post =>
      !post.title.toLowerCase().includes('education') &&
      !post.title.toLowerCase().includes('world') &&
      !post.title.toLowerCase().includes('politics')
  );

  return (
    <div className="pt-20 bg-gray-50">
      {/* Error Display */}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      {/* Hero Section (Main News) */}
      {mainNews && (
        <section className="relative bg-gray-900 text-white">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded mb-2">
                  {mainNews.category.toUpperCase()}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{mainNews.title}</h1>
                <p className="text-gray-300 mb-4 line-clamp-3">{mainNews.content}</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-400">
                    {new Date(mainNews.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-400">• By {mainNews.author || 'Admin'}</span>
                </div>
                <button
                  onClick={() => toggleExpand(mainNews.id)}
                  className="text-red-400 hover:text-red-300 font-semibold"
                >
                  {expandedPost === mainNews.id ? 'Read Less' : 'Read More'}
                </button>
                {expandedPost === mainNews.id && (
                  <div className="mt-4 text-gray-300">
                    <p>{mainNews.content}</p>
                  </div>
                )}
              </div>
              <div className="md:w-1/3 flex flex-col gap-4">
                {displayPosts.slice(1, 3).map(post => (
                  <div key={post.id} className="bg-white text-gray-900 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <img
            src={mainNews.image}
            alt={mainNews.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x600?text=Image+Not+Found';
            }}
          />
        </section>
      )}

      {/* Trending News Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-red-600 inline-block">
          Trending News
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previousNews.slice(0, 4).map(post => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <div className="p-4">
                <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                  {post.category.toUpperCase()}
                </span>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="text-red-600 hover:underline font-semibold"
                >
                  {expandedPost === post.id ? 'Read Less' : 'Read More'}
                </button>
                {expandedPost === post.id && (
                  <div className="mt-4 text-gray-600">
                    <p>{post.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section with Sidebar */}
      <section className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-red-600 inline-block">
            Featured
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {previousNews.slice(4, 6).map(post => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                <div className="p-4 flex-1">
                  <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                    {post.category.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="text-red-600 hover:underline font-semibold"
                  >
                    {expandedPost === post.id ? 'Read Less' : 'Read More'}
                  </button>
                  {expandedPost === post.id && (
                    <div className="mt-4 text-gray-600">
                      <p>{post.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3">
          <h2 className="text-xl font-bold mb-4">Social Feed</h2>
          <div className="space-y-4">
      {socialLinks.map((platform, index) => (
        <a
          key={index}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 p-4 rounded-lg flex items-center gap-3 hover:shadow-md transition-all duration-200"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
            {platform.icon}
          </div>
          <div>
            <p className="text-sm font-semibold">{platform.name}</p>
            <p className="text-xs text-gray-600">{Math.floor(Math.random() * 10000)} Likes</p>
          </div>
        </a>
      ))}
    </div>
        </div>
      </section>

      {/* Categorized News Sections */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-red-600 inline-block">
          Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {educationNews.concat(worldNews, politicsNews).slice(0, 4).map(post => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <div className="p-4">
                <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                  {post.category.toUpperCase()}
                </span>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="text-red-600 hover:underline font-semibold"
                >
                  {expandedPost === post.id ? 'Read Less' : 'Read More'}
                </button>
                {expandedPost === post.id && (
                  <div className="mt-4 text-gray-600">
                    <p>{post.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fallback if no posts (won't be used since we have mock data) */}
      {displayPosts.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-6">No News Available</h2>
          <p className="text-gray-600">Check back later for updates!</p>
        </div>
      )}
    </div>
  );
};

export default News;