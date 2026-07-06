import React, { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, User, Mail } from 'lucide-react';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const COMPANY_PIN = import.meta.env.VITE_COMPANY_PIN || 'WISE2024';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    if (pin !== COMPANY_PIN) {
      setError('Invalid company PIN. Please contact support.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    if (!username.trim()) {
      setError('Username is required.');
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: username.trim(),
        role: 'admin',
        createdAt: new Date().toISOString(),
      });

      // Save admin data to Firestore 'admins' collection
      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        email: user.email,
        username: username.trim(),
        role: 'admin',
        companyPin: COMPANY_PIN,
        createdAt: new Date().toISOString(),
      });

      console.log('Admin account created and saved to Firestore:', user.uid);
      navigate('/admin');
    } catch (error) {
      console.error('Signup error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('Signup failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-8">
          <motion.div
            className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-[#fc561c] shadow-md"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <Lock className="h-6 w-6 text-white" />
          </motion.div>
          <motion.h2
            className="mt-6 text-3xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Admin Signup
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Create an admin account with the company PIN
          </motion.p>
        </div>

        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-10 p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password * (min. 6 characters)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength="6"
                className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Company PIN *
              </label>
              <input
                id="pin"
                name="pin"
                type="text"
                required
                className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                placeholder="Enter company PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B132B] text-white p-3 rounded-lg font-medium hover:bg-[#1C2541] focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V4a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/admin/login"
            className="text-sm text-[#0B132B] hover:text-[#1C2541] font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignup;