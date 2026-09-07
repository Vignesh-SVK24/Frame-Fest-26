import React, { useEffect, useRef, useState } from 'react';
import { Trophy, Sparkles, Award, Star, Video, ArrowUpRight } from 'lucide-react';

export default function WhyJoinSection({ compact = false }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Small / Compact mode tailored for the Registration Page
  if (compact) {
    return (
      <div
        ref={sectionRef}
        className={`w-full mb-8 transition-all duration-700 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.99]'
        }`}
      >
        <div className="relative rounded-xl bg-gradient-to-r from-[#161619] via-[#101012] to-[#1a1111] border border-[#2b2b2e] hover:border-[#e50914]/50 transition-all duration-300 shadow-xl overflow-hidden film-grain p-4 sm:p-5">
          
          {/* Subtle Viewfinder Brackets */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#e50914]/60 pointer-events-none"></div>
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#e50914]/60 pointer-events-none"></div>
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#e50914]/60 pointer-events-none"></div>
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#e50914]/60 pointer-events-none"></div>

          {/* Red Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#e50914]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Small Golden Trophy Emblem */}
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b from-[#252528] to-[#121214] border border-amber-500/30 text-amber-400 shadow-md">
              <Trophy className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </div>

            {/* Content Details */}
            <div className="flex-1 text-center sm:text-left">
              
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#e50914]/15 border border-[#e50914]/40 text-[#ff4d4d] text-xs font-mono font-bold tracking-wider uppercase">
                  <Award className="w-3.5 h-3.5 text-[#e50914]" />
                  <span>🏆 <span className="text-[#e50914] font-black">TOP 5</span> WINNERS</span>
                </span>
                <span className="text-xs text-neutral-400 font-medium">The top 5 winners will earn a place in:</span>
              </div>

              {/* HICET VIRTUAL VANGUARDS & DIGITAL MEDIA TEAM */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 my-1.5">
                <span className="text-xs font-mono font-bold text-[#e50914] tracking-widest uppercase">HICET</span>
                <span className="text-lg sm:text-xl font-black font-cinematic uppercase tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  VIRTUAL VANGUARDS
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#1c1c1f] border border-[#333336] text-[11px] font-bold tracking-wider text-[#ff4d4d] uppercase">
                  <Sparkles className="w-3 h-3 text-[#e50914]" />
                  OFFICIAL DIGITAL MEDIA TEAM
                </span>
              </div>

              {/* Brief Explanation Quote */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2 border-l-2 border-[#e50914] pl-3 py-0.5 bg-[#141416]/50 rounded-r">
                “Show your creativity, compete with your editing skills, and stand a chance to become part of the official <span className="text-white font-medium">HICET Virtual Vanguards</span> digital media team.”
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // Full Cinematic Section Mode (Used directly below Hero CTA buttons)
  return (
    <div
      id="why-join"
      ref={sectionRef}
      className={`max-w-4xl mx-auto w-full mb-12 sm:mb-16 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
      }`}
    >
      <div className="relative rounded-2xl bg-gradient-to-b from-[#161618] via-[#0f0f10] to-[#0a0a0b] border border-[#2b2b2b] hover:border-[#e50914]/50 transition-all duration-500 shadow-[0_0_50px_rgba(229,9,20,0.18)] hover:shadow-[0_0_70px_rgba(229,9,20,0.3)] overflow-hidden film-grain">
        
        {/* Cinematic Viewfinder Brackets */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#e50914]/60 pointer-events-none"></div>
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#e50914]/60 pointer-events-none"></div>
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#e50914]/60 pointer-events-none"></div>
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#e50914]/60 pointer-events-none"></div>

        {/* Subtle Ambient Red Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#e50914]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#e50914]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Slate Strip */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-[#222224] bg-[#121214]/90 backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e50914]"></span>
            </span>
            <h2 className="text-xs sm:text-sm font-cinematic font-extrabold tracking-[0.2em] text-white uppercase drop-shadow-sm">
              Why Join Frame Fest ’26?
            </h2>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-neutral-400 tracking-wider">
            <span className="text-[#e50914] font-bold">[ INDUCTION OPPORTUNITY ]</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 lg:p-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            
            {/* Left: Trophy / Winner Visual Emblem */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative group">
                {/* Glowing Outer Aura */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-[#e50914]/30 to-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                {/* Circular Award Crest */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#242426] via-[#141416] to-[#0b0b0c] border-2 border-amber-500/40 flex items-center justify-center shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]">
                  {/* Decorative Laurel Wreath Behind Trophy */}
                  <svg
                    className="absolute w-20 h-20 sm:w-24 sm:h-24 text-amber-400/20 pointer-events-none"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <path d="M 20,50 C 20,30 35,15 50,15 C 65,15 80,30 80,50 C 80,70 65,85 50,85 C 35,85 20,70 20,50 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
                    <circle cx="28" cy="35" r="3" />
                    <circle cx="24" cy="50" r="3.5" />
                    <circle cx="28" cy="65" r="3" />
                    <circle cx="72" cy="35" r="3" />
                    <circle cx="76" cy="50" r="3.5" />
                    <circle cx="72" cy="65" r="3" />
                  </svg>

                  {/* Golden Trophy */}
                  <Trophy className="w-11 h-11 sm:w-13 sm:h-13 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Mini Badge Below Trophy */}
              <div className="mt-3.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1c1c1e] border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold tracking-wider uppercase shadow-inner">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>ELITE RECOGNITION</span>
              </div>
            </div>

            {/* Right: Detailed Typography & Messaging */}
            <div className="flex-1 text-center md:text-left">
              
              {/* Top 5 Announcement */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#e50914]/15 border border-[#e50914]/40 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider mb-2.5">
                <Award className="w-4 h-4 text-[#e50914]" />
                <span>
                  🏆 <span className="text-[#e50914] font-black text-sm sm:text-base">TOP 5</span> WINNERS
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-neutral-300 tracking-wide uppercase">
                The top 5 winners will earn a place in:
              </h3>

              {/* Prominent VIRTUAL VANGUARDS Branding */}
              <div className="mt-2 mb-3">
                <span className="block text-xs sm:text-sm font-mono font-extrabold tracking-[0.3em] text-[#e50914] uppercase">
                  HICET
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-black font-cinematic uppercase tracking-tight text-white leading-none mt-1 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:text-neutral-100 transition-colors">
                  VIRTUAL VANGUARDS
                </span>
              </div>

              {/* Sub-label Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1a1a1c] border border-[#333336] text-[#ff4d4d] text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#e50914]" />
                <span>OFFICIAL DIGITAL MEDIA TEAM</span>
              </div>

              {/* Explanation Quote Block */}
              <div className="relative pl-4 sm:pl-5 border-l-2 border-[#e50914] bg-[#141416]/70 py-3 pr-4 rounded-r-xl my-2">
                <p className="text-neutral-300 text-sm sm:text-base font-normal leading-relaxed">
                  “Show your creativity, compete with your editing skills, and stand a chance to become part of the official <span className="text-white font-semibold">HICET Virtual Vanguards</span> digital media team.”
                </p>
              </div>

              {/* Perks / Benefits Micro-Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-[#202024]">
                <div className="flex items-center space-x-2 text-xs text-neutral-300 bg-[#121214] px-3 py-2 rounded-lg border border-[#26262a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e50914]"></span>
                  <span className="font-semibold">Official Projects</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-300 bg-[#121214] px-3 py-2 rounded-lg border border-[#26262a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e50914]"></span>
                  <span className="font-semibold">Creative Leadership</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-300 bg-[#121214] px-3 py-2 rounded-lg border border-[#26262a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e50914]"></span>
                  <span className="font-semibold">Campus-wide Reach</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
