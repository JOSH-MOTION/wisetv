import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { X, Edit, Trash2, Plus, Save, Loader, Download, Image as ImageIcon, CheckCircle, AlertCircle, Sparkles, FileText, Video } from 'lucide-react';

// Cloudinary Upload Component (shortened for space)
const CloudinaryUpload = ({ onUploadSuccess, onUploadError, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  useEffect(() => setPreview(currentImage || null), [currentImage]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!response.ok) throw new Error('Upload failed');
    return (await response.json()).secure_url;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return onUploadError?.('Please select an image');
    if (file.size > 10 * 1024 * 1024) return onUploadError?.('Max 10MB');

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

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative group">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl border-2 border-gray-200" />
          <button
            type="button"
            onClick={() => { setPreview(null); onUploadSuccess?.(''); }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#fc561c] transition-all">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <label className="cursor-pointer">
            <span className="text-sm font-semibold text-[#fc561c] bg-orange-50 px-6 py-2 rounded-lg inline-block hover:bg-orange-100">
              {uploading ? 'Uploading...' : 'Choose Image'}
            </span>
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={uploading} />
          </label>
          <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
        </div>
      )}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#fc561c] h-2 rounded-full animate-pulse w-1/2"></div>
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchUserPosts(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
  };

  // Fetch only posts created by current user
  const fetchUserPosts = async (userId) => {
    try {
      const postsQuery = query(collection(db, 'posts'), where('createdBy', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);

      const linksQuery = query(collection(db, 'socialLinks'), where('createdBy', '==', userId));
      const linksSnapshot = await getDocs(linksQuery);
      const linksData = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocialLinks(linksData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch your posts');
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
          if (!title || !category || !content) {
            setLoading(false);
            return setError('Title, category, and content are required.');
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
          if (!url || !category) {
            setLoading(false);
            return setError('URL and category are required.');
          }
          await updateDoc(postRef, {
            platform,
            url,
            category: category.toLowerCase(),
            title: title || `Social Post ${new Date().toLocaleString()}`,
            image: imageUrl || null,
            author: author || null,
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            date: new Date().toISOString(),
          });
        }
        setSuccess('Post updated successfully! ✨');
      } else {
        if (postType === 'regular') {
          if (!title || !category || !content) {
            setLoading(false);
            return setError('Title, category, and content are required.');
          }
          await addDoc(collection(db, 'posts'), {
            title,
            category: category.toLowerCase(),
            content,
            image: imageUrl || null,
            author: author || 'Anonymous',
            date: new Date().toISOString(),
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            createdBy: user.uid, // IMPORTANT: Track owner
          });
        } else {
          if (!url || !category) {
            setLoading(false);
            return setError('URL and category are required.');
          }
          await addDoc(collection(db, 'socialLinks'), {
            platform,
            url,
            category: category.toLowerCase(),
            title: title || `Social Post ${new Date().toLocaleString()}`,
            image: imageUrl || null,
            author: author || null,
            date: new Date().toISOString(),
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            createdBy: user.uid, // IMPORTANT: Track owner
          });
        }
        setSuccess('Post created successfully! 🎉');
      }

      resetForm();
      fetchUserPosts(user.uid);
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post: ' + error.message);
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
      setCategory(item.category || '');
      setPlatform(item.platform || 'instagram');
      setUrl(item.url || '');
    }

    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Delete this post?')) return;
    
    setLoading(true);
    try {
      const collectionName = type === 'regular' ? 'posts' : 'socialLinks';
      await deleteDoc(doc(db, collectionName, id));
      setSuccess('Post deleted! 🗑️');
      fetchUserPosts(user.uid);
    } catch (error) {
      setError('Failed to delete');
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-[#fc561c] to-orange-600 rounded-3xl p-6 text-white shadow-lg">
            <FileText className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold">{posts.length}</h3>
            <p className="text-white/80 text-sm">Regular Posts</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg">
            <Video className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold">{socialLinks.length}</h3>
            <p className="text-white/80 text-sm">Social Posts</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg">
            <Sparkles className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold">{posts.length + socialLinks.length}</h3>
            <p className="text-white/80 text-sm">Total Content</p>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
            >
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-green-600">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100"
          ref={formRef}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#fc561c] to-orange-600 p-3 rounded-2xl">
              <Plus className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Post Type</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                  disabled={editingPost}
                >
                  <option value="regular">📝 Regular Post</option>
                  <option value="social">📱 Social Media</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title {postType === 'regular' && <span className="text-[#fc561c]">*</span>}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                  placeholder="Enter title"
                  required={postType === 'regular'}
                />
              </div>
            </div>

            {postType === 'regular' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-[#fc561c]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="documentaries">🎬 Documentaries</option>
                      <option value="news">📰 News</option>
                      <option value="reports">📊 Reports</option>
                      <option value="interviews">🎤 Interviews</option>
                      <option value="movies">🎥 Movies</option>
                      <option value="photojournalism">📸 Photojournalism</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content <span className="text-[#fc561c]">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50 resize-none"
                    rows="6"
                    placeholder="Write your content..."
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Platform *</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                      required
                    >
                      <option value="instagram">📷 Instagram</option>
                      <option value="facebook">👍 Facebook</option>
                      <option value="youtube">▶️ YouTube</option>
                      <option value="twitter">🐦 Twitter/X</option>
                      <option value="tiktok">🎵 TikTok</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="documentaries">🎬 Documentaries</option>
                      <option value="news">📰 News</option>
                      <option value="reports">📊 Reports</option>
                      <option value="interviews">🎤 Interviews</option>
                      <option value="movies">🎥 Movies</option>
                      <option value="photojournalism">📸 Photojournalism</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL *</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                    placeholder="https://..."
                    required
                  />
                </div>
              </>
            )}

            <CloudinaryUpload
              onUploadSuccess={setImageUrl}
              onUploadError={setError}
              currentImage={imageUrl}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📱 Instagram</label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">👥 Facebook</label>
                <input
                  type="text"
                  value={facebookHandle}
                  onChange={(e) => setFacebookHandle(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#fc561c] bg-gray-50"
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#fc561c] to-orange-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                {loading ? 'Saving...' : (editingPost ? 'Update' : 'Create')}
              </motion.button>
              
              {editingPost && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white p-4 rounded-xl font-semibold hover:bg-gray-600 flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">My Posts</h2>
              
          {posts.length === 0 && socialLinks.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-semibold">No posts yet</p>
              <p className="text-gray-400 mt-2">Create your first post above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#fc561c] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post, 'regular')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, 'regular')}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {socialLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (posts.length + i) * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 border-purple-200"
                >
                  {link.image && (
                    <img src={link.image} alt={link.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {link.platform.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(link.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{link.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 truncate">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {link.url}
                      </a>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(link, 'social')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id, 'social')}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;