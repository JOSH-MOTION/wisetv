import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { Upload, X, Edit, Trash2, Eye, EyeOff, Plus, Save, Loader } from 'lucide-react';

const CloudinaryUpload = ({ onUploadSuccess, onUploadError, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error('Failed to upload image: ' + error.message);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onUploadError?.('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onUploadError?.('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      onUploadSuccess?.(imageUrl);
    } catch (error) {
      onUploadError?.(error.message);
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    onUploadSuccess?.('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image Upload
      </label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-gray-300"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <label className="cursor-pointer">
            <span className="text-sm font-medium text-red-600 hover:text-red-500">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-red-600 h-2 rounded-full animate-pulse w-1/2"></div>
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchData();
    });
    return () => unsubscribe();
  }, []);

  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setError(null);
      setSuccess('Login successful!');
    } catch (error) {
      setError('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
    clearMessages();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPosts([]);
      setSocialLinks([]);
      setSuccess('Logged out successfully!');
    } catch (error) {
      setError('Logout failed: ' + error.message);
    }
    clearMessages();
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
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError('Please log in to post updates.');
    
    setLoading(true);
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
        setSuccess('Post updated successfully!');
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
        setSuccess('Post created successfully!');
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving/updating post:', error);
      setError('Failed to save/update post: ' + error.message);
    } finally {
      setLoading(false);
    }
    clearMessages();
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
    if (!user) return setError('Please log in to delete posts.');
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    try {
      const collectionName = type === 'regular' ? 'posts' : 'socialLinks';
      await deleteDoc(doc(db, collectionName, id));
      setSuccess('Post deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      setError('Failed to delete: ' + error.message);
    } finally {
      setLoading(false);
    }
    clearMessages();
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
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-8">
      {!user ? (
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-600 mt-2">Sign in to manage your content</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white p-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <Loader className="animate-spin mr-2" size={20} /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white rounded-2xl shadow-lg p-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Manage your content here.</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z"/>
              </svg>
              Sign Out
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8" ref={formRef}>
            <div className="flex items-center mb-6">
              <Plus className="mr-3 text-red-600" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Post Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={postType === 'social' ? 'Optional (auto-generated if empty)' : 'Enter post title'}
                    required={postType === 'regular'}
                  />
                </div>
              </div>

              {postType === 'regular' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Author name (optional)"
                    />
                  </div>
                </div>
              )}

              {postType === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://instagram.com/p/abc123"
                      required
                    />
                  </div>
                </div>
              )}

              {postType === 'regular' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="6"
                    placeholder="Write your content here..."
                    required
                  />
                </div>
              )}

              {/* Image Upload */}
              <CloudinaryUpload
                onUploadSuccess={setImageUrl}
                onUploadError={setError}
                currentImage={imageUrl}
              />

              {/* Social Handles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Handle</label>
                  <input
                    type="text"
                    value={facebookHandle}
                    onChange={(e) => setFacebookHandle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white p-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? <Loader className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                  {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                </button>
                
                {editingPost && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 text-white p-3 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                  >
                    <X className="mr-2" size={20} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Posts Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Manage Posts</h2>
            {posts.length === 0 && socialLinks.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No posts available</p>
                <p className="text-gray-400">Create your first post above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {post.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        By: {post.author || 'Anonymous'}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post, 'regular')}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, 'regular')}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {socialLinks.map(link => (
                  <div key={link.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    {link.image && (
                      <img
                        src={link.image}
                        alt={link.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {link.platform.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(link.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{link.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {link.url}
                        </a>
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        By: {link.author || 'N/A'}
                      </p>
                      {(link.instagramHandle || link.facebookHandle) && (
                        <div className="mb-4 space-y-1">
                          {link.instagramHandle && (
                            <p className="text-sm text-gray-600">
                              📱 {link.instagramHandle}
                            </p>
                          )}
                          {link.facebookHandle && (
                            <p className="text-sm text-gray-600">
                              👥 {link.facebookHandle}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(link, 'social')}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(link.id, 'social')}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Trash2 size={16} className="mr-1" />
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
      )}
    </div>
  );
};

export default Admin;