import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [postType, setPostType] = useState('regular');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [error, setError] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchData();
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setError(null);
    } catch (error) {
      setError('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPosts([]);
      setSocialLinks([]);
    } catch (error) {
      setError('Logout failed: ' + error.message);
    }
  };

  const fetchData = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);

      const linksSnapshot = await getDocs(collection(db, 'socialLinks'));
      const linksData = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocialLinks(linksData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch posts: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError('Please log in to post updates.');
    try {
      if (postType === 'regular') {
        if (!title || !category || !content) return setError('Title, category, and content are required.');
        const post = {
          title,
          category: category.toLowerCase(),
          content,
          image: imageUrl || null,
          author: author || 'Anonymous',
          date: new Date().toISOString(),
        };
        await addDoc(collection(db, 'posts'), post);
      } else {
        if (!url) return setError('URL is required for social posts.');
        const link = {
          platform,
          url,
          title: title || `Social Post ${new Date().toLocaleString()}`,
          image: imageUrl || null,
          author: author || null,
          date: new Date().toISOString(),
          category: 'social',
        };
        await addDoc(collection(db, 'socialLinks'), link);
      }

      setPostType('regular');
      setTitle('');
      setCategory('');
      setContent('');
      setUrl('');
      setPlatform('instagram');
      setAuthor('');
      setImageUrl('');
      setError(null);
      fetchData();
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post: ' + error.message);
    }
  };

  const handleDelete = async (id, type) => {
    if (!user) return setError('Please log in to delete posts.');
    try {
      const collectionName = type === 'regular' ? 'posts' : 'socialLinks';
      await deleteDoc(doc(db, collectionName, id));
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      setError('Failed to delete: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      {!user ? (
        <div>
          <h1 className="text-3xl font-bold text-center mb-6 text-red-600">Admin Login</h1>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-center text-red-600">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
            >
              Log Out
            </button>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-12">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Post Type</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="regular">Regular Post (Blog, Interview, etc.)</option>
                <option value="social">Social Media Post (Instagram, YouTube, etc.)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                required={postType === 'regular'}
                placeholder={postType === 'social' ? 'Optional (defaults to timestamp)' : ''}
              />
            </div>
            {postType === 'regular' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
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
            )}
            {postType === 'regular' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  rows="4"
                  required
                />
              </div>
            )}
            {postType === 'social' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                    placeholder="e.g., https://instagram.com/p/abc"
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g., John Doe (optional)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Image URL (Optional, e.g., from Imgur or Unsplash)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g., https://images.unsplash.com/photo-123"
              />
              <p className="text-sm text-gray-500 mt-1">
                Note: Upload images to Imgur or use Unsplash, then paste the direct URL here.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
            >
              Post Update
            </button>
          </form>

          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Manage Posts</h2>
            {posts.length === 0 && socialLinks.length === 0 ? (
              <p className="text-center text-gray-600">No posts or social links available.</p>
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
                    <p className="text-sm text-gray-500 mb-2">Author: {post.author || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500 mb-4">{new Date(post.date).toLocaleString()}</p>
                    <button
                      onClick={() => handleDelete(post.id, 'regular')}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {socialLinks.map(link => (
                  <div key={link.id} className="bg-white rounded-lg shadow-lg p-4">
                    {link.image && (
                      <img
                        src={link.image}
                        alt={link.title}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2">{link.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{link.url}</p>
                    <p className="text-sm text-gray-500 mb-2">Platform: {link.platform}</p>
                    <p className="text-sm text-gray-500 mb-2">Author: {link.author || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mb-4">{new Date(link.date).toLocaleString()}</p>
                    <button
                      onClick={() => handleDelete(link.id, 'social')}
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
      )}
    </div>
  );
};

export default Admin;