
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGoogleNews = async () => {
      try {
        // Using RSS2JSON service to fetch Google News RSS feed for HBCU
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            'https://news.google.com/rss/search?q=HBCU&hl=en-US&gl=US&ceid=US:en'
          )}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.items) {
          const headlines = data.items
            .slice(0, 5) // Limit to 5 items
            .map((item: any) => item.title)
            .filter((title: string) => title && title.length > 0);
          
          setNewsItems(headlines);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error("Error fetching Google News:", error);
        // Fallback to sample HBCU news
        setNewsItems([
          "HBCU Students Excel in National Competition",
          "New HBCU Partnership Announced for STEM Programs", 
          "HBCU Alumni Making Impact in Tech Industry",
          "Historic Black Colleges Receive Major Grant Funding"
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoogleNews();
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
      <div className="bg-glee-columbia text-white py-2 relative">
        <div className="container flex items-center justify-center text-sm">
          <div className="flex-1 overflow-hidden">
            <div className="w-full animate-pulse h-4 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-glee-columbia text-white py-2 relative">
      <div className="container flex items-center justify-center text-sm">
        <div className="flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee-fast">
            {newsItems.map((headline, index) => (
              <span key={index} className="mx-6">📰 {headline}</span>
            ))}
            
            {/* Repeat items to create continuous scroll effect */}
            {newsItems.map((headline, index) => (
              <span key={`repeat-${index}`} className="mx-6">📰 {headline}</span>
            ))}
          </div>
        </div>
        <button 
          onClick={handleClose} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors ml-4"
          aria-label="Close news ticker"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
