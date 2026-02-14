import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react'; // ✅ FIXED: /react not /next
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Videos from './pages/Videos';
import BlogPost from './pages/BlogPost';
import Documentaries from './pages/Documentaries';
import News from './pages/News';
import Reports from './pages/Reports';
import Interviews from './pages/Interviews';
import Movies from './pages/Movies';
import Photojournalism from './pages/Photojournalism';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import AdminSignup from './components/AdminSignup';

// Admin routes component
function AdminRoutes() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fc561c] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <AdminSignup /> : <Navigate to="/admin" replace />} />
        <Route path="/" element={isAuthenticated ? <Admin /> : <Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/admin" : "/admin/login"} replace />} />
      </Routes>
    </>
  );
}

// Public routes component
function PublicRoutes() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Routes>
       
         
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/posts/:id" element={<BlogPost />} />
          <Route path="/documentaries" element={<Documentaries />} />
          <Route path="/news" element={<News />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/photojournalism" element={<Photojournalism />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

// Main App component
function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-100">
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
}

// ✅ CLEAN: Normal React 18 rendering (no hydrate, no react-snap)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics /> {/* ✅ Vercel Analytics for React */}
    </BrowserRouter>
  </React.StrictMode>
);