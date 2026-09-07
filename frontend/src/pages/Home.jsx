import React from 'react';
import Hero from '../components/Hero';
import EventInfo from '../components/EventInfo';
import EventDetails from '../components/EventDetails';

export default function Home({ onNavigateRegister }) {
  const handleExploreClick = () => {
    const el = document.getElementById('about-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Hero
        onRegisterClick={onNavigateRegister}
        onExploreClick={handleExploreClick}
      />
      <EventInfo />
      <EventDetails />
    </div>
  );
}
