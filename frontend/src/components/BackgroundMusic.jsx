import React, { useEffect, useRef } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Safe encoded URLs for cross-browser & mobile compatibility
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const audioSrcClean = `${cleanBase}audio/frame-fest-music.mp3`;
  const audioSrcLegacy = encodeURI(`${cleanBase}audio/frame fest music.mp3.mpeg`);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Purge any stored mute/disable flags so music is always unmuted
    try {
      localStorage.removeItem('frameFestMusicMuted');
      localStorage.removeItem('frameFestMusicEnabled');
    } catch (_) {}

    // Audio always unmuted at standard pleasant background volume
    audio.muted = false;
    audio.volume = 0.3;
    audio.loop = true;

    // Trigger playback function
    const startAudio = () => {
      if (!audioRef.current || hasStartedRef.current) return;
      audioRef.current.muted = false;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
            removeGestureListeners();
          })
          .catch(() => {
            // Browser autoplay policy restricts unmuted audio prior to user gesture
          });
      }
    };

    // User gesture handler (starts audio on first touch, click, key, or scroll)
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
      startAudio();
    };

    const addGestureListeners = () => {
      interactionEvents.forEach((ev) => {
        window.addEventListener(ev, handleUserGesture, { passive: true });
        document.addEventListener(ev, handleUserGesture, { passive: true });
      });
    };

    const removeGestureListeners = () => {
      interactionEvents.forEach((ev) => {
        window.removeEventListener(ev, handleUserGesture);
        document.removeEventListener(ev, handleUserGesture);
      });
    };

    // 1. Attempt immediate autoplay on mount
    startAudio();

    // 2. Always bind interaction listeners as guarantee across all mobile & desktop browsers
    addGestureListeners();

    // 3. Resume when tab becomes active / visible
    const handleVisibilityChange = () => {
      if (!document.hidden && audioRef.current && !hasStartedRef.current) {
        startAudio();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      removeGestureListeners();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      autoPlay
      playsInline
      preload="auto"
      aria-hidden="true"
      style={{ display: 'none' }}
    >
      <source src={audioSrcClean} type="audio/mp3" />
      <source src={audioSrcClean} type="audio/mpeg" />
      <source src={audioSrcLegacy} type="audio/mpeg" />
    </audio>
  );
}
