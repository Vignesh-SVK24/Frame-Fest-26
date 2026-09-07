import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic({ isHome = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Safe encoded URL for filename with spaces and double extension
  const audioSrc = encodeURI('/audio/frame fest music.mp3.mpeg');

  // Initialize and check user preference
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set standard volume to 25%
    audio.volume = 0.25;
    audio.loop = true;

    // Event listeners
    const handleCanPlay = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      // Graceful fallback: audio error never breaks the site
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Check stored user preference
    try {
      const savedPref = localStorage.getItem('frameFestMusicEnabled');
      if (savedPref === 'true') {
        // Attempt playback if browser policy allows
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay blocked by browser policy without user gesture - keep OFF gracefully
            setIsPlaying(false);
          });
        }
      }
    } catch (_) {}

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Toggle playback
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      try {
        localStorage.setItem('frameFestMusicEnabled', 'false');
      } catch (_) {}
    } else {
      audio.volume = 0.25;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            try {
              localStorage.setItem('frameFestMusicEnabled', 'true');
            } catch (_) {}
          })
          .catch((err) => {
            console.warn('Audio playback not permitted or failed:', err?.message || err);
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <>
      {/* Single Native HTML5 Audio Element for the entire application */}
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        aria-hidden="true"
      >
        <source src={audioSrc} type="audio/mpeg" />
        <source src={audioSrc} type="audio/mp3" />
      </audio>

      {/* Floating Music Control Button */}
      <aside
        aria-label="Background audio control"
        className={`fixed z-40 transition-all duration-300 ${
          isHome
            ? 'bottom-20 right-4 sm:bottom-6 sm:right-6'
            : 'bottom-5 right-5 sm:bottom-6 sm:right-6'
        }`}
      >
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Pause music' : 'Turn on music'}
          title={isPlaying ? 'Pause music' : 'Turn on music'}
          className={`group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50914] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
            isPlaying
              ? 'bg-[#121212]/95 border border-[#e50914] shadow-[0_0_20px_rgba(229,9,20,0.45)] hover:shadow-[0_0_25px_rgba(229,9,20,0.65)] hover:scale-105'
              : 'bg-[#101010]/90 border border-[#2b2b2b] hover:border-[#e50914]/60 hover:bg-[#181818] hover:scale-105 shadow-lg'
          }`}
        >
          {/* Subtle ambient active pulse ring (respects prefers-reduced-motion) */}
          {isPlaying && (
            <span
              className="absolute inset-0 rounded-full border border-[#e50914]/40 motion-safe:animate-ping pointer-events-none opacity-40"
              aria-hidden="true"
            />
          )}

          {/* Music Icon */}
          <div className="relative z-10 flex items-center justify-center">
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
            )}
          </div>

          {/* Tiny Red Status Indicator Dot */}
          <span
            className={`absolute top-1 right-1 w-2 h-2 rounded-full border border-black transition-colors ${
              isPlaying ? 'bg-[#e50914]' : 'bg-neutral-600'
            }`}
            aria-hidden="true"
          />

          {/* Accessible Tooltip */}
          <span
            role="tooltip"
            className="absolute right-full mr-3 px-2.5 py-1 rounded-md bg-[#161616] border border-[#2e2e2e] text-[11px] font-semibold text-neutral-200 uppercase tracking-wider whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shadow-xl"
          >
            {isPlaying ? 'Pause music' : 'Turn on music'}
          </span>
        </button>
      </aside>
    </>
  );
}
