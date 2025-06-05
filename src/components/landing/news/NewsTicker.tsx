
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
  const isMobile = useIsMobile();

  // Fetch news items from database or Google News
  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        setIsLoading(true);
        
        // Try database first
        const { data: dbNews, error } = await supabase
          .from('news_items')
          .select('id, headline, content, start_date, end_date, active, generated_by_ai')
          .eq('active', true)
          .order('priority', { ascending: false })
          .limit(8); // Increased limit for more items

        let finalNewsItems: NewsItem[] = [];

        if (!error && dbNews && dbNews.length > 0) {
          // Use database news if available
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
          // Fallback to Google News
          console.log('No database news found, fetching from Google News...');
          const googleNews = await NewsService.fetchMixedNews(12); // More items for longer scroll
          
          if (googleNews.length > 0) {
            finalNewsItems = googleNews;
            setNewsSource('google');
          } else {
            // Final fallback to static content
            finalNewsItems = NewsService.getStaticFallbackNews();
            setNewsSource('mixed');
          }
        }

        setNewsItems(finalNewsItems);
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

  // Create a single continuous ticker with proper spacing
  const createTickerContent = () => {
    const cleanHeadlines = newsItems.map(item => removeIconsFromHeadline(item.headline));
    const separator = '   •   ';
    const singlePass = cleanHeadlines.join(separator);
    
    // Repeat the content multiple times for seamless scrolling
    return Array(8).fill(singlePass).join(separator); // More repetitions for longer content
  };

  const tickerContent = createTickerContent();

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
        {/* News Label */}
        <div className="hidden sm:flex items-center text-red-200 font-bold text-xs mr-4 whitespace-nowrap">
          <div className="w-2 h-2 bg-red-300 rounded-full mr-2 animate-pulse"></div>
          {newsSource === 'google' ? 'LIVE NEWS' : newsSource === 'database' ? 'LATEST NEWS' : 'NEWS'}
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

export { NewsItem };
