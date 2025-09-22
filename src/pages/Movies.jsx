import React, { useState, useEffect, useCallback } from 'react';
import { Play, Share2, Film } from 'lucide-react';
import WiseLogo from '../assets/Wise.svg'; // Import the Wise.svg logo

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState('');

  // TMDB API key
  const API_KEY = '3f832f21954f829747ffba0717ded3ee';

  // Fetch movies from TMDB
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      let url = `https://api.themoviedb.org/3/movie/${selectedCategory}?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch movies from TMDB');
      const data = await response.json();
      const moviesWithTrailers = await Promise.all(
        data.results.map(async (movie) => {
          const trailerResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
          );
          const trailerData = await trailerResponse.json();
          const trailer = trailerData.results.find(
            (video) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          return {
            id: movie.id,
            title: movie.title,
            content: movie.overview,
            date: movie.release_date,
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=Image+Not+Found',
            trailerKey: trailer ? trailer.key : '',
            category: selectedCategory,
            views: Math.floor(Math.random() * 10000), // Mock views
            author: 'TMDB', // Mock author
          };
        })
      );
      setMovies(moviesWithTrailers);
      setTotalPages(Math.min(data.total_pages, 100)); // Cap at 100 pages for performance
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies: ' + error.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const openTrailerModal = (trailerKey) => {
    if (trailerKey) {
      setCurrentTrailer(`https://www.youtube.com/embed/${trailerKey}`);
      setTrailerModalOpen(true);
    } else {
      alert('No trailer available for this movie.');
    }
  };

  const closeTrailerModal = () => {
    setTrailerModalOpen(false);
    setCurrentTrailer('');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const shareMovie = (platform, movie) => {
    const shareUrls = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.themoviedb.org/movie/${movie.id}`)}&quote=${encodeURIComponent(movie.title)}`,
      Twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(movie.title)}&url=${encodeURIComponent(`https://www.themoviedb.org/movie/${movie.id}`)}`,
      Instagram: 'https://www.instagram.com',
      YouTube: 'https://www.youtube.com',
    };
    if (platform === 'Instagram' || platform === 'YouTube') {
      alert(`Please share "${movie.title}" manually on ${platform}!`);
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const categories = ['popular', 'now_playing', 'upcoming', 'top_rated'];

  return (
    <section className="pt-20 min-h-screen bg-gray-900 text-white">
      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-medium ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                } transition-colors`}
              >
                {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="container mx-auto px-4 py-12">
        <h4 className="text-3xl font-bold mb-8 text-center text-red-400">Featured Movies</h4>
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="h-96 bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <div key={movie.id} className="relative group bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x750?text=Image+Not+Found';
                    }}
                  />
                  {/* Wise.svg watermark on the first trailer */}
                  {index === 0 && (
                    <img
                      src={WiseLogo}
                      alt="WiseTV Watermark"
                      className="absolute bottom-4 right-4 h-8 w-auto opacity-50"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="text-xl font-bold text-white">{movie.title}</h4>
                    <p className="text-sm text-gray-300 line-clamp-2">{movie.content}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openTrailerModal(movie.trailerKey)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                        aria-label="Watch trailer"
                      >
                        <Film className="w-5 h-5" />
                      </button>
                      {['Facebook', 'Twitter'].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => shareMovie(platform, movie)}
                          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                          aria-label={`Share on ${platform}`}
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Play className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No Movies Available</h3>
                <p className="text-gray-400">Try a different search or category!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {movies.length > 0 && (
        <div className="container mx-auto px-4 flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-red-600 text-white rounded-full disabled:opacity-50 hover:bg-red-700 transition-all"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg font-semibold text-gray-200">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-red-600 text-white rounded-full disabled:opacity-50 hover:bg-red-700 transition-all"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Trailer Modal */}
      {trailerModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="relative bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full mx-4">
            <button
              onClick={closeTrailerModal}
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={currentTrailer}
                title="Movie Trailer"
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <img
              src={WiseLogo}
              alt="WiseTV Watermark"
              className="h-6 w-auto mx-auto mt-4 opacity-50"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Movies;