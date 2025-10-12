import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const COMPANY_PIN = import.meta.env.VITE_COMPANY_PIN || 'WISE2024';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (pin !== COMPANY_PIN) {
      setError('Invalid company PIN. Please contact support.');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (error) {
      setError('Signup failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#fc561c', transition: { duration: 0.3 } },
    blur: { scale: 1, borderColor: '#d1d5db', transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            <motion.div variants={inputVariants} whileFocus="focus">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.div variants={inputVariants} whileFocus="focus">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
            <motion.div variants={inputVariants} whileFocus="focus">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Company PIN
              </label>
              <input
                id="pin"
                name="pin"
                type="text"
                required
                className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:border-transparent transition-colors"
                placeholder="Company PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </motion.div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fc561c] text-white p-3 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#fc561c] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
      </motion.div>
    </div>
  );
};

export default AdminSignup;