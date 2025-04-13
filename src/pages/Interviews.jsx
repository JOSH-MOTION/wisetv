import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Interviews = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts.filter(post => post.category === 'interviews'));
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  return (
    <section className="container mx-auto py-10 pt-20">
      <h3 className="text-2xl font-semibold mb-6 text-center">Interviews</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
              ) : (
                <img src="https://images.unsplash.com/photo-1537815749002-de6a533c64b9" alt="Interview" className="w-full h-48 object-cover rounded mb-4" />
              )}
              <h4 className="text-xl font-bold">{post.title}</h4>
              <p className="text-gray-600">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1537815749002-de6a533c64b9" alt="Celebrity" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Celebrity Spotlight</h4>
              <p className="text-gray-600">Exclusive talks with industry stars.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef" alt="Director" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Director’s Cut</h4>
              <p className="text-gray-600">Insights from top filmmakers.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Interviews;