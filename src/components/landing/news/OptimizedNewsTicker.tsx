
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  background_color?: string;
  text_color?: string;
  visible: boolean;
  display_order: number;
}

interface OptimizedNewsTickerProps {
  autoHide?: boolean;
  className?: string;
}

export function OptimizedNewsTicker({ 
  autoHide = true, 
  className = "" 
}: OptimizedNewsTickerProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      const { data, error } = await supabase
        .from('top_slider_items')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setNewsItems(data || []);
    } catch (error) {
      console.error('Error fetching news items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !isVisible || newsItems.length === 0) {
    return null;
  }

  // Show only the first news item
  const currentItem = newsItems[0];

  return (
    <div 
      className={`w-full py-3 px-4 relative ${className}`}
      style={{
        backgroundColor: currentItem.background_color || '#4F46E5',
        color: currentItem.text_color || '#FFFFFF'
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <h3 className="font-semibold text-sm md:text-base">
            {currentItem.title}
          </h3>
          {currentItem.description && (
            <p className="text-xs md:text-sm opacity-90 mt-1">
              {currentItem.description}
            </p>
          )}
        </div>
        
        {autoHide && (
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
