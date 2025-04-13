import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import the images from the assets folder
import pic1 from '../assets/pic1.jpg'; // Adjust the path based on your folder structure
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';

const Photojournalism = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts.filter(post => post.category === 'photojournalism'));
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Modal Viewer
  const openModal = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage('');
  };

  // Gallery Images with Individual Descriptions
  const galleryImages = posts.length > 0 ? posts.map(post => post.image).filter(Boolean) : [
    { src: pic1, description: 'Captured Moments: A glimpse of life through a lens.' },
    { src: pic2, description: 'Street Life: The raw beauty of everyday life.' },
    { src: pic3, description: 'Urban Journey: Exploring the untold stories in cities.' }
  ];

  return (
    <section className="container mx-auto py-10 pt-20">
      {/* Modal Viewer */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            <button 
              onClick={closeModal} 
              className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded-full"
            >
              X
            </button>
            <img src={currentImage} alt="Modal View" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}

      <h3 className="text-3xl font-semibold mb-8 text-center text-gray-800">Photojournalism</h3>

      {/* Info Section */}
      <div className="text-center mb-8 text-lg text-gray-600">
        <p>
          Explore the captivating world of photojournalism, where every image tells a unique story. 
          These powerful photographs capture moments that speak louder than words, allowing you to experience the world through the lens of those who document it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {currentPosts.length > 0 ? (
          currentPosts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-md mb-4 hover:scale-105 transition-all" />
              ) : (
                <img src={pic1} alt="Default" className="w-full h-48 object-cover rounded-md mb-4" />
              )}
              <h4 className="text-xl font-semibold text-gray-900">{post.title}</h4>
              <p className="text-gray-600 mt-2">{post.content}</p>
              <p className="text-sm text-gray-500 mt-4">{new Date(post.date).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50" 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg font-semibold">{currentPage} / {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50" 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Photo Gallery Section */}
      <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">Photo Gallery</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {galleryImages.map((img, index) => (
          <div key={index} className="relative group">
            <img 
              src={img.src} 
              alt={`Gallery ${index}`} 
              className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => openModal(img.src)} 
            />
            {/* Image Description on Hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-lg font-semibold">{img.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Photojournalism;
