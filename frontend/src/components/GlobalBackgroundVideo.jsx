import React, { useRef, useEffect } from 'react';

export default function GlobalBackgroundVideo() {
  const videoRef = useRef(null);

  // Compute base-aware browser path: /video/framefest%20video.mp4
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const srcEncoded = `${cleanBase}video/framefest%20video.mp4`;
  const srcRaw = `${cleanBase}video/framefest video.mp4`;
  const srcDash = `${cleanBase}video/framefest-video-2.mp4`;
  const srcSpace2 = `${cleanBase}video/framefest video 2.mp4`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict attributes required by modern mobile browsers (iOS Safari, Android Chrome)
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

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
      if (!video) return;
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Autoplay postponed by mobile browser policy until user gesture
        });
      }
    };

    video.addEventListener('canplay', attemptPlay);
    video.addEventListener('loadeddata', attemptPlay);
    video.addEventListener('loadedmetadata', attemptPlay);
    
    // Initial load and play attempt
    try {
      video.load();
    } catch (_) {}
    attemptPlay();

    // Mobile gesture listeners: ANY user touch, tap, swipe or scroll on mobile triggers playback
    const handleUserGesture = () => {
      if (video && video.paused && !mediaQuery.matches) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleUserGesture, { passive: true });
    window.addEventListener('touchend', handleUserGesture, { passive: true });
    window.addEventListener('click', handleUserGesture, { passive: true });
    window.addEventListener('pointerdown', handleUserGesture, { passive: true });
    window.addEventListener('scroll', handleUserGesture, { passive: true });

    return () => {
      video.removeEventListener('canplay', attemptPlay);
      video.removeEventListener('loadeddata', attemptPlay);
      video.removeEventListener('loadedmetadata', attemptPlay);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      }
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('touchend', handleUserGesture);
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('scroll', handleUserGesture);
    };
  }, [srcEncoded]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#050505]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '-webkit-fill-available',
        zIndex: 0
      }}
    >
      {/* 1. FULLSCREEN FIXED VIDEO (Mobile & Desktop Cover) */}
      <video
        ref={videoRef}
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none opacity-100"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <source src={srcEncoded} type="video/mp4" />
        <source src={srcRaw} type="video/mp4" />
        <source src={srcDash} type="video/mp4" />
        <source src={srcSpace2} type="video/mp4" />
      </video>

      {/* 2. DARK CINEMATIC OVERLAY */}
      {/* Semi-transparent dark overlay calibrated for mobile vibrancy and text contrast */}
      <div className="absolute inset-0 w-full h-full bg-black/40 sm:bg-black/50 pointer-events-none"></div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/45 via-black/20 to-black/75 pointer-events-none"></div>
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.6)_100%)] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#e50914]/5 blur-[130px] pointer-events-none"></div>
    </div>
  );
}
