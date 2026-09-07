import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';
import BackgroundMusic from './components/BackgroundMusic';
import { Clapperboard } from 'lucide-react';

export default function App() {
  // Determine initial page from URL path or hash
  const getInitialPage = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.includes('/admin') || hash === '#admin') return 'admin';
    if (path.includes('/register') || hash === '#register') return 'register';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const targetUrl = page === 'home' ? cleanBase : `${cleanBase}#${page}`;
    window.history.pushState(null, '', targetUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-white selection:bg-[#e50914] selection:text-white relative">
      {/* Cinematic Top Red Ambient Line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e50914] to-transparent z-50 pointer-events-none opacity-80"></div>

      {/* Main Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={navigateTo}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigateRegister={() => navigateTo('register')} />
        )}
        {currentPage === 'register' && (
          <Register onNavigateHome={() => navigateTo('home')} />
        )}
        {currentPage === 'admin' && (
          <Admin onNavigateHome={() => navigateTo('home')} />
        )}
      </main>

      {/* Sticky Mobile "Register Now" Bottom Bar (visible on Home on mobile) */}
      {currentPage === 'home' && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => navigateTo('register')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#e50914] text-white font-extrabold tracking-wider uppercase text-sm shadow-[0_0_25px_rgba(229,9,20,0.6)] flex items-center justify-center space-x-2 border border-[#ff4d4d]"
          >
            <Clapperboard className="w-4 h-4" />
            <span>REGISTER FOR FRAME FEST ’26</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigateAdmin={() => navigateTo('admin')} />

      {/* Persistent Background Music Controller */}
      <BackgroundMusic isHome={currentPage === 'home'} />
    </div>
  );
}
