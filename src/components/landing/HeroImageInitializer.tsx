
import React from 'react';

interface HeroImageInitializerProps {
  onInitialized?: () => void;
}

// This component is simplified to prevent initialization loops
export const HeroImageInitializer: React.FC<HeroImageInitializerProps> = ({ onInitialized }) => {
  // Simply call onInitialized immediately if provided
  React.useEffect(() => {
    if (onInitialized) {
      onInitialized();
    }
  }, [onInitialized]);
  
  // This component doesn't render anything
  return null;
};
