
import React, { useState, useEffect } from 'react';

export function ViewportDebugger() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    updateWindowWidth();

    // Add event listener
    window.addEventListener('resize', updateWindowWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  return (
    <div className="fixed bottom-0 right-0 bg-black text-white text-xs p-1 z-50 font-mono">
      {windowWidth}px
    </div>
  );
}
