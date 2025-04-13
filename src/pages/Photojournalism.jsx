import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Photojournalism = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts.filter(post => post.category === 'photojournalism'));
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  const galleryImages = posts.length > 0 ? posts.map(post => post.image).filter(Boolean) : [
    'https://images.unsplash.com/photo-1504215680853-3f9f34c2c1c8',
    'https://images.unsplash.com/photo-1521747116042-5a810479c32f',
    'https://images.unsplash.com/photo-1513542789411-b6a3a4df30c1',
  ];

  return (
    <section className="container mx-auto py-10 pt-20">
      <h3 className="text-2xl font-semibold mb-6 text-center">Photojournalism</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
              ) : (
                <img src="https://images.unsplash.com/photo-1504215680853-3f9f34c2c1c8" alt="Photo" className="w-full h-48 object-cover rounded mb-4" />
              )}
              <h4 className="text-xl font-bold">{post.title}</h4>
              <p className="text-gray-600">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1504215680853-3f9f34c2c1c8" alt="Moments" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Captured Moments</h4>
              <p className="text-gray-600">Stories told through powerful images.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1521747116042-5a810479c32f" alt="Street" className="w-full h-48 object-cover rounded mb-4" />
              <h4 className="text-xl font-bold">Street Life</h4>
              <p className="text-gray-600">Everyday stories in pictures.</p>
              <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
            </div>
          </>
        )}
      </div>
      <h3 className="text-2xl font-semibold mb-6 text-center">Photo Gallery</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {galleryImages.map((img, index) => (
          <img key={index} src={img} alt={`Gallery ${index}`} className="w-full h-64 object-cover rounded-lg shadow-md" />
        ))}
      </div>
    </section>
  );
};

export default Photojournalism;