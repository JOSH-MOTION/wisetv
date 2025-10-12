import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    console.log('Home: Fetching posts...');
    try {
      setLoading(true);
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        type: 'regular'
      }));
      console.log('Home: Posts fetched:', postsData);

      const socialSnapshot = await getDocs(collection(db, 'socialLinks'));
      const socialData = socialSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        type: 'social'
      }));
      console.log('Home: Social links fetched:', socialData);

      setPosts(postsData);
      setSocialLinks(socialData);
      setError(null);
    } catch (error) {
      console.error('Home: Fetch error:', error.message);
      setError('Failed to fetch content: ' + error.message);
      setPosts([]);
      setSocialLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('Home: Mounted');
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-900 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to W-GH TV</h1>
        <p className="text-gray-600 mb-8">This is a test to ensure the page renders.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
              <p className="text-gray-600">{post.content}</p>
            </div>
          ))}
          {socialLinks.map(link => (
            <div key={link.id} className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900">{link.title}</h2>
              <a href={link.url} className="text-blue-600">{link.platform}</a>
            </div>
          ))}
          {posts.length === 0 && socialLinks.length === 0 && (
            <div className="col-span-full text-center py-10 bg-white rounded-lg">
              <p className="text-gray-900 text-lg font-semibold">No content available</p>
              <p className="text-gray-600">Check back later for updates!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;