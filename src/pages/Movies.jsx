import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Movies = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts.filter(post => post.category === 'movies'));
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  return (
    <section className="container mx-auto py-10 pt-20">
      <h3 className="text-2xl font-semibold mb-6 text-center">Movies</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
              ) : (
                <img src="https://images.unsplash.com/photo-1485846234645-a7072cab6575" alt="Movie" className="w-full h-48 object-cover rounded mb-4" />
              )}
              <h4 className="text-xl font-bold">{post.title}</h4>
              <p className="text-gray-600">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1485846234645-a7072cab6575" alt="Blockbuster" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Blockbuster Hit</h4>
              <p className="text-gray-600">Watch the latest cinematic masterpiece.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1535016120720-40c646be5580" alt="Action" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Action Packed</h4>
              <p className="text-gray-600">Thrills and excitement on the big screen.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Movies;