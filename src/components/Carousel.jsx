import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

// Import local images
import studioImage from '../assets/studio.jpg';
import filmSetImage from '../assets/filmset.jpg';
import cinemaImage from '../assets/cinema.jpg';

// Define carousel items with local images
const carouselItems = [
  {
    src: studioImage,
    alt: 'TV Studio',
    caption: 'Behind the Scenes: TV Studio',
  },
  {
    src: filmSetImage,
    alt: 'Film Set',
    caption: 'Action on the Film Set',
  },
  {
    src: cinemaImage,
    alt: 'Cinema',
    caption: 'Cinema Experience',
  },
];

const WiseTvCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Auto-play logic
  const startAutoPlay = useCallback(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }, 3000);
    }
  }, [isPaused]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const handlePrev = () => {
    stopAutoPlay();
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    startAutoPlay();
  };

  const handleNext = () => {
    stopAutoPlay();
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    startAutoPlay();
  };

  const handleDotClick = (index) => {
    stopAutoPlay();
    setCurrentSlide(index);
    startAutoPlay();
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoPlay();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startAutoPlay();
  };

  return (
    <section
      className="relative h-[60vh] md:h-[80vh] lg:h-[90vh] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Slides */}
      <div className="relative w-full h-full overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={item.src}
              srcSet={`
                ${item.src}?w=400 400w,
                ${item.src}?w=800 800w,
                ${item.src}?w=1200 1200w
              `}
              sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
              alt={item.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                console.log(`Failed to load image: ${item.alt}`);
                e.target.src = 'https://via.placeholder.com/1200x600/CCCCCC/FFFFFF?text=Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <p className="absolute bottom-4 left-4 bg-red-600/80 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full">
              <Play className="w-4 h-4 inline mr-2" />
              {item.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Previous Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Next Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-red-600 scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Overlay with Headline, Tagline, and CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="text-center text-white px-4">
          <div className="inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-6">
            <Play className="w-4 h-4 mr-2 text-red-400" />
            <span className="text-red-300 text-sm font-medium">WGH TV</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent drop-shadow-lg">
            Welcome to WGH TV
          </h1>
          <p className="text-lg md:text-2xl mb-6 text-slate-200 drop-shadow-lg max-w-2xl">
            Empowering the Next Generation with Inspiring Stories
          </p>
          <Link
            to="/watch"
            className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WiseTvCarousel;