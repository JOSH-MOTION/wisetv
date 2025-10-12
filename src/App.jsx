import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Routes>
          {/* Admin routes without header/footer - completely separate */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Public routes with header and footer */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </div>
    </Router>
  );
}

// Admin routes component - no header/footer
function AdminRoutes() {
  // You can add authentication logic here later
  const isAuthenticated = false; // Set this based on your auth state
  
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      <Route path="/" element={isAuthenticated ? <Admin /> : <Navigate to="/admin/login" />} />
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
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