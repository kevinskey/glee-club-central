
import React, { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  headline: string;
  active: boolean;
}

interface NewsTickerProps {
  onClose?: () => void;
  autoHide?: boolean;
  hideAfter?: number;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  onClose, 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Simple predefined news items
  const newsItems: NewsItem[] = [
    {
      id: "1",
      headline: "🎵 Spelman College Glee Club announces Spring Concert series",
      active: true
    },
    {
      id: "2", 
      headline: "🏛️ HBCU Choir Festival featuring top collegiate ensembles",
      active: true
    },
    {
      id: "3",
      headline: "🎓 New scholarship opportunities available for music students",
      active: true
    },
    {
      id: "4",
      headline: "📰 Glee Club wins national recognition for excellence in choral music",
      active: true
    }
  ];

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && hideAfter) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, hideAfter);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideAfter, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-glee-columbia text-white py-2 relative w-full overflow-hidden">
      <div className="w-full px-4 flex items-center justify-center text-sm font-medium">
        <div className="flex-1 overflow-hidden flex items-center">
          <div className="flex whitespace-nowrap animate-marquee-slower">
            {newsItems.map((item, index) => (
              <span 
                key={item.id} 
                className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors text-white drop-shadow-sm"
                title="Latest news from Spelman Glee Club"
              >
                {item.headline}
              </span>
            ))}
            
            {/* Repeat items to create continuous scroll effect */}
            {newsItems.map((item, index) => (
              <span 
                key={`repeat-${item.id}`} 
                className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors text-white drop-shadow-sm"
                title="Latest news from Spelman Glee Club"
              >
                {item.headline}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Close button if onClose is provided */}
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-200 transition-colors"
          aria-label="Close news ticker"
        >
          ×
        </button>
      )}
    </div>
  );
};
