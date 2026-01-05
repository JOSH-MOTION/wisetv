import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Public routes with header and footer */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </div>
    </Router>
    </HelmetProvider>
  );
}

// Admin routes component
function AdminRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Admin auth state:', user ? `Logged in as ${user.email}` : 'Not logged in');
      setIsAuthenticated(!!user);
      if (user) {
        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminSnap = await getDoc(adminDocRef);
          const role = adminSnap.exists() ? adminSnap.data().role : null;
          setIsAdmin(role === 'admin');
        } catch (e) {
          console.error('Failed to verify admin role:', e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
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
      {/* Show header for authenticated admin users */}
      {isAuthenticated && isAdmin && <Header />}
      
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <AdminLogin /> : (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/admin/login" />)} />
        <Route path="/signup" element={!isAuthenticated ? <AdminSignup /> : (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/admin/login" />)} />
        <Route
          path="/"
          element={isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/admin/login" />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated && isAdmin ? "/admin" : "/admin/login"} />} />
      </Routes>
    </>
  );
}

// Public routes component - with header/footer
function PublicRoutes() {
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
          {/* Catch all - redirect to home for any unknown public routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;