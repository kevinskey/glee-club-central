
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NewsService } from "@/services/newsService";
import type { NewsItem } from "@/services/newsService";
import { useIsMobile } from "@/hooks/use-mobile";

interface NewsTickerProps {
  autoHide?: boolean;
  hideAfter?: number;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsSource, setNewsSource] = useState<'database' | 'google' | 'mixed'>('mixed');
  const [lastFetchDate, setLastFetchDate] = useState<string>('');
  const [randomOffset, setRandomOffset] = useState(0);
  const isMobile = useIsMobile();

  // Check if we need to fetch fresh content (once per day)
  const shouldFetchFreshContent = () => {
    const today = new Date().toDateString();
    const lastFetch = localStorage.getItem('news_last_fetch_date');
    return !lastFetch || lastFetch !== today;
  };

  // Save fetch date to localStorage
  const saveFetchDate = () => {
    const today = new Date().toDateString();
    localStorage.setItem('news_last_fetch_date', today);
    setLastFetchDate(today);
  };

  // Fetch news items from database or Google News
  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        setIsLoading(true);
        
        // Check if we need fresh content
        const needsFreshContent = shouldFetchFreshContent();
        
        // Try database first
        const { data: dbNews, error } = await supabase
          .from('news_items')
          .select('id, headline, content, start_date, end_date, active, generated_by_ai')
          .eq('active', true)
          .order('priority', { ascending: false })
          .limit(15); // Increased limit for more variety

        let finalNewsItems: NewsItem[] = [];

        if (!error && dbNews && dbNews.length >= 8 && !needsFreshContent) {
          // Use database news if we have enough and don't need fresh content
          finalNewsItems = dbNews.map(item => ({
            id: item.id,
            headline: item.headline,
            active: item.active,
            content: item.content || '',
            date: item.start_date,
            generated_by_ai: item.generated_by_ai
          }));
          setNewsSource('database');
        } else {
          // Fetch fresh content from Google News or if database has insufficient items
          console.log('Fetching fresh news from Google News...');
          const googleNews = await NewsService.fetchMixedNews(20); // More items for variety
          
          if (googleNews.length > 0) {
            finalNewsItems = [...googleNews];
            
            // If we have some database items, mix them in
            if (dbNews && dbNews.length > 0) {
              const dbItems = dbNews.slice(0, 5).map(item => ({
                id: item.id,
                headline: item.headline,
                active: item.active,
                content: item.content || '',
                date: item.start_date,
                generated_by_ai: item.generated_by_ai
              }));
              finalNewsItems = [...googleNews, ...dbItems];
            }
            
            setNewsSource('google');
            saveFetchDate(); // Mark that we fetched fresh content today
          } else {
            // Final fallback to static content
            finalNewsItems = NewsService.getStaticFallbackNews();
            setNewsSource('mixed');
          }
        }

        // Shuffle the news items to add variety
        const shuffledItems = finalNewsItems.sort(() => Math.random() - 0.5);
        setNewsItems(shuffledItems);
        
        // Set a random starting offset to avoid always starting with the same item
        setRandomOffset(Math.floor(Math.random() * shuffledItems.length));

      } catch (error) {
        console.error('Error fetching news items:', error);
        setNewsItems(NewsService.getStaticFallbackNews());
        setNewsSource('mixed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItems();

    // Set up real-time updates for database news
    const channel = supabase
      .channel('news-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news_items'
        },
        () => {
          console.log('News items updated, refetching...');
          fetchNewsItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const handleNewsClick = (item: NewsItem) => {
    const url = item.link || `/news/${item.id}`;
    
    if (isMobile) {
      // On mobile, open in a smaller popup window instead of full screen
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
      // On desktop, open in new tab as before
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const removeIconsFromHeadline = (headline: string) => {
    return headline.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '').trim();
  };

  // Create a single continuous ticker with proper spacing and random offset
  const createTickerContent = () => {
    if (newsItems.length === 0) return '';
    
    const cleanHeadlines = newsItems.map(item => removeIconsFromHeadline(item.headline));
    const separator = '   •   ';
    
    // Start from a random offset to avoid always showing the same first item
    const rotatedHeadlines = [
      ...cleanHeadlines.slice(randomOffset),
      ...cleanHeadlines.slice(0, randomOffset)
    ];
    
    const singlePass = rotatedHeadlines.join(separator);
    
    // Repeat the content multiple times for seamless scrolling
    return Array(6).fill(singlePass).join(separator);
  };

  const tickerContent = createTickerContent();

  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden border-b border-white/10">
        {/* Navy liquid glass background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-indigo-900/70 to-blue-900/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative py-3 w-full px-4 flex items-center justify-center">
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
    <div className="relative w-full overflow-hidden border-b border-white/10">
      {/* Navy liquid glass background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-indigo-900/70 to-blue-900/60 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      
      <div className="relative py-3 w-full px-4 flex items-center justify-between">
        {/* News Label */}
        <div className="hidden sm:flex items-center text-blue-200 font-bold text-xs mr-4 whitespace-nowrap">
          <div className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></div>
          {newsSource === 'google' ? 'LIVE NEWS' : newsSource === 'database' ? 'LATEST NEWS' : 'NEWS'}
        </div>
        
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          <div className="whitespace-nowrap animate-marquee-20s">
            <span 
              className="cursor-pointer hover:text-blue-200 transition-colors text-white drop-shadow-sm font-semibold text-xs tracking-wide"
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

export { NewsItem };
