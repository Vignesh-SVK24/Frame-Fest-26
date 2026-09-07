import React from 'react';
import { Film, Heart } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function Footer({ onNavigateAdmin }) {
  return (
    <footer className="bg-[#050505] border-t border-[#1c1c1c] py-12 text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        {/* Film logo & title */}
        <div className="flex items-center justify-center space-x-2">
          <Film className="w-5 h-5 text-[#e50914]" />
          <span className="text-xl font-black font-cinematic text-white tracking-wider">
            {EVENT_CONFIG.titlePrefix} <span className="text-[#e50914]">{EVENT_CONFIG.titleYear}</span>
          </span>
        </div>

        {/* Subtitle */}
        <div className="text-xs sm:text-sm font-bold tracking-[0.2em] text-neutral-300 uppercase">
          {EVENT_CONFIG.subtitle}
        </div>

        {/* Organizer details */}
        <div className="text-xs sm:text-sm text-neutral-400 space-y-1">
          <p>{EVENT_CONFIG.department}</p>
          <p className="font-semibold text-neutral-300">{EVENT_CONFIG.college}</p>
          <p className="text-[#e50914] font-medium pt-1">Event Date: {EVENT_CONFIG.date}</p>
        </div>

        {/* Copyright & subtle admin link */}
        <div className="pt-6 border-t border-[#171717] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <div>
            © 2026 {EVENT_CONFIG.name}. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>Designed for Filmmakers & Editors</span>
            {/* Subtle private admin entry */}
            <button
              onClick={onNavigateAdmin}
              className="text-neutral-600 hover:text-neutral-400 transition-colors text-[11px]"
              title="Admin Portal"
            >
              Organizer Access
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
