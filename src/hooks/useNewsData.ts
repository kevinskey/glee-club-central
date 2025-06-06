
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsService, NewsItem } from '@/services/newsService';

export function useNewsData() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsSource, setNewsSource] = useState<'database' | 'google' | 'mixed'>('mixed');

  const shouldFetchFreshContent = () => {
    const today = new Date().toDateString();
    const lastFetch = localStorage.getItem('news_last_fetch_date');
    return !lastFetch || lastFetch !== today;
  };

  const saveFetchDate = () => {
    const today = new Date().toDateString();
    localStorage.setItem('news_last_fetch_date', today);
  };

  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        setIsLoading(true);
        
        const needsFreshContent = shouldFetchFreshContent();
        
        // Try database first - limit to 5 items max
        const { data: dbNews, error } = await supabase
          .from('news_items')
          .select('id, headline, content, start_date, end_date, active, generated_by_ai')
          .eq('active', true)
          .order('priority', { ascending: false })
          .limit(5); // Reduced from 15 to 5

        let finalNewsItems: NewsItem[] = [];

        if (!error && dbNews && dbNews.length >= 3 && !needsFreshContent) {
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
          console.log('Fetching fresh news from Google News...');
          const googleNews = await NewsService.fetchMixedNews(8); // Reduced from 20 to 8
          
          if (googleNews.length > 0) {
            // Take only first 5 items from Google News
            finalNewsItems = googleNews.slice(0, 5);
            
            if (dbNews && dbNews.length > 0) {
              const dbItems = dbNews.slice(0, 2).map(item => ({ // Reduced from 5 to 2
                id: item.id,
                headline: item.headline,
                active: item.active,
                content: item.content || '',
                date: item.start_date,
                generated_by_ai: item.generated_by_ai
              }));
              // Combine but limit total to 5 items
              finalNewsItems = [...googleNews.slice(0, 3), ...dbItems];
            }
            
            setNewsSource('google');
            saveFetchDate();
          } else {
            // Use only first 3 fallback items
            finalNewsItems = NewsService.getStaticFallbackNews().slice(0, 3);
            setNewsSource('mixed');
          }
        }

        // Final safety check - never exceed 5 items total
        const limitedItems = finalNewsItems.slice(0, 5);
        setNewsItems(limitedItems);

      } catch (error) {
        console.error('Error fetching news items:', error);
        // Use only first 3 fallback items on error
        setNewsItems(NewsService.getStaticFallbackNews().slice(0, 3));
        setNewsSource('mixed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItems();

    const channel = supabase
      .channel('news-items-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news_items' }, () => {
        console.log('News items updated, refetching...');
        fetchNewsItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { newsItems, isLoading, newsSource };
}
