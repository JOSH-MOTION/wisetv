// src/components/WiseTvCarousel.js
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';

// Import local images
import studioImage from '../assets/studio.jpg';
import filmSetImage from '../assets/filmset.jpg';
import cinemaImage from '../assets/cinema.jpg';

// Debug: Log the image imports to verify they are loading
console.log('Studio Image:', studioImage);
console.log('Film Set Image:', filmSetImage);
console.log('Cinema Image:', cinemaImage);

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
  return (
    <section className="relative h-screen">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        interval={3000}
        emulateTouch={true}
        swipeable={true}
        dynamicHeight={false}
        className="h-full w-full"
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="relative w-full h-screen">
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
              onError={(e) => {
                console.log(`Failed to load image: ${item.alt}`);
                e.target.src = 'https://via.placeholder.com/1200x600/CCCCCC/FFFFFF?text=Image+Not+Found';
              }}
            />
            <p className="legend bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded">
              {item.caption}
            </p>
          </div>
        ))}
      </Carousel>

      {/* Overlay with Headline, Tagline, and CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-opacity-50">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to WiseTV
          </h1>
          <p className="text-lg md:text-2xl mb-6 drop-shadow-lg">
            Empowering the Next Generation with Inspiring Stories
          </p>
          <Link
            to="/watch"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-500 transition-colors shadow-lg"
          >
            Watch Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WiseTvCarousel;