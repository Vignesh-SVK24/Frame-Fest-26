import React, { useRef, useEffect, useState } from 'react';

export default function GlobalBackgroundVideo() {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Compute base-aware browser path: /video/framefest%20video.mp4
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const videoSrc = `${cleanBase}video/framefest%20video.mp4`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict attributes required by modern mobile and desktop browsers
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      video.pause();
      return;
    }

    const handleReducedMotionChange = (e) => {
      if (e.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleReducedMotionChange);
    }

    const attemptPlay = () => {
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsVideoLoaded(true))
          .catch(() => {
            // Autoplay restricted by browser policy before user interaction
            setIsVideoLoaded(false);
          });
      }
    };

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      attemptPlay();
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', attemptPlay);
    video.addEventListener('error', handleError);

    // Initial play attempt
    attemptPlay();

    // Fallback: Start playback on first user gesture if browser blocked unprompted autoplay
    const handleFirstUserInteraction = () => {
      if (video.paused && !mediaQuery.matches) {
        attemptPlay();
      }
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstUserInteraction, { once: true, passive: true });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', attemptPlay);
      video.removeEventListener('error', handleError);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      }
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('scroll', handleFirstUserInteraction);
    };
  }, [videoSrc]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full min-h-[100dvh] overflow-hidden pointer-events-none z-[-10] bg-[#050505]"
    >
      {/* 1. FULLSCREEN FIXED VIDEO (Layer z-[-2]) */}
      {!hasError && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          className={`absolute top-0 left-0 w-full h-full min-h-[100dvh] object-cover object-center transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* 2. DARK CINEMATIC OVERLAY (Layer z-[-1]) */}
      {/* Translucent black layer around 48% with subtle cinematic gradient and red vignette */}
      <div className="absolute inset-0 w-full h-full bg-black/50 pointer-events-none"></div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/45 via-black/20 to-black/75 pointer-events-none"></div>
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.65)_100%)] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#e50914]/5 blur-[130px] pointer-events-none"></div>
    </div>
  );
}
