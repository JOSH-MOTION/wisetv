import React, { useEffect, useState } from 'react';

const Documentaries = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null); // Track which post is expanded

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts.filter(post => post.category === 'documentaries'));
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId); // Toggle expand/collapse
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
          backgroundBlendMode: 'darken',
        }}
      >
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            WE ARE BOLD DOCUMENTARIANS FOR THE PUBLIC GOOD.
          </h1>
          <p className="text-lg md:text-xl mb-8">
            A nonprofit media organization, AmDoc strives to make essential documentaries accessible as a catalyst for public discourse. We collaborate with a passionate community to nurture the nonfiction narrative.
          </p>
          <a
            href="#about"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wide hover:bg-red-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            About Us
          </a>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Featured Documentaries</h2>
          <p className="text-lg mb-6 max-w-2xl">
            Take a look at all of our films that received nominations for the 9th Annual News and Documentary Emmy® Awards.
          </p>
          <a
            href="#engage"
            className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wide hover:bg-red-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Engage
            <span className="ml-2 text-xl">+</span>
          </a>
        </div>
      </section>

      {/* Documentaries Grid */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.length > 0 ? (
            posts.map(post => (
              <div
                key={post.id}
                className="relative transform transition-transform duration-300 hover:scale-105 bg-white rounded-lg shadow-lg hover:shadow-xl"
              >
                <div className="relative group">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1'}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-t-lg">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <a
                        href="#watch"
                        className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch
                      </a>
                      <button
                        onClick={() => toggleExpand(post.id)}
                        className="bg-transparent border border-red-600 text-red-600 px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
                      >
                        {expandedPost === post.id ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-bold mt-2">{post.title}</h4>
                  <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">{new Date(post.date).toLocaleString()}</p>
                  {expandedPost === post.id && (
                    <div className="mt-4 text-gray-600">
                      <p>{post.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="relative transform transition-transform duration-300 hover:scale-105 bg-white rounded-lg shadow-lg hover:shadow-xl">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1"
                    alt="Last Men in Aleppo"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-t-lg">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <a
                        href="#watch"
                        className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch
                      </a>
                      <button
                        onClick={() => toggleExpand('last-men')}
                        className="bg-transparent border border-red-600 text-red-600 px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
                      >
                        {expandedPost === 'last-men' ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-bold mt-2">Last Men in Aleppo</h4>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    After five years of war in Syria, the remaining citizens of Aleppo are getting ready for a siege.
                  </p>
                  {expandedPost === 'last-men' && (
                    <div className="mt-4 text-gray-600">
                      <p>
                        After five years of war in Syria, the remaining citizens of Aleppo are getting ready for a siege. Through the eyes of volunteer rescue workers called the White Helmets, Last Men in Aleppo allows audiences to experience the daily life, death, and struggle in the streets of Aleppo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative transform transition-transform duration-300 hover:scale-105 bg-white rounded-lg shadow-lg hover:shadow-xl">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
                    alt="Do Not Resist"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-t-lg">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <a
                        href="#watch"
                        className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch
                      </a>
                      <button
                        onClick={() => toggleExpand('do-not-resist')}
                        className="bg-transparent border border-red-600 text-red-600 px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
                      >
                        {expandedPost === 'do-not-resist' ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-bold mt-2">Do Not Resist</h4>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    A vital and influential exploration of the rapid militarization of the police in the United States.
                  </p>
                  {expandedPost === 'do-not-resist' && (
                    <div className="mt-4 text-gray-600">
                      <p>
                        A vital and influential exploration of the rapid militarization of the police in the United States. Do Not Resist puts viewers in the center of the action – from inside a police training seminar that teaches the importance of “righteous violence” to the floor of a congressional hearing on the proliferation of military equipment in small-town police departments.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative transform transition-transform duration-300 hover:scale-105 bg-white rounded-lg shadow-lg hover:shadow-xl">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1513542789411-b6a3a4df30c1"
                    alt="For Ahkeem"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-t-lg">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <a
                        href="#watch"
                        className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch
                      </a>
                      <button
                        onClick={() => toggleExpand('for-ahkeem')}
                        className="bg-transparent border border-red-600 text-red-600 px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
                      >
                        {expandedPost === 'for-ahkeem' ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-bold mt-2">For Ahkeem</h4>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    A 17-year-old girl in St. Louis navigates love and motherhood while facing systemic racism.
                  </p>
                  {expandedPost === 'for-ahkeem' && (
                    <div className="mt-4 text-gray-600">
                      <p>
                        A 17-year-old girl in St. Louis navigates love and motherhood while facing systemic racism. After a school fight lands her in juvenile court, Daje Shelton, a 17-year-old African American girl, is sentenced to an alternative high school. There, she fights for her future as she falls in love and becomes a mother.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative transform transition-transform duration-300 hover:scale-105 bg-white rounded-lg shadow-lg hover:shadow-xl">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1537815749002-de6a533c64b9"
                    alt="Iris"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-t-lg">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <a
                        href="#watch"
                        className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch
                      </a>
                      <button
                        onClick={() => toggleExpand('iris')}
                        className="bg-transparent border border-red-600 text-red-600 px-4 py-2 rounded-full font-semibold uppercase tracking-wide hover:bg-red-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
                      >
                        {expandedPost === 'iris' ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-bold mt-2">Iris</h4>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    A look at the life of Iris Apfel, the quick-witted, flamboyantly dressed 93-year-old style maven.
                  </p>
                  {expandedPost === 'iris' && (
                    <div className="mt-4 text-gray-600">
                      <p>
                        A look at the life of Iris Apfel, the quick-witted, flamboyantly dressed 93-year-old style maven. Albert Maysles’ final film, Iris, pairs the late documentarian with a subject who is one of a kind.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Documentaries;