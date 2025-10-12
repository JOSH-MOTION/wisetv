import React from 'react';
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
import { useState, useEffect } from 'react';

// Component to handle admin routes
function AdminRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Routes without Header/Footer */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      {/* Admin dashboard with Header */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <>
              <Header />
              <main className="flex-grow">
                <Admin />
              </main>
              {/* Optional: Include Footer if desired */}
              {/* <Footer /> */}
            </>
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

// Component to handle public routes
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);