import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Reports = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts.filter(post => post.category === 'reports'));
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  return (
    <section className="container mx-auto py-10 pt-20">
      <h3 className="text-2xl font-semibold mb-6 text-center">Reports</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
              ) : (
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" alt="Report" className="w-full h-48 object-cover rounded mb-4" />
              )}
              <h4 className="text-xl font-bold">{post.title}</h4>
              <p className="text-gray-600">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" alt="Investigative" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Investigative Report</h4>
              <p className="text-gray-600">In-depth analysis of current issues.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1551288049-b5f3c2c8c372" alt="Tech" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Tech Trends</h4>
              <p className="text-gray-600">What’s new in technology.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Reports;