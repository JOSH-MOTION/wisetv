// src/components/ImprovedAdmin.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import CloudinaryUpload from './CloudinaryUpload';
import LazyImage from './LazyImage';

const ImprovedAdmin = () => {
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
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const formRef = useRef(null);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/dashboard/login');
    } catch (error) {
      setError('Logout failed: ' + error.message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsSnapshot, linksSnapshot] = await Promise.all([
        getDocs(collection(db, 'posts')),
        getDocs(collection(db, 'socialLinks'))
      ]);

      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const linksData = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setPosts(postsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setSocialLinks(linksData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch posts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingPost) {
        const collectionName = editingPost.type === 'regular' ? 'posts' : 'socialLinks';
        const postRef = doc(db, collectionName, editingPost.id);

        if (editingPost.type === 'regular') {
          if (!title || !category || !content) {
            throw new Error('Title, category, and content are required.');
          }
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
          if (!url) throw new Error('URL is required for social posts.');
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
        setSuccess('Post updated successfully!');
      } else {
        if (postType === 'regular') {
          if (!title || !category || !content) {
            throw new Error('Title, category, and content are required.');
          }
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
          if (!url) throw new Error('URL is required for social posts.');
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
        setSuccess('Post created successfully!');
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving/updating post:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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

    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      const collectionName = type === 'regular' ? 'posts' : 'socialLinks';
      await deleteDoc(doc(db, collectionName, id));
      setSuccess('Item deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      setError('Failed to delete: ' + error.message);
    } finally {
      setLoading(false);
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

  const handleImageUpload = (uploadedUrl) => {
    setImageUrl(uploadedUrl);
  };

  const handleImageUploadError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WiseTV Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your content and posts</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8" ref={formRef}>
          <h2 className="text-xl font-semibold mb-6">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={editingPost}
              >
                <option value="regular">Regular Post</option>
                <option value="social">Social Media Post</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title {postType === 'regular' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={postType === 'social' ? 'Optional (defaults to timestamp)' : 'Enter post title'}
              />
            </div>

            {/* Category for regular posts */}
            {postType === 'regular' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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

            {/* Content for regular posts */}
            {postType === 'regular' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                  placeholder="Enter post content"
                />
              </div>
            )}

            {/* Platform and URL for social posts */}
            {postType === 'social' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://instagram.com/p/abc..."
                  />
                </div>
              </>
            )}

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Author name (optional)"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <CloudinaryUpload
                onUploadSuccess={handleImageUpload}
                onUploadError={handleImageUploadError}
              />
              {imageUrl && (
                <div className="mt-4">
                  <LazyImage
                    src={imageUrl}
                    alt="Featured Image"
                    className="w-32 h-32 rounded-lg shadow-md"
                    width={128}
                    height={128}
                  />
                </div>
              )}
            </div>

            {/* Social Handles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle</label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="@wisetv"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Handle</label>
                <input
                  type="text"
                  value={facebookHandle}
                  onChange={(e) => setFacebookHandle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="@wisetvpage"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingPost ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  editingPost ? 'Update Post' : 'Create Post'
                )}
              </button>
              
              {editingPost && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-200 shadow-sm"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Posts Management */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Manage Posts</h2>
          
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}

          {!loading && posts.length === 0 && socialLinks.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Regular Posts */}
              {posts.map(post => (
                <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  {post.image && (
                    <LazyImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48"
                      width={400}
                      height={200}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    <p className="text-xs text-gray-500 mb-4">By {post.author || 'Anonymous'}</p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post, 'regular')}
                        className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, 'regular')}
                        className="flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded hover:bg-red-700 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              {socialLinks.map(link => (
                <div key={link.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  {link.image && (
                    <LazyImage
                      src={link.image}
                      alt={link.title}
                      className="w-full h-48"
                      width={400}
                      height={200}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {link.platform}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(link.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{link.title}</h3>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mb-3 block truncate"
                    >
                      {link.url}
                    </a>
                    <p className="text-xs text-gray-500 mb-4">By {link.author || 'N/A'}</p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(link, 'social')}
                        className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id, 'social')}
                        className="flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded hover:bg-red-700 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImprovedAdmin;