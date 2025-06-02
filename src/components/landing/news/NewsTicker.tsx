
import React, { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  headline: string;
  active: boolean;
  content: string;
  date: string;
}

interface NewsTickerProps {
  autoHide?: boolean;
  hideAfter?: number;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Simple predefined news items with content
  const newsItems: NewsItem[] = [
    {
      id: "1",
      headline: "🎵 Spelman College Glee Club announces Spring Concert series",
      active: true,
      content: "The Spelman College Glee Club is proud to announce our Spring Concert series, featuring performances across Atlanta throughout April and May. Join us for a celebration of choral excellence as we showcase a diverse repertoire of classical, spiritual, and contemporary works.",
      date: "May 1, 2025"
    },
    {
      id: "2", 
      headline: "🏛️ HBCU Choir Festival featuring top collegiate ensembles",
      active: true,
      content: "Spelman College Glee Club will be participating in the annual HBCU Choir Festival this June, joining forces with top collegiate ensembles from across the country. This collaborative event showcases the rich choral traditions of Historically Black Colleges and Universities, highlighting our shared musical heritage and contemporary innovations.",
      date: "May 5, 2025"
    },
    {
      id: "3",
      headline: "🎓 New scholarship opportunities available for music students",
      active: true,
      content: "We're pleased to announce several new scholarship opportunities for exceptional music students at Spelman College. These scholarships aim to support talented vocalists pursuing excellence in choral music and solo performance. Applications are now open for the 2025-2026 academic year.",
      date: "May 8, 2025"
    },
    {
      id: "4",
      headline: "📰 Glee Club wins national recognition for excellence in choral music",
      active: true,
      content: "The Spelman College Glee Club has received national recognition for excellence in choral music at the Collegiate Choral Competition held last month. Our ensemble was praised for outstanding musicianship, innovative programming, and cultural authenticity in performance.",
      date: "May 12, 2025"
    }
  ];

  // Cycle through news items faster (3 seconds instead of 4)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [newsItems.length]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && hideAfter) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideAfter);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideAfter]);

  if (!isVisible) {
    return null;
  }

  const currentItem = newsItems[currentIndex];

  const handleNewsClick = () => {
    // Open the news article page
    window.location.href = `/news/${currentItem.id}`;
  };

  return (
    <div className="bg-glee-columbia text-white py-2 relative w-full overflow-hidden">
      <div className="w-full px-4 flex items-center justify-center text-sm font-medium">
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          <div 
            className="whitespace-nowrap animate-marquee-fast"
            onClick={handleNewsClick}
          >
            <span 
              className="cursor-pointer hover:text-yellow-200 transition-colors text-white drop-shadow-sm"
              title="Click to read more"
            >
              {currentItem.headline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
