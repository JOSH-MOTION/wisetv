import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    console.log('AdminRoutes: Checking auth at', new Date().toISOString());
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AdminRoutes: Auth state:', user ? `Logged in as ${user.uid}` : 'Not logged in');
      setIsAuthenticated(!!user);
      setLoading(false);
    }, (error) => {
      console.error('AdminRoutes: Auth error:', error.message, error.code);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-100">
        <div className="text-gray-900 text-lg font-semibold">Loading authentication...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Admin />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

// Public routes component
function PublicRoutes() {
  console.log('PublicRoutes: Rendering at', new Date().toISOString());
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documentaries" element={<Documentaries />} />
          <Route path="/news" element={<News />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/photojournalism" element={<Photojournalism />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

// Main App component
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-100">
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </div>
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);