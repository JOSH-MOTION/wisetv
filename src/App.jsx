// src/App.js
import React from 'react';
import Header from './components/Header';
import WiseTvCarousel from './components/WiseTvCarousel'; // Fixed import path

// Import local images for sections
import pic1 from './assets/pic1.jpg';
import pic2 from './assets/pic2.jpg';
import pic3 from './assets/pic3.jpg';
import pic4 from './assets/pic4.jpg';
import pic5 from './assets/pic5.jpg';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <WiseTvCarousel />

      {/* Featured Video Section with YouTube Embed */}
      <section id="featured" className="py-10 text-center">
        <h2 className="text-3xl font-semibold mb-6">Featured Content</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/8hP9D6kZseM"
              title="Featured Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Documentaries */}
      <section id="documentaries" className="container mx-auto py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Documentaries</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={pic1}
              alt="Nature Unveiled"
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                console.log('Failed to load image: Nature Unveiled');
                e.target.src = {pic1};
              }}
            />
            <h4 className="text-xl font-bold">Nature Unveiled</h4>
            <p className="text-gray-600">Explore the wonders of the natural world.</p>
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="container mx-auto py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">News</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={pic2}
              alt="Breaking News"
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                console.log('Failed to load image: Breaking News');
                e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
              }}
            />
            <h4 className="text-xl font-bold">Breaking News</h4>
            <p className="text-gray-600">Latest updates from around the globe.</p>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section id="reports" className="container mx-auto py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={pic3}
              alt="Investigative Report"
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                console.log('Failed to load image: Investigative Report');
                e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
              }}
            />
            <h4 className="text-xl font-bold">Investigative Report</h4>
            <p className="text-gray-600">In-depth analysis of current issues.</p>
          </div>
        </div>
      </section>

      {/* Interviews */}
      <section id="interviews" className="container mx-auto py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Interviews</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={pic4}
              alt="Celebrity Spotlight"
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                console.log('Failed to load image: Celebrity Spotlight');
                e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
              }}
            />
            <h4 className="text-xl font-bold">Celebrity Spotlight</h4>
            <p className="text-gray-600">Exclusive talks with industry stars.</p>
          </div>
        </div>
      </section>

      {/* Movies */}
      <section id="movies" className="container mx-auto py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Movies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={pic5}
              alt="Blockbuster Hit"
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                console.log('Failed to load image: Blockbuster Hit');
                e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
              }}
            />
            <h4 className="text-xl font-bold">Blockbuster Hit</h4>
            <p className="text-gray-600">Watch the latest cinematic masterpiece.</p>
          </div>
        </div>
      </section>

      {/* Photojournalism */}
      <section id="photojournalism" className="container mx-auto py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Photojournalism</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={pic1} // Reusing pic1 for variety; you can add more images if needed
              alt="Captured Moments"
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                console.log('Failed to load image: Captured Moments');
                e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
              }}
            />
            <h4 className="text-xl font-bold">Captured Moments</h4>
            <p className="text-gray-600">Stories told through powerful images.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white p-4 text-center">
        <p>© 2025 WiseTv. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;