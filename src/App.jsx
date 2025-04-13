import React from 'react';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import WiseTvCarousel from './components/Carousel';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <WiseTvCarousel />

      {/* Featured Video Section */}
      <section id="featured" className="py-10 text-center">
        <h2 className="text-3xl font-semibold mb-6">Featured Content</h2>
        <VideoPlayer />
      </section>

      {/* Documentaries */}
      <section id="documentaries" className="container mx-auto py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Documentaries</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
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