
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NewsFeedProps {
  onClose?: () => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  // Auto-hide after 5 seconds (default behavior if no onClose provided)
  useEffect(() => {
    if (isVisible && !onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-glee-purple text-white py-1 relative">
      <div className="container flex items-center justify-center text-sm">
        <div className="flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="mx-4">📣 Welcome to the Spelman College Glee Club Digital Hub!</span>
            <span className="mx-4">🎵 Upcoming concert: Spring Showcase on May 15th</span>
            <span className="mx-4">📝 Members: Submit your recordings by Thursday</span>
            <span className="mx-4">🎓 Congratulations to our graduating seniors!</span>
          </div>
        </div>
        <button 
          onClick={handleClose} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close news feed"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
