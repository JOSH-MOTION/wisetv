import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
  const [instagramHandle, setInstagramHandle] = useState('');
  const [facebookHandle, setFacebookHandle] = useState('');
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const formRef = useRef(null); // Ref to scroll to the form when editing

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
      if (editingPost) {
        const collectionName = editingPost.type === 'regular' ? 'posts' : 'socialLinks';
        const postRef = doc(db, collectionName, editingPost.id);

        if (editingPost.type === 'regular') {
          if (!title || !category || !content)
            return setError('Title, category, and content are required.');
          await updateDoc(postRef, {
            title,
            category: category.toLowerCase(),
            content,
            image: imageUrl || null,
            author: author || 'Anonymous',
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            date: new Date().toISOString(),
          });
        } else {
          if (!url) return setError('URL is required for social posts.');
          await updateDoc(postRef, {
            platform,
            url,
            title: title || `Social Post ${new Date().toLocaleString()}`,
            image: imageUrl || null,
            author: author || null,
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            date: new Date().toISOString(),
          });
        }
      } else {
        if (postType === 'regular') {
          if (!title || !category || !content)
            return setError('Title, category, and content are required.');
          const post = {
            title,
            category: category.toLowerCase(),
            content,
            image: imageUrl || null,
            author: author || 'Anonymous',
            date: new Date().toISOString(),
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
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
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
          };
          await addDoc(collection(db, 'socialLinks'), link);
        }
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving/updating post:', error);
      setError('Failed to save/update post: ' + error.message);
    }
  };

  const handleEdit = (item, type) => {
    setEditingPost({ id: item.id, type });
    setPostType(type);
    setTitle(item.title || '');
    setAuthor(item.author || '');
    setImageUrl(item.image || '');
    setInstagramHandle(item.instagramHandle || '');
    setFacebookHandle(item.facebookHandle || '');

    if (type === 'regular') {
      setCategory(item.category || '');
      setContent(item.content || '');
    } else {
      setPlatform(item.platform || 'instagram');
      setUrl(item.url || '');
    }

    // Scroll to the form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const resetForm = () => {
    setEditingPost(null);
    setPostType('regular');
    setTitle('');
    setCategory('');
    setContent('');
    setUrl('');
    setPlatform('instagram');
    setAuthor('');
    setImageUrl('');
    setInstagramHandle('');
    setFacebookHandle('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      {!user ? (
        <div>
          <h1 className="text-3xl font-bold text-center mb-6 text-red-600">Admin Login</h1>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <form
            onSubmit={handleLogin}
            className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
          >
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

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-12"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Post Type</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={editingPost}
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
              <label className="block text-gray-700 font-semibold mb-2">Author (Optional)</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g., John Doe"
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
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Instagram Handle (Optional)
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g., @wisetv"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Facebook Handle (Optional)
              </label>
              <input
                type="text"
                value={facebookHandle}
                onChange={(e) => setFacebookHandle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g., @wisetvpage"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
              >
                {editingPost ? 'Update Post' : 'Post Update'}
              </button>
              {editingPost && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
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
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mb-2">Category: {post.category}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Author: {post.author || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(post.date).toLocaleString()}
                    </p>
                    {post.instagramHandle && (
                      <p className="text-sm text-gray-500 mb-2">
                        Instagram:{' '}
                        <a
                          href={`https://instagram.com/${post.instagramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {post.instagramHandle}
                        </a>
                      </p>
                    )}
                    {post.facebookHandle && (
                      <p className="text-sm text-gray-500 mb-2">
                        Facebook:{' '}
                        <a
                          href={`https://facebook.com/${post.facebookHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {post.facebookHandle}
                        </a>
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post, 'regular')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, 'regular')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {socialLinks.map(link => (
                  <div key={link.id} className="bg-white rounded-lg shadow-lg p-4">
                    {link.image && (
                      <img
                        src={link.image}
                        alt={link.title}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2">{link.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">Platform: {link.platform}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Author: {link.author || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(link.date).toLocaleString()}
                    </p>
                    {link.instagramHandle && (
                      <p className="text-sm text-gray-500 mb-2">
                        Instagram:{' '}
                        <a
                          href={`https://instagram.com/${link.instagramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {link.instagramHandle}
                        </a>
                      </p>
                    )}
                    {link.facebookHandle && (
                      <p className="text-sm text-gray-500 mb-2">
                        Facebook:{' '}
                        <a
                          href={`https://facebook.com/${link.facebookHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {link.facebookHandle}
                        </a>
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(link, 'social')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id, 'social')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
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