import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnalyticsConsent from './components/AnalyticsConsent';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Tools from './pages/Tools';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Analytics from './pages/Analytics';
// Component to track page views
const PageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when route changes
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};
function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AuthProvider>
      <AnalyticsProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
            <PageTracker />
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </main>
            
            <Footer />
            <AnalyticsConsent />
          </div>
        </Router>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default App;