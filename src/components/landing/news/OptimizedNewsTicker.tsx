
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NewsService } from "@/services/newsService";
import type { NewsItem } from "@/services/newsService";
import { useIsMobile } from "@/hooks/use-mobile";

interface NewsTickerProps {
  autoHide?: boolean;
  hideAfter?: number;
}

export const OptimizedNewsTicker: React.FC<NewsTickerProps> = ({ 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [randomOffset, setRandomOffset] = useState(0);
  const isMobile = useIsMobile();

  // Memoize news content creation to prevent unnecessary re-renders
  const tickerContent = useMemo(() => {
    if (newsItems.length === 0) return '';
    
    const cleanHeadlines = newsItems.map(item => 
      item.headline.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '').trim()
    );
    
    const separator = '   •   ';
    const rotatedHeadlines = [
      ...cleanHeadlines.slice(randomOffset),
      ...cleanHeadlines.slice(0, randomOffset)
    ];
    
    const singlePass = rotatedHeadlines.join(separator);
    return Array(3).fill(singlePass).join(separator); // Reduced from 6 to 3 for better performance
  }, [newsItems, randomOffset]);

  // Optimize news fetching with useCallback
  const fetchNewsItems = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: dbNews, error } = await supabase
        .from('news_items')
        .select('id, headline, content, start_date, end_date, active, generated_by_ai')
        .eq('active', true)
        .order('priority', { ascending: false })
        .limit(8); // Reduced limit for better performance

      let finalNewsItems: NewsItem[] = [];

      if (!error && dbNews && dbNews.length >= 5) {
        finalNewsItems = dbNews.map(item => ({
          id: item.id,
          headline: item.headline,
          active: item.active,
          content: item.content || '',
          date: item.start_date,
          generated_by_ai: item.generated_by_ai
        }));
      } else {
        console.log('Fetching fresh news from Google News...');
        const googleNews = await NewsService.fetchMixedNews(10); // Reduced from 20 to 10
        
        if (googleNews.length > 0) {
          finalNewsItems = googleNews.slice(0, 8); // Limit to 8 items
        } else {
          finalNewsItems = NewsService.getStaticFallbackNews();
        }
      }

      // Shuffle once and set random offset once
      const shuffledItems = finalNewsItems.sort(() => Math.random() - 0.5);
      setNewsItems(shuffledItems);
      setRandomOffset(Math.floor(Math.random() * shuffledItems.length));

    } catch (error) {
      console.error('Error fetching news items:', error);
      setNewsItems(NewsService.getStaticFallbackNews());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch news only once on mount
  useEffect(() => {
    fetchNewsItems();
  }, [fetchNewsItems]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && hideAfter) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideAfter);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideAfter]);

  const handleNewsClick = useCallback((item: NewsItem) => {
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
  }, [isMobile]);

  if (!isVisible) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia text-white py-3 w-full overflow-hidden border-b border-white/10">
        <div className="w-full px-4 flex items-center justify-center">
          <div className="animate-pulse text-white drop-shadow-sm font-bold text-xs">
            <span className="inline-flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              Loading latest news...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia text-white py-3 w-full overflow-hidden border-b border-white/10">
      <div className="w-full px-4 flex items-center justify-between">
        <div className="hidden sm:flex items-center text-red-200 font-bold text-xs mr-4 whitespace-nowrap">
          <div className="w-2 h-2 bg-red-300 rounded-full mr-2 animate-pulse"></div>
          LIVE NEWS
        </div>
        
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          <div className="whitespace-nowrap animate-marquee-20s">
            <span 
              className="cursor-pointer hover:text-red-200 transition-colors text-white drop-shadow-sm font-semibold text-xs tracking-wide"
              title="Click to read more"
              onClick={() => newsItems.length > 0 && handleNewsClick(newsItems[0])}
            >
              {tickerContent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
