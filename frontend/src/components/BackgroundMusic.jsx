import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic({ isHome = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const hasStartedRef = useRef(false);

  // Safe encoded URLs for cross-browser & mobile compatibility
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const audioSrcClean = `${cleanBase}audio/frame-fest-music.mp3`;
  const audioSrcLegacy = encodeURI(`${cleanBase}audio/frame fest music.mp3.mpeg`);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Remove legacy flag from previous versions that prevented auto-play
    try {
      localStorage.removeItem('frameFestMusicEnabled');
    } catch (_) {}

    // Set standard background volume to 25%
    audio.volume = 0.25;
    audio.loop = true;

    // Check if user explicitly muted in the current version
    let userExplicitlyMuted = false;
    try {
      userExplicitlyMuted = localStorage.getItem('frameFestMusicMuted') === 'true';
    } catch (_) {}

    setIsMuted(userExplicitlyMuted);

    // Audio lifecycle listeners
    const handlePlay = () => {
      setIsPlaying(true);
      setIsMuted(false);
      hasStartedRef.current = true;
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handleError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // User gesture handler for browsers with strict unmuted autoplay policies
    const interactionEvents = [
      'click',
      'touchstart',
      'touchend',
      'pointerdown',
      'mousedown',
      'keydown',
      'scroll'
    ];

    const handleUserGesture = () => {
      if (hasStartedRef.current) return;
      let checkMuted = false;
      try {
        checkMuted = localStorage.getItem('frameFestMusicMuted') === 'true';
      } catch (_) {}

      if (!checkMuted && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            hasStartedRef.current = true;
            removeGestureListeners();
          })
          .catch(() => {});
      }
    };

    const addGestureListeners = () => {
      interactionEvents.forEach((ev) => {
        window.addEventListener(ev, handleUserGesture, { once: true, passive: true });
        document.addEventListener(ev, handleUserGesture, { once: true, passive: true });
      });
    };

    const removeGestureListeners = () => {
      interactionEvents.forEach((ev) => {
        window.removeEventListener(ev, handleUserGesture);
        document.removeEventListener(ev, handleUserGesture);
      });
    };

    // ON BY DEFAULT: attempt immediate playback unless explicitly muted
    if (!userExplicitlyMuted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
          })
          .catch(() => {
            // Autoplay blocked by browser policy prior to user gesture; listen for first interaction
            addGestureListeners();
          });
      } else {
        addGestureListeners();
      }
    }

    return () => {
      removeGestureListeners();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Toggle Mute / Unmute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Mute (pause audio)
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
      hasStartedRef.current = true;
      try {
        localStorage.setItem('frameFestMusicMuted', 'true');
      } catch (_) {}
    } else {
      // Unmute (play audio)
      audio.volume = 0.25;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);
            hasStartedRef.current = true;
            try {
              localStorage.setItem('frameFestMusicMuted', 'false');
            } catch (_) {}
          })
          .catch((err) => {
            console.warn('Audio playback error:', err?.message || err);
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
        preload="auto"
        aria-hidden="true"
      >
        <source src={audioSrcClean} type="audio/mp3" />
        <source src={audioSrcClean} type="audio/mpeg" />
        <source src={audioSrcLegacy} type="audio/mpeg" />
      </audio>

      {/* Floating Music Control Button */}
      <aside
        aria-label="Background music control"
        className={`fixed z-40 transition-all duration-300 ${
          isHome
            ? 'bottom-20 right-4 sm:bottom-6 sm:right-6'
            : 'bottom-5 right-5 sm:bottom-6 sm:right-6'
        }`}
      >
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isPlaying ? 'Mute music' : 'Unmute music'}
          title={isPlaying ? 'Mute music' : 'Unmute music'}
          className={`group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
            isPlaying
              ? 'bg-[#151028]/95 border border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] hover:scale-105'
              : 'bg-[#100d1e]/90 border border-[#2c224b] hover:border-[#8b5cf6]/60 hover:bg-[#1a1433] hover:scale-105 shadow-lg'
          }`}
        >
          {/* Subtle ambient active pulse ring */}
          {isPlaying && (
            <span
              className="absolute inset-0 rounded-full border border-[#8b5cf6]/40 motion-safe:animate-ping pointer-events-none opacity-40"
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

          {/* Tiny Violet Status Indicator Dot */}
          <span
            className={`absolute top-1 right-1 w-2 h-2 rounded-full border border-black transition-colors ${
              isPlaying ? 'bg-[#8b5cf6]' : 'bg-neutral-600'
            }`}
            aria-hidden="true"
          />

          {/* Accessible Tooltip */}
          <span
            role="tooltip"
            className="absolute right-full mr-3 px-2.5 py-1 rounded-md bg-[#161616] border border-[#2e2e2e] text-[11px] font-semibold text-neutral-200 uppercase tracking-wider whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shadow-xl"
          >
            {isPlaying ? 'Mute music' : 'Unmute music'}
          </span>
        </button>
      </aside>
    </>
  );
}
