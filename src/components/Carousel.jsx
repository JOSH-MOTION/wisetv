import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import studioImage from '../assets/studio.jpeg';

const WiseTvCarousel = () => {
  return (
    <div className="relative top-0">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        className="h-screen"
      >
        <div>
          <img src={studioImage} alt="TV Studio" className="w-full h-screen object-cover" />
          <p className="legend">Behind the Scenes: TV Studio</p>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=2070&auto=format&fit=crop"
            alt="Film Set"
            className="w-full h-screen object-cover"
          />
          <p className="legend">Action on the Film Set</p>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=2070&auto=format&fit=crop"
            alt="Cinema"
            className="w-full h-screen object-cover"
          />
          <p className="legend">Cinema Experience</p>
        </div>
      </Carousel>

      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
          Welcome to WiseTv
        </h2>
      </div>
    </div>
  );
};

export default WiseTvCarousel;
