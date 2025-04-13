import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    setPosts(storedPosts);
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('storage-updated', fetchPosts);
    return () => window.removeEventListener('storage-updated', fetchPosts);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reader = new FileReader();

    const savePost = (imageBase64) => {
      const post = {
        id: Date.now(),
        title,
        category,
        content,
        image: imageBase64 || null,
        date: new Date().toISOString(),
      };
      const existingPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
      localStorage.setItem('wisetv-posts', JSON.stringify([...existingPosts, post]));
      window.dispatchEvent(new Event('storage-updated'));
      setTitle('');
      setCategory('');
      setContent('');
      setImage(null);
    };

    if (image) {
      reader.onloadend = () => savePost(reader.result);
      reader.readAsDataURL(image);
    } else {
      savePost(null);
    }
  };

  const handleDelete = (postId) => {
    const existingPosts = JSON.parse(localStorage.getItem('wisetv-posts') || '[]');
    const updatedPosts = existingPosts.filter(post => post.id !== postId);
    localStorage.setItem('wisetv-posts', JSON.stringify(updatedPosts));
    window.dispatchEvent(new Event('storage-updated'));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Add New Post Form */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-12">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="documentaries">Documentaries</option>
            <option value="news">News</option>
            <option value="reports">Reports</option>
            <option value="interviews">Interviews</option>
            <option value="movies">Movies</option>
            <option value="photojournalism">Photojournalism</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">
          Post Update
        </button>
      </form>

      {/* List of Posts with Delete Option */}
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg p-4">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                <p className="text-sm text-gray-500 mb-2">Category: {post.category}</p>
                <p className="text-sm text-gray-500 mb-4">{new Date(post.date).toLocaleString()}</p>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;