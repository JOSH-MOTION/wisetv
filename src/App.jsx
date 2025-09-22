// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Routes>
          {/* Admin route without header/footer */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Public routes with header and footer */}
          <Route path="/*" element={
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
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;