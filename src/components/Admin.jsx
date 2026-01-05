import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { Upload, X, Edit, Trash2, Eye, EyeOff, Plus, Save, Loader, Download, Image, LogOut, CheckCircle, AlertCircle, Sparkles,Share2 } from 'lucide-react';

const CloudinaryUpload = ({ onUploadSuccess, onUploadError, currentImage, platform, url, showThumbnailOptions }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);

  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const generateThumbnailFromUrl = async (url, platform) => {
    if (!url) return null;
    setGeneratingThumbnail(true);
    
    try {
      let thumbnailUrl = null;

      if (platform?.toLowerCase() === 'youtube') {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
          thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          const exists = await checkImageExists(thumbnailUrl);
          if (!exists) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }
      } else {
        thumbnailUrl = createPlaceholderImage(platform);
      }

      if (thumbnailUrl) {
        const exists = await checkImageExists(thumbnailUrl);
        if (exists) {
          setPreview(thumbnailUrl);
          onUploadSuccess?.(thumbnailUrl);
          return thumbnailUrl;
        }
      }
    } catch (error) {
      console.log('Thumbnail generation failed:', error);
      onUploadError?.('Failed to generate thumbnail: ' + error.message);
    } finally {
      setGeneratingThumbnail(false);
    }
    
    return null;
  };

  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const getYouTubeVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
      /youtube\.com\/watch\?.*v=([^&?#]+)/,
      /youtu\.be\/([^&?#]+)/,
      /youtube\.com\/embed\/([^&?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const createPlaceholderImage = (platform) => {
    const colors = {
      instagram: { bg: '#E4405F', text: '#FFFFFF' },
      facebook: { bg: '#1877F2', text: '#FFFFFF' },
      youtube: { bg: '#FF0000', text: '#FFFFFF' },
      twitter: { bg: '#1DA1F2', text: '#FFFFFF' },
      tiktok: { bg: '#000000', text: '#FFFFFF' },
    };
    
    const color = colors[platform.toLowerCase()] || { bg: '#CCCCCC', text: '#FFFFFF' };
    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    
    const svg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="${color.bg}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
          ${platformName} Post
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

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
    const data = await response.json();
    return data.secure_url;
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Thumbnail Image
        </label>
        
        {showThumbnailOptions && platform && platform !== 'regular' && url && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => generateThumbnailFromUrl(url, platform)}
            disabled={generatingThumbnail || !url}
            className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-sm"
          >
            <Download size={12} />
            {generatingThumbnail ? 'Generating...' : 'Auto-Generate'}
          </motion.button>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div 
            key="preview"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative group"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-xl border-2 border-gray-200 shadow-md"
            />
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => { setPreview(null); onUploadSuccess?.(''); }}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#fc561c] hover:bg-orange-50/30 transition-all cursor-pointer bg-gradient-to-br from-gray-50 to-white"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            </motion.div>
            
            <label className="cursor-pointer block">
              <span className="text-sm font-semibold text-[#fc561c] hover:text-orange-600 bg-orange-100 px-6 py-2.5 rounded-lg inline-block transition-all hover:shadow-md">
                {uploading ? 'Uploading...' : 'Choose Image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            <p className="text-xs text-gray-500 mt-4">PNG, JPG, WEBP up to 10MB</p>
            
            {generatingThumbnail && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600"
              >
                <Loader className="animate-spin" size={16} />
                Generating thumbnail...
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {uploading && (
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
        >
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="bg-gradient-to-r from-[#fc561c] to-orange-400 h-2 w-1/3"
          />
        </motion.div>
      )}
    </motion.div>
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
  const [thumbnailOption, setThumbnailOption] = useState('auto');
  const formRef = useRef(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchData();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (postType === 'regular') {
      setThumbnailOption('custom');
    } else {
      setThumbnailOption('auto');
    }
  }, [postType]);

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
      setSuccess('Welcome back! 🎉');
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
      setSuccess('Logged out successfully! 👋');
    } catch (error) {
      setError('Logout failed: ' + error.message);
    }
    clearMessages();
  };

  const fetchData = async () => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        setPosts([]);
        setSocialLinks([]);
        return;
      }

      const postsQuery = query(collection(db, 'posts'), where('createdBy', '==', currentUserId));
      const linksQuery = query(collection(db, 'socialLinks'), where('createdBy', '==', currentUserId));

      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(postsData);

      const linksSnapshot = await getDocs(linksQuery);
      const linksData = linksSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setSocialLinks(linksData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch posts: ' + error.message);
    }
    clearMessages();
  };

  const createPlaceholderImage = (platform) => {
    const colors = {
      instagram: { bg: '#E4405F', text: '#FFFFFF' },
      facebook: { bg: '#1877F2', text: '#FFFFFF' },
      youtube: { bg: '#FF0000', text: '#FFFFFF' },
      twitter: { bg: '#1DA1F2', text: '#FFFFFF' },
      tiktok: { bg: '#000000', text: '#FFFFFF' },
    };
    
    const color = colors[platform.toLowerCase()] || { bg: '#CCCCCC', text: '#FFFFFF' };
    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    
    const svg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="${color.bg}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
          ${platformName} Post
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getYouTubeVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
      /youtube\.com\/watch\?.*v=([^&?#]+)/,
      /youtu\.be\/([^&?#]+)/,
      /youtube\.com\/embed\/([^&?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
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
            views: 0
          });
        } else {
          if (!url || !category) return setError('URL and category are required for social posts.');
          
          let finalImageUrl = imageUrl;
          if (thumbnailOption === 'auto' && !finalImageUrl) {
            if (platform === 'youtube') {
              const videoId = getYouTubeVideoId(url);
              if (videoId) finalImageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
            if (!finalImageUrl) finalImageUrl = createPlaceholderImage(platform);
          }
          
          await updateDoc(postRef, {
            platform,
            url,
            category: category.toLowerCase(),
            title: title || `Social Post ${new Date().toLocaleString()}`,
            image: thumbnailOption === 'none' ? null : finalImageUrl,
            author: author || null,
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            date: new Date().toISOString(),
            views: 0,
          });
        }
        setSuccess('Post updated successfully! ✨');
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
            createdAt: serverTimestamp(),
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            createdBy: user.uid,
            views: 0,
          };
          await addDoc(collection(db, 'posts'), post);
        } else {
          if (!url || !category) return setError('URL and category are required for social posts.');
          
          let finalImageUrl = imageUrl;
          if (thumbnailOption === 'auto' && !finalImageUrl) {
            if (platform === 'youtube') {
              const videoId = getYouTubeVideoId(url);
              if (videoId) finalImageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
            if (!finalImageUrl) finalImageUrl = createPlaceholderImage(platform);
          }
          
          const link = {
            platform,
            url,
            category: category.toLowerCase(),
            title: title || `Social Post ${new Date().toLocaleString()}`,
            image: thumbnailOption === 'none' ? null : finalImageUrl,
            author: author || null,
            date: new Date().toISOString(),
            createdAt: serverTimestamp(),
            instagramHandle: instagramHandle || null,
            facebookHandle: facebookHandle || null,
            createdBy: user.uid,
            views: 0,
          };
          await addDoc(collection(db, 'socialLinks'), link);
        }
        setSuccess('Post created successfully! 🎉');
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
      setThumbnailOption('custom');
    } else {
      setCategory(item.category || '');
      setPlatform(item.platform || 'instagram');
      setUrl(item.url || '');
      setThumbnailOption(item.image ? 'custom' : 'auto');
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
      setSuccess('Post deleted successfully! 🗑️');
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
    setThumbnailOption('auto');
    setError(null);
    setSuccess(null);
  };

  const getPlatformPlaceholders = (platform) => {
    const placeholders = {
      instagram: 'https://instagram.com/p/ABC123xyz',
      facebook: 'https://web.facebook.com/profile.php?id=61582270771234',
      youtube: 'https://youtube.com/watch?v=ABC123xyz',
      twitter: 'https://twitter.com/username/status/123456',
      tiktok: 'https://tiktok.com/@username/video/123456'
    };
    return placeholders[platform] || 'Enter social media URL';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-24 pb-8 mt-8">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-br from-[#fc561c] to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-gray-600 mt-2">Sign in to manage your content</p>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
                  >
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                    placeholder="Enter your email"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                      placeholder="Enter your password"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#fc561c] to-orange-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? <Loader className="animate-spin mr-2" size={20} /> : null}
                  {loading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg p-8 border border-gray-100"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Welcome back! Manage your content here.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="mt-4 md:mt-0 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
              >
                <LogOut size={18} />
                Sign Out
              </motion.button>
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
                >
                  <AlertCircle className="text-red-500" size={20} />
                  <p className="text-red-600">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"
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
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100"
              ref={formRef}
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-[#fc561c] to-orange-600 p-3 rounded-2xl shadow-lg"
                >
                  <Plus className="text-white" size={24} />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Post Type</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                      disabled={editingPost}
                    >
                      <option value="regular">📝 Regular Post</option>
                      <option value="social">📱 Social Media Post</option>
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title {postType === 'regular' && <span className="text-[#fc561c]">*</span>}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                      placeholder={postType === 'social' ? 'Optional (auto-generated)' : 'Enter post title'}
                      required={postType === 'regular'}
                    />
                  </motion.div>
                </motion.div>

                {postType === 'regular' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-[#fc561c]">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="blog">📝 Blog</option>
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
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                        placeholder="Author name (optional)"
                      />
                    </div>
                  </motion.div>
                )}

                {postType === 'social' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Platform <span className="text-[#fc561c]">*</span>
                        </label>
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category <span className="text-[#fc561c]">*</span>
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="blog">📝 Blog</option>
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        URL <span className="text-[#fc561c]">*</span>
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                        placeholder={getPlatformPlaceholders(platform)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Thumbnail Options
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['auto', 'custom', 'none'].map((option) => (
                          <motion.label
                            key={option}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              thumbnailOption === option
                                ? 'border-[#fc561c] bg-orange-50'
                                : 'border-gray-200 hover:border-[#fc561c] bg-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name="thumbnailOption"
                              value={option}
                              checked={thumbnailOption === option}
                              onChange={(e) => setThumbnailOption(e.target.value)}
                              className="text-[#fc561c] focus:ring-[#fc561c] mr-3"
                            />
                            <div>
                              <div className="font-semibold text-gray-900 capitalize">{option}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {option === 'auto' && 'Platform thumbnail'}
                                {option === 'custom' && 'Upload your own'}
                                {option === 'none' && 'Text-only card'}
                              </div>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {postType === 'regular' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Content <span className="text-[#fc561c]">*</span>
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50 resize-none"
                      rows="6"
                      placeholder="Write your content here..."
                      required
                    />
                  </motion.div>
                )}

                {(postType === 'regular' || thumbnailOption === 'custom') && (
                  <CloudinaryUpload
                    onUploadSuccess={setImageUrl}
                    onUploadError={setError}
                    currentImage={imageUrl}
                    platform={postType === 'social' ? platform : 'regular'}
                    url={url}
                    showThumbnailOptions={postType === 'social'}
                  />
                )}

                {postType === 'social' && thumbnailOption === 'auto' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <Sparkles className="text-blue-600 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800">
                      <strong>Auto-Thumbnail:</strong> {
                        platform === 'youtube' 
                          ? 'YouTube thumbnail will be automatically fetched.' 
                          : `${platform.charAt(0).toUpperCase() + platform.slice(1)}-themed placeholder will be generated.`
                      }
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📱 Instagram Handle</label>
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">👥 Facebook Handle</label>
                    <input
                      type="text"
                      value={facebookHandle}
                      onChange={(e) => setFacebookHandle(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-all bg-gray-50"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#fc561c] to-orange-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? <Loader className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                    {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                  </motion.button>
                  
                  {editingPost && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-500 text-white p-4 rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center justify-center"
                    >
                      <X className="mr-2" size={20} />
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
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Manage Posts</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="bg-[#fc561c] text-white px-3 py-1 rounded-full font-semibold">
                    {posts.length}
                  </span>
                  <span>Regular</span>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-semibold ml-2">
                    {socialLinks.length}
                  </span>
                  <span>Social</span>
                </div>
              </div>
              
              {posts.length === 0 && socialLinks.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"
                  >
                    <Sparkles className="w-16 h-16 text-gray-400" />
                  </motion.div>
                  <p className="text-gray-500 text-xl font-semibold">No posts available</p>
                  <p className="text-gray-400 mt-2">Create your first post above!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-gray-100"
                    >
                      {post.image && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="overflow-hidden"
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-48 object-cover transition-transform duration-300"
                            onError={(e) => {
                              const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#CCCCCC"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666666" text-anchor="middle" dominant-baseline="middle">Image Not Found</text></svg>`;
                              e.target.src = `data:image/svg+xml;base64,${btoa(svg)}`;
                            }}
                          />
                        </motion.div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block bg-gradient-to-r from-[#fc561c] to-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                            {post.category.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                        <p className="text-xs text-gray-500 mb-4">
                          By: {post.author || 'Anonymous'}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(post, 'regular')}
                            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center font-medium shadow-sm"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(post.id, 'regular')}
                            className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center font-medium shadow-sm"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                              const url = `${window.location.origin}/posts/${post.id}`;
                              try {
                                if (navigator.share) {
                                  await navigator.share({ title: post.title || 'Blog post', url });
                                } else if (navigator.clipboard) {
                                  await navigator.clipboard.writeText(url);
                                  setSuccess('Link copied to clipboard');
                                } else {
                                  window.prompt('Copy this link', url);
                                }
                              } catch (_) {}
                            }}
                            className="flex-1 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center font-medium shadow-sm"
                          >
                            <Share2 size={16} className="mr-1" />
                            Share
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {socialLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (posts.length + index) * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="bg-gradient-to-br from-purple-50 to-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border-2 border-purple-200"
                    >
                      {link.image && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="overflow-hidden"
                        >
                          <img
                            src={link.image}
                            alt={link.title}
                            className="w-full h-48 object-cover transition-transform duration-300"
                            onError={(e) => {
                              const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#CCCCCC"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666666" text-anchor="middle" dominant-baseline="middle">Image Not Found</text></svg>`;
                              e.target.src = `data:image/svg+xml;base64,${btoa(svg)}`;
                            }}
                          />
                        </motion.div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm uppercase">
                            {link.platform} - {link.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(link.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900">{link.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {link.url}
                          </a>
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          By: {link.author || 'N/A'}
                        </p>
                        {(link.instagramHandle || link.facebookHandle) && (
                          <div className="mb-4 space-y-1">
                            {link.instagramHandle && (
                              <p className="text-xs text-gray-600">📱 {link.instagramHandle}</p>
                            )}
                            {link.facebookHandle && (
                              <p className="text-xs text-gray-600">👥 {link.facebookHandle}</p>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(link, 'social')}
                            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center font-medium shadow-sm"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(link.id, 'social')}
                            className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center font-medium shadow-sm"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;