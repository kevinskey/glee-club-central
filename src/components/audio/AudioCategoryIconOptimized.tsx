
import React from 'react';
import { Music, Mic, Radio, BookOpen } from 'lucide-react';

export type AudioCategory = 'music' | 'voice' | 'radio' | 'book' | string;

interface AudioCategoryIconProps {
  category: AudioCategory;
  size?: number;
  className?: string;
}

// Lightweight version that uses Lucide React instead of Canvas
const AudioCategoryIconOptimized: React.FC<AudioCategoryIconProps> = ({ 
  category, 
  size = 24, 
  className = "" 
}) => {
  // Simple switch case for icon selection
  const renderIcon = () => {
    switch (category) {
      case 'music':
        return <Music size={size} className={className} />;
      case 'voice':
        return <Mic size={size} className={className} />;
      case 'radio':
        return <Radio size={size} className={className} />;
      case 'book':
        return <BookOpen size={size} className={className} />;
      default:
        return <Music size={size} className={className} />;
    }
  };

  return renderIcon();
};

export default AudioCategoryIconOptimized;
