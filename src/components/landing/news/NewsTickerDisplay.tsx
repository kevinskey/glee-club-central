
import React from 'react';
import { NewsItem } from '@/services/newsService';
import { useIsMobile } from '@/hooks/use-mobile';

interface NewsTickerDisplayProps {
  newsItems: NewsItem[];
  newsSource: 'database' | 'google' | 'mixed';
  onNewsClick: (item: NewsItem) => void;
}

export function NewsTickerDisplay({ newsItems, newsSource, onNewsClick }: NewsTickerDisplayProps) {
  const isMobile = useIsMobile();

  const removeIconsFromHeadline = (headline: string) => {
    return headline.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '').trim();
  };

  const createTickerContent = () => {
    if (newsItems.length === 0) return '';
    
    // Limit to maximum 5 items and clean headlines
    const limitedItems = newsItems.slice(0, 5);
    const cleanHeadlines = limitedItems.map(item => removeIconsFromHeadline(item.headline));
    const separator = '   •   ';
    
    // Create a single pass of headlines
    const singlePass = cleanHeadlines.join(separator);
    
    // Repeat only 3 times instead of 6 to reduce content
    return Array(3).fill(singlePass).join(separator);
  };

  const tickerContent = createTickerContent();

  return (
    <div className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia text-white py-3 w-full overflow-hidden border-b border-white/10">
      <div className="w-full px-4 flex items-center justify-between">
        <div className="hidden sm:flex items-center text-red-200 font-bold text-xs mr-4 whitespace-nowrap">
          <div className="w-2 h-2 bg-red-300 rounded-full mr-2 animate-pulse"></div>
          {newsSource === 'google' ? 'LIVE NEWS' : newsSource === 'database' ? 'LATEST NEWS' : 'NEWS'}
        </div>
        
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          <div className="whitespace-nowrap animate-marquee-20s">
            <span 
              className="cursor-pointer hover:text-red-200 transition-colors text-white drop-shadow-sm font-semibold text-xs tracking-wide"
              title="Click to read more"
              onClick={() => newsItems.length > 0 && onNewsClick(newsItems[0])}
            >
              {tickerContent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
