import React from 'react';
import { Clapperboard, Calendar, ChevronDown, Video as VideoIcon, Sliders, Film } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import WhyJoinSection from './WhyJoinSection';

export default function Hero({ onRegisterClick, onExploreClick }) {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-transparent py-16 lg:py-24">
      {/* Decorative Film Strip Borders (Left and Right) */}
      <div className="hidden lg:block absolute left-4 top-0 bottom-0 w-8 film-strip-vertical opacity-20 border-r border-[#222] z-[2] pointer-events-none"></div>
      <div className="hidden lg:block absolute right-4 top-0 bottom-0 w-8 film-strip-vertical opacity-20 border-l border-[#222] z-[2] pointer-events-none"></div>

      {/* Hero Content Layer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#161226]/80 backdrop-blur-md border border-[#2f224f] mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-300">
            {EVENT_CONFIG.department}
          </span>
        </div>

        {/* Main Cinematic Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-cinematic tracking-tight text-white uppercase leading-none drop-shadow-2xl mb-3 sm:mb-4">
          <span>{EVENT_CONFIG.titlePrefix}</span>{' '}
          <span className="text-[#a855f7] inline-block hover:scale-105 transition-transform drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]">
            {EVENT_CONFIG.titleYear}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-2xl md:text-3xl font-bold tracking-[0.15em] sm:tracking-[0.25em] text-neutral-200 uppercase mb-3 drop-shadow-md">
          {EVENT_CONFIG.subtitle}
        </p>

        {/* Tagline */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-5 sm:mb-6">
          <div className="h-px w-6 sm:w-16 bg-gradient-to-r from-transparent to-[#8b5cf6]"></div>
          <p className="text-xs sm:text-base font-extrabold tracking-[0.15em] sm:tracking-[0.2em] text-[#c084fc] uppercase drop-shadow-sm">
            {EVENT_CONFIG.tagline}
          </p>
          <div className="h-px w-6 sm:w-16 bg-gradient-to-l from-transparent to-[#8b5cf6]"></div>
        </div>

        {/* Event Date Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#141024]/80 backdrop-blur-md border border-[#312554] mb-5 sm:mb-6 text-white font-bold tracking-wider sm:tracking-widest uppercase text-xs sm:text-base shadow-inner">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c084fc]" />
          <span>{EVENT_CONFIG.date}</span>
        </div>

        {/* Short Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mb-10 drop-shadow">
          “{EVENT_CONFIG.description}”
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-14">
          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#8b5cf6] text-white font-extrabold tracking-wider uppercase text-base hover:bg-[#7c3aed] shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
          >
            <Clapperboard className="w-5 h-5" />
            <span>REGISTER NOW</span>
          </button>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#141414]/85 backdrop-blur-md border border-[#2e2e2e] text-neutral-200 font-bold tracking-wider uppercase text-base hover:bg-[#1f1f1f] hover:text-white hover:border-[#444] transition-all flex items-center justify-center space-x-2"
          >
            <span>EXPLORE EVENT</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Why Join Frame Fest '26? Section */}
        <WhyJoinSection />

        {/* Cinematic Timeline Decorative Strip */}
        <div className="max-w-3xl mx-auto border border-[#2c224b] bg-[#120e22]/85 rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono tracking-widest mb-3 border-b border-[#251c3d] pb-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>TIMELINE 00:00:18:26</span>
            </span>
            <span className="text-[#c084fc] font-bold">CINEMATIC 4K 24FPS</span>
            <span>HICET CAMPUS</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded bg-[#17122a]/90 border border-[#2f2352] hover:border-[#8b5cf6]/50 transition-colors">
              <VideoIcon className="w-4 h-4 text-[#c084fc] mx-auto mb-1" />
              <div className="text-xs font-bold text-white uppercase">Short Film</div>
              <div className="text-[10px] text-neutral-400">Cinematography</div>
            </div>
            <div className="p-2.5 rounded bg-[#17122a]/90 border border-[#2f2352] hover:border-[#8b5cf6]/50 transition-colors">
              <Sliders className="w-4 h-4 text-[#c084fc] mx-auto mb-1" />
              <div className="text-xs font-bold text-white uppercase">Video Editing</div>
              <div className="text-[10px] text-neutral-400">VFX & Grading</div>
            </div>
            <div className="p-2.5 rounded bg-[#17122a]/90 border border-[#2f2352] hover:border-[#8b5cf6]/50 transition-colors">
              <Film className="w-4 h-4 text-[#c084fc] mx-auto mb-1" />
              <div className="text-xs font-bold text-white uppercase">Poster & Reels</div>
              <div className="text-[10px] text-neutral-400">Visual Impact</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
