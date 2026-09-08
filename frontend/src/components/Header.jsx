import React, { useState, useRef, useEffect } from 'react';
import { Film, Menu, X, Clapperboard, User, Shield, LogIn } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function Header({ currentPage, setCurrentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef(null);

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (page, anchorId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setAdminMenuOpen(false);
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222222] transition-colors">
      {/* Top micro film perforation line */}
      <div className="h-1.5 w-full film-strip-border opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: HICET & Fest Identity */}
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded bg-[#161616] border border-[#333] flex items-center justify-center text-[#e50914] group-hover:border-[#e50914] transition-all">
              <Film className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold tracking-widest text-[#e50914] bg-[#e50914]/10 px-1.5 py-0.5 rounded border border-[#e50914]/30">
                  {EVENT_CONFIG.collegeShort}
                </span>
                <span className="text-xs text-neutral-400 font-medium">AIML</span>
              </div>
              <div className="text-lg font-extrabold tracking-wider text-white font-cinematic flex items-center">
                FRAME FEST <span className="text-[#e50914] ml-1">’26</span>
              </div>
            </div>
          </button>

          {/* Center Navigation (Desktop) - Admin section is NOT openly visible here */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide">
            <button
              onClick={() => navigateTo('home')}
              className={`transition-colors hover:text-[#e50914] ${
                currentPage === 'home' ? 'text-[#e50914]' : 'text-neutral-300'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => navigateTo('home', 'about-section')}
              className="text-neutral-300 hover:text-[#e50914] transition-colors"
            >
              ABOUT
            </button>
            <button
              onClick={() => navigateTo('home', 'event-details')}
              className="text-neutral-300 hover:text-[#e50914] transition-colors"
            >
              DETAILS
            </button>
            <button
              onClick={() => navigateTo('register')}
              className={`transition-colors hover:text-[#e50914] ${
                currentPage === 'register' ? 'text-[#e50914]' : 'text-neutral-300'
              }`}
            >
              REGISTER
            </button>
          </nav>

          {/* Right Area: Register Button + Discrete Admin Profile Icon */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Desktop Register Button */}
            <div className="hidden md:block">
              <button
                onClick={() => navigateTo('register')}
                className="px-5 py-2.5 rounded-md bg-[#e50914] text-white text-sm font-bold tracking-wider hover:bg-[#b80710] shadow-[0_0_20px_rgba(229,9,20,0.35)] hover:shadow-[0_0_25px_rgba(229,9,20,0.55)] transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <Clapperboard className="w-4 h-4" />
                <span>REGISTER NOW</span>
              </button>
            </div>

            {/* Admin Profile/User Icon at TOP-RIGHT Corner */}
            <div className="relative" ref={adminMenuRef}>
              <button
                type="button"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                  adminMenuOpen || currentPage === 'admin'
                    ? 'bg-[#1e1e1e] border-[#e50914] text-[#e50914] shadow-[0_0_12px_rgba(229,9,20,0.3)]'
                    : 'bg-[#141414] border-[#2b2b2b] text-neutral-400 hover:text-white hover:border-neutral-500'
                }`}
                title="Organizer Profile"
                aria-label="Admin Profile Menu"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Admin Profile Dropdown Menu */}
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111111] border border-[#262626] shadow-2xl py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-[#202020]">
                    <div className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
                      ORGANIZER CONSOLE
                    </div>
                    <div className="text-xs font-bold text-white font-cinematic mt-0.5">
                      FRAME FEST ’26
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('admin')}
                    className="w-full text-left px-3 py-2.5 text-xs font-bold tracking-wider text-neutral-200 hover:text-white hover:bg-[#1a1a1a] flex items-center space-x-2.5 transition-colors group"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#e50914] group-hover:scale-110 transition-transform" />
                    <span>ADMIN LOGIN</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-[#141414] border border-[#2b2b2b] text-neutral-300 hover:text-white hover:bg-[#1a1a1a] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d0d] border-b border-[#222222] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => navigateTo('home')}
            className={`block w-full text-left px-3 py-2 rounded-md text-base font-semibold ${
              currentPage === 'home' ? 'bg-[#181818] text-[#e50914]' : 'text-neutral-300'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => navigateTo('home', 'about-section')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-neutral-300 hover:bg-[#181818]"
          >
            ABOUT
          </button>
          <button
            onClick={() => navigateTo('home', 'event-details')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-neutral-300 hover:bg-[#181818]"
          >
            EVENT DETAILS
          </button>
          <button
            onClick={() => navigateTo('register')}
            className={`block w-full text-left px-3 py-2 rounded-md text-base font-semibold ${
              currentPage === 'register' ? 'bg-[#181818] text-[#e50914]' : 'text-neutral-300'
            }`}
          >
            REGISTER
          </button>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('register')}
              className="w-full py-3 rounded-md bg-[#e50914] text-white text-center font-bold tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.4)]"
            >
              REGISTER NOW
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
