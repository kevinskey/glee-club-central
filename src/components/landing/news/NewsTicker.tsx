
import React, { useState, useEffect } from "react";
import { useNewsData } from "@/hooks/useNewsData";
import { NewsTickerDisplay } from "./NewsTickerDisplay";
import { NewsTickerLoading } from "./NewsTickerLoading";
import { useIsMobile } from "@/hooks/use-mobile";
import type { NewsItem } from "@/services/newsService";

interface NewsTickerProps {
  autoHide?: boolean;
  hideAfter?: number;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { newsItems, isLoading, newsSource } = useNewsData();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (autoHide && hideAfter) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideAfter);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideAfter]);

  const handleNewsClick = (item: NewsItem) => {
    const url = item.link || `/news/${item.id}`;
    
    if (isMobile) {
      const width = Math.min(window.screen.width * 0.9, 400);
      const height = Math.min(window.screen.height * 0.8, 600);
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      window.open(
        url, 
        '_blank', 
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,noopener,noreferrer`
      );
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isVisible) {
    return null;
  }

  if (isLoading) {
    return <NewsTickerLoading />;
  }

  return (
    <NewsTickerDisplay 
      newsItems={newsItems}
      newsSource={newsSource}
      onNewsClick={handleNewsClick}
    />
  );
};

export { NewsItem };
