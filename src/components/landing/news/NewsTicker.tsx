
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  id: string;
  headline: string;
  active: boolean;
  start_date: string;
  end_date: string | null;
  priority: number;
}

interface NewsTickerProps {
  onClose?: () => void;
  autoHide?: boolean;
  hideAfter?: number; // in milliseconds
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  onClose, 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        const today = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('news_items')
          .select('*')
          .eq('active', true)
          .lte('start_date', today)
          .or(`end_date.gt.${today},end_date.is.null`)
          .order('priority', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        setNewsItems(data || []);
      } catch (error) {
        console.error("Error fetching news items:", error);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsItems();
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  // Auto-hide after specified duration if autoHide is true
  useEffect(() => {
    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideAfter);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, hideAfter]);
  
  // If no news items or not visible, don't render
  if (!isVisible || (newsItems.length === 0 && !loading)) return null;
  
  // Display loading animation while fetching
  if (loading) {
    return (
      <div className="bg-glee-purple text-white py-1 relative">
        <div className="container flex items-center justify-center text-sm">
          <div className="flex-1 overflow-hidden">
            <div className="w-full animate-pulse h-4 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-glee-purple text-white py-2 relative">
      <div className="container flex items-center justify-center text-sm">
        <div className="flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {newsItems.map((item) => (
              <span key={item.id} className="mx-4">📣 {item.headline}</span>
            ))}
            
            {/* Repeat items to create continuous scroll effect */}
            {newsItems.map((item) => (
              <span key={`repeat-${item.id}`} className="mx-4">📣 {item.headline}</span>
            ))}
          </div>
        </div>
        <button 
          onClick={handleClose} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close news ticker"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
