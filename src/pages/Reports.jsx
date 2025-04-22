import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Reports = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const reportPosts = postsData
        .filter(post => post.category === 'reports')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(reportPosts);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports: ' + error.message);
      setPosts([]); // Fallback to mock data if Firestore fails
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fallback mock data (aligned with Firestore structure)
  const mockPosts = [
    {
      id: 'investigative-report',
      title: 'Investigative Report',
      content: 'In-depth analysis of current issues.',
      date: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      author: 'Anonymous',
      category: 'reports',
    },
    {
      id: 'tech-trends',
      title: 'Tech Trends',
      content: 'What’s new in technology.',
      date: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1551288049-b5f3c2c8c372',
      author: 'Anonymous',
      category: 'reports',
    },
  ];

  // Use mock data if no posts are available
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <section className="container mx-auto py-10 pt-20">
      {/* Error Display */}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      <h3 className="text-2xl font-semibold mb-6 text-center">Reports</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
                alt="Report"
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h4 className="text-xl font-bold">{post.title}</h4>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.date).toLocaleString()} • By {post.author || 'Anonymous'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reports;