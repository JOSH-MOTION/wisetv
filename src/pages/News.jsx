import React, { useEffect, useState } from 'react';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null); // Track which post is expanded

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    const newsPosts = storedPosts.filter(post => post.category === 'news');
    // Sort by date (newest first)
    newsPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    setPosts(newsPosts);
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId); // Toggle expand/collapse
  };

  // Main News (newest post)
  const mainNews = posts.length > 0 ? posts[0] : null;

  // Categorize remaining posts (excluding the main news)
  const educationNews = posts.slice(1).filter(post => post.title.toLowerCase().includes('education'));
  const worldNews = posts.slice(1).filter(post => post.title.toLowerCase().includes('world'));
  const politicsNews = posts.slice(1).filter(post => post.title.toLowerCase().includes('politics'));
  const previousNews = posts.slice(1).filter(
    post =>
      !post.title.toLowerCase().includes('education') &&
      !post.title.toLowerCase().includes('world') &&
      !post.title.toLowerCase().includes('politics')
  );

  return (
    <div className="pt-20">
      {/* Main News Update */}
      {mainNews && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Main News Update</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={mainNews.image || 'https://images.unsplash.com/photo-1504711434969-e338861c4b4c'}
                alt={mainNews.title}
                className="w-full md:w-1/2 h-64 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{mainNews.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{mainNews.content}</p>
                <p className="text-sm text-gray-500 mb-4">{new Date(mainNews.date).toLocaleString()}</p>
                <button
                  onClick={() => toggleExpand(mainNews.id)}
                  className="text-red-600 hover:underline font-semibold uppercase tracking-wide"
                >
                  {expandedPost === mainNews.id ? 'Read Less' : 'Read More'}
                </button>
                {expandedPost === mainNews.id && (
                  <div className="mt-4 text-gray-600">
                    <p>{mainNews.content}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categorized News Sections */}
      <section className="container mx-auto px-4 py-16">
        {/* Education News */}
        {educationNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Education News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationNews.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1503676260728-1b7e8e67b9b5'}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleString()}</p>
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="text-red-600 hover:underline font-semibold uppercase tracking-wide"
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
        )}

        {/* World News */}
        {worldNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">World News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {worldNews.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1504711434969-e338861c4b4c'}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleString()}</p>
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="text-red-600 hover:underline font-semibold uppercase tracking-wide"
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
        )}

        {/* Politics News */}
        {politicsNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Politics News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {politicsNews.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1504711434969-e338861c4b4c'}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleString()}</p>
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="text-red-600 hover:underline font-semibold uppercase tracking-wide"
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
        )}

        {/* Previous News Updates */}
        {previousNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Previous News Updates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousNews.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1504711434969-e338861c4b4c'}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleString()}</p>
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="text-red-600 hover:underline font-semibold uppercase tracking-wide"
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
        )}

        {/* Fallback if no posts */}
        {posts.length === 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">No News Available</h2>
            <p className="text-gray-600">Check back later for updates!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default News;