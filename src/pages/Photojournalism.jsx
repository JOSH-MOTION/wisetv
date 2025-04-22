import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Import the images from the assets folder
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';

const Photojournalism = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const photoPosts = postsData
        .filter(post => post.category === 'photojournalism')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(photoPosts);
    } catch (error) {
      console.error('Error fetching photojournalism posts:', error);
      setError('Failed to fetch photojournalism posts: ' + error.message);
      setPosts([]); // Fallback to static gallery if Firestore fails
    }
  };

  useEffect(() => {
    fetchPosts();
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

  // Gallery Images with Individual Descriptions (Use Firestore images if available)
  const galleryImages = posts.length > 0
    ? posts
        .map(post => ({
          src: post.image || pic1, // Use post.image if available, else fallback to pic1
          description: post.title || 'Untitled Photo', // Use post title as description
        }))
        .filter(item => item.src) // Filter out entries without a valid image
    : [
        { src: pic1, description: 'Captured Moments: A glimpse of life through a lens.' },
        { src: pic2, description: 'Street Life: The raw beauty of everyday life.' },
        { src: pic3, description: 'Urban Journey: Exploring the untold stories in cities.' },
      ];

  return (
    <section className="container mx-auto py-10 pt-20">
      {/* Error Display */}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}

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
            <img
              src={currentImage}
              alt="Modal View"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
          </div>
        </div>
      )}

      <h3 className="text-3xl font-semibold mb-8 text-center text-gray-800">Photojournalism</h3>

      {/* Info Section */}
      <div className="text-center mb-8 text-lg text-gray-600">
        <p>
          Explore the captivating world of photojournalism, where every image tells a unique story.
          These powerful photographs capture moments that speak louder than words, allowing you to
          experience the world through the lens of those who document it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {currentPosts.length > 0 ? (
          currentPosts.map(post => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md mb-4 hover:scale-105 transition-all"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
              ) : (
                <img
                  src={pic1}
                  alt="Default"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h4 className="text-xl font-semibold text-gray-900">{post.title}</h4>
              <p className="text-gray-600 mt-2">{post.content}</p>
              <p className="text-sm text-gray-500 mt-4">
                {new Date(post.date).toLocaleString()} • By {post.author || 'Anonymous'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">
            No photojournalism posts available.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {posts.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

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
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
              }}
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