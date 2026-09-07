import React from 'react';
import { Camera, Film, Trophy, Clapperboard, Sparkles } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function EventInfo() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'camera':
        return <Camera className="w-7 h-7 text-[#e50914]" />;
      case 'film':
        return <Film className="w-7 h-7 text-[#e50914]" />;
      case 'trophy':
        return <Trophy className="w-7 h-7 text-[#e50914]" />;
      case 'clapperboard':
      default:
        return <Clapperboard className="w-7 h-7 text-[#e50914]" />;
    }
  };

  return (
    <section id="about-section" className="py-20 bg-[#0c0c0c] border-t border-b border-[#1f1f1f] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-bold tracking-[0.2em] text-[#e50914] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER THE EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-cinematic text-white uppercase tracking-tight mb-4">
            ABOUT {EVENT_CONFIG.titlePrefix} <span className="text-[#e50914]">{EVENT_CONFIG.titleYear}</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed">
            “{EVENT_CONFIG.aboutDescription}”
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENT_CONFIG.cards.map((card, idx) => (
            <div
              key={card.id}
              className="group relative bg-[#141414] border border-[#242424] hover:border-[#e50914]/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[0_10px_30px_rgba(229,9,20,0.15)] flex flex-col justify-between"
            >
              {/* Card Number Watermark */}
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-400 opacity-40 group-hover:opacity-100 group-hover:text-[#e50914] transition-all">
                0{idx + 1}
              </div>

              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] group-hover:border-[#e50914] group-hover:bg-[#e50914]/10 transition-all flex items-center justify-center mb-6">
                  {getIcon(card.icon)}
                </div>

                {/* Card Title */}
                <h3 className="text-xl font-black font-cinematic tracking-wider text-white uppercase mb-2 group-hover:text-[#e50914] transition-colors">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom decorative accent */}
              <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono uppercase tracking-widest text-[11px]">Frame ’26</span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 group-hover:bg-[#e50914] transition-colors"></span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
