
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

interface NewsArticle {
  title: string;
  link: string;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  onClose, 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
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
          const articles = data.items
            .slice(0, 20) // Get 20 articles
            .map((item: any) => ({
              title: item.title,
              link: item.link
            }))
            .filter((article: NewsArticle) => article.title && article.title.length > 0);
          
          setNewsArticles(articles);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error("Error fetching Google News:", error);
        // Fallback to sample HBCU news
        setNewsArticles([
          { title: "HBCU Students Excel in National Competition", link: "#" },
          { title: "New HBCU Partnership Announced for STEM Programs", link: "#" }, 
          { title: "HBCU Alumni Making Impact in Tech Industry", link: "#" },
          { title: "Historic Black Colleges Receive Major Grant Funding", link: "#" },
          { title: "HBCU Research Initiative Launched", link: "#" },
          { title: "Spelman College Announces New Scholarship Program", link: "#" },
          { title: "HBCU Music Programs Gain National Recognition", link: "#" },
          { title: "Students from HBCUs Lead Innovation Summit", link: "#" },
          { title: "HBCU Athletics Championships Results", link: "#" },
          { title: "New HBCU Campus Sustainability Initiative", link: "#" },
          { title: "HBCU Graduates Honored at National Ceremony", link: "#" },
          { title: "HBCU Community Service Programs Expand", link: "#" },
          { title: "Historic Black College Week Celebrations Begin", link: "#" },
          { title: "HBCU Art Exhibition Opens in Atlanta", link: "#" },
          { title: "Technology Partnership Benefits HBCU Students", link: "#" },
          { title: "HBCU Medical Programs Receive Accreditation", link: "#" },
          { title: "Alumni Donate Million to HBCU Scholarship Fund", link: "#" },
          { title: "HBCU Study Abroad Programs Expand", link: "#" },
          { title: "New HBCU Business Incubator Launches", link: "#" },
          { title: "HBCU Choir Tour Announced for Spring", link: "#" }
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
  
  const handleArticleClick = (link: string) => {
    if (link !== "#") {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
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
  if (!isVisible || (newsArticles.length === 0 && !loading)) return null;
  
  // Display loading animation while fetching
  if (loading) {
    return (
      <div className="bg-glee-columbia text-white py-1 relative">
        <div className="container flex items-center justify-center text-sm">
          <div className="flex-1 overflow-hidden flex items-center">
            <div className="w-full animate-pulse h-4 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-glee-columbia text-white py-1 relative">
      <div className="container flex items-center justify-center text-sm">
        <div className="flex-1 overflow-hidden flex items-center">
          <div className="flex whitespace-nowrap animate-marquee-fast">
            {newsArticles.map((article, index) => (
              <span 
                key={index} 
                className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors"
                onClick={() => handleArticleClick(article.link)}
                title="Click to read full article"
              >
                📰 {article.title}
              </span>
            ))}
            
            {/* Repeat items to create continuous scroll effect */}
            {newsArticles.map((article, index) => (
              <span 
                key={`repeat-${index}`} 
                className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors"
                onClick={() => handleArticleClick(article.link)}
                title="Click to read full article"
              >
                📰 {article.title}
              </span>
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
