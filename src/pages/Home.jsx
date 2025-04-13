import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import WiseTvCarousel from '../components/Carousel';

const Home = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts);
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  const categories = [
    'documentaries',
    'news',
    'reports',
    'interviews',
    'movies',
    'photojournalism',
  ];

  return (
    <div className="pt-20">
      <WiseTvCarousel />
      <section className="py-10 text-center">
        <h2 className="text-3xl font-semibold mb-6">Featured Content</h2>
        <VideoPlayer />
      </section>
      <section className="container mx-auto py-10">
        <h2 className="text-3xl font-semibold mb-8 text-center">Latest Updates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.slice(0, 6).map(post => (
              <Link key={post.id} to={`/${post.category}`} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
                ) : (
                  <img src="https://via.placeholder.com/300x200" alt="Placeholder" className="w-full h-48 object-cover rounded mb-4" />
                )}
                <h4 className="text-xl font-bold">{post.title}</h4>
                <p className="text-gray-600 line-clamp-2">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleString()}</p>
                <span className="text-blue-500 text-sm mt-2 block">Read More</span>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full">No updates yet. Check back soon!</p>
          )}
        </div>
      </section>
      {categories.map(category => (
        <section key={category} className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold capitalize">{category}</h3>
            <Link to={`/${category}`} className="text-blue-500 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.filter(post => post.category === category).slice(0, 3).map(post => (
              <Link key={post.id} to={`/${category}`} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
                ) : (
                  <img src={`https://via.placeholder.com/300x200?text=${category}`} alt={category} className="w-full h-48 object-cover rounded mb-4" />
                )}
                <h4 className="text-xl font-bold">{post.title}</h4>
                <p className="text-gray-600 line-clamp-2">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleString()}</p>
              </Link>
            ))}
            {posts.filter(post => post.category === category).length === 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src={`https://via.placeholder.com/300x200?text=${category}`} alt={category} className="w-full h-48 object-cover rounded mb-4" />
                <h4 className="text-xl font-bold">{`Latest in ${category.charAt(0).toUpperCase() + category.slice(1)}`}</h4>
                <p className="text-gray-600">Exciting {category} coming soon!</p>
                <Link to={`/${category}`} className="text-blue-500 text-sm mt-2 block">View More</Link>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;