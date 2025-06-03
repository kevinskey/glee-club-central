import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  id: string;
  headline: string;
  active: boolean;
  content: string;
  date: string;
  generated_by_ai?: boolean;
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
  const [scrollSpeed, setScrollSpeed] = useState<'slow' | 'normal' | 'fast'>('slow');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  // Fetch news items from database
  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        const { data, error } = await supabase
          .from('news_items')
          .select('id, headline, content, start_date, end_date, active, generated_by_ai')
          .eq('active', true)
          .order('priority', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching news items:', error);
          // Fallback to static items
          setNewsItems(getStaticNewsItems());
        } else if (data && data.length > 0) {
          const formattedItems: NewsItem[] = data.map(item => ({
            id: item.id,
            headline: item.headline,
            active: item.active,
            content: item.content || '',
            date: item.start_date,
            generated_by_ai: item.generated_by_ai
          }));
          setNewsItems(formattedItems);
        } else {
          // No items in database, use static fallback
          setNewsItems(getStaticNewsItems());
        }
      } catch (error) {
        console.error('Error fetching news items:', error);
        setNewsItems(getStaticNewsItems());
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItems();

    // Set up real-time subscription for news items
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

  // Static fallback news items without icons
  const getStaticNewsItems = (): NewsItem[] => [
    {
      id: "static-1",
      headline: "Spelman College Glee Club announces Spring Concert series",
      active: true,
      content: "The Spelman College Glee Club is proud to announce our Spring Concert series, featuring performances across Atlanta throughout April and May.",
      date: "May 1, 2025"
    },
    {
      id: "static-2", 
      headline: "HBCU Choir Festival featuring top collegiate ensembles",
      active: true,
      content: "Spelman College Glee Club will be participating in the annual HBCU Choir Festival this June, joining forces with top collegiate ensembles from across the country.",
      date: "May 5, 2025"
    },
    {
      id: "static-3",
      headline: "New scholarship opportunities available for music students",
      active: true,
      content: "We're pleased to announce several new scholarship opportunities for exceptional music students at Spelman College.",
      date: "May 8, 2025"
    },
    {
      id: "static-4",
      headline: "Glee Club wins national recognition for excellence in choral music",
      active: true,
      content: "The Spelman College Glee Club has received national recognition for excellence in choral music at the Collegiate Choral Competition.",
      date: "May 12, 2025"
    }
  ];

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
    // Open the news article page
    window.location.href = `/news/${item.id}`;
  };

  const getAnimationClass = () => {
    switch (scrollSpeed) {
      case 'slow': return 'animate-marquee-slow';
      case 'normal': return 'animate-marquee-normal'; 
      case 'fast': return 'animate-marquee-fast';
      default: return 'animate-marquee-slow';
    }
  };

  // Function to remove icons/emojis from headlines
  const removeIconsFromHeadline = (headline: string) => {
    // Remove emojis/icons (Unicode ranges for various emoji)
    return headline.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '').trim();
  };

  // Create seamless infinite scroll by repeating content multiple times with visible separators
  const newsContent = newsItems.map(item => removeIconsFromHeadline(item.headline)).join(' • '); // Use bullet separator
  // Repeat the content multiple times to ensure seamless infinite scroll
  const repeatedContent = Array(6).fill(newsContent).join(' • '); // Use bullet separator between repeats

  if (isLoading) {
    return (
      <div className="bg-glee-columbia text-white py-2 relative w-full overflow-hidden">
        <div className="w-full px-4 flex items-center justify-center">
          <div className="animate-pulse text-white drop-shadow-sm font-bold text-xs">
            Loading news...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-glee-columbia text-white py-2 relative w-full overflow-hidden">
      <div className="w-full px-4 flex items-center justify-between">
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          <div className={`whitespace-nowrap ${getAnimationClass()}`}>
            <span 
              className="cursor-pointer hover:text-yellow-200 transition-colors text-white drop-shadow-sm font-bold text-xs"
              title="Click to read more"
              onClick={() => handleNewsClick(newsItems[0])}
            >
              {repeatedContent}
            </span>
          </div>
        </div>
        
        {/* Admin Controls */}
        {isAdmin() && (
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20 p-1"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setScrollSpeed('slow')}>
                  Slow Speed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScrollSpeed('normal')}>
                  Normal Speed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScrollSpeed('fast')}>
                  Fast Speed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};
