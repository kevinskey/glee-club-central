
import React from 'react';
import LandingPage from './LandingPage';

export default function HomePage() {
  // This component now just ensures we use the public landing page
  // and not any form of dashboard for non-authenticated users
  return <LandingPage />;
}
