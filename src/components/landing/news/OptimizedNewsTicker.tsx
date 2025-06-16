
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import { UnifiedContainer } from '@/components/ui/unified-container';

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
    <div className={`w-full bg-background ${className}`}>
      <UnifiedContainer size="xl" padding="md">
        <div className="relative overflow-hidden rounded-lg">
          {/* Navy liquid glass background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-indigo-900/70 to-blue-900/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
          
          <div className="relative py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <h3 className="font-semibold text-sm md:text-base text-white drop-shadow-sm">
                  {currentItem.title}
                </h3>
                {currentItem.description && (
                  <p className="text-xs md:text-sm opacity-90 mt-1 text-blue-100">
                    {currentItem.description}
                  </p>
                )}
              </div>
              
              {autoHide && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="ml-4 p-1 hover:bg-white/20 rounded transition-colors text-white"
                  aria-label="Close banner"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </UnifiedContainer>
    </div>
  );
}
