
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
  score?: number;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  onClose, 
  autoHide = false, 
  hideAfter = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Priority keywords for scoring articles
  const priorityKeywords = {
    choir: 10,
    choral: 10,
    glee: 10,
    singing: 8,
    music: 8,
    vocal: 8,
    concert: 7,
    performance: 7,
    sorority: 6,
    fraternity: 6,
    scholarship: 6,
    grant: 5,
    funding: 5,
    spelman: 12,
    morehouse: 8,
    hbcu: 5
  };

  const scoreArticle = (title: string): number => {
    const lowerTitle = title.toLowerCase();
    let score = 0;
    
    Object.entries(priorityKeywords).forEach(([keyword, points]) => {
      if (lowerTitle.includes(keyword)) {
        score += points;
      }
    });
    
    return score;
  };

  const sortArticlesByPriority = (articles: NewsArticle[]): NewsArticle[] => {
    return articles
      .map(article => ({
        ...article,
        score: scoreArticle(article.title)
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  };
  
  useEffect(() => {
    const fetchGoogleNews = async () => {
      try {
        // Fetch multiple RSS feeds to get more diverse content
        const feeds = [
          'https://news.google.com/rss/search?q=HBCU+choir&hl=en-US&gl=US&ceid=US:en',
          'https://news.google.com/rss/search?q=HBCU+music&hl=en-US&gl=US&ceid=US:en',
          'https://news.google.com/rss/search?q=HBCU+sorority&hl=en-US&gl=US&ceid=US:en',
          'https://news.google.com/rss/search?q=HBCU+scholarship&hl=en-US&gl=US&ceid=US:en',
          'https://news.google.com/rss/search?q=Spelman+College&hl=en-US&gl=US&ceid=US:en',
          'https://news.google.com/rss/search?q=HBCU&hl=en-US&gl=US&ceid=US:en'
        ];

        const allArticles: NewsArticle[] = [];

        for (const feed of feeds) {
          try {
            const response = await fetch(
              `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`
            );
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            if (data.status === 'ok' && data.items) {
              const articles = data.items
                .slice(0, 8) // Get fewer from each feed
                .map((item: any) => ({
                  title: item.title,
                  link: item.link
                }))
                .filter((article: NewsArticle) => article.title && article.title.length > 0);
              
              allArticles.push(...articles);
            }
          } catch (error) {
            console.error(`Error fetching feed ${feed}:`, error);
          }
        }

        if (allArticles.length > 0) {
          // Remove duplicates based on title similarity
          const uniqueArticles = allArticles.filter((article, index, self) => 
            index === self.findIndex(a => a.title === article.title)
          );

          // Sort by priority and take top 20
          const prioritizedArticles = sortArticlesByPriority(uniqueArticles).slice(0, 20);
          setNewsArticles(prioritizedArticles);
        } else {
          throw new Error('No articles found');
        }
      } catch (error) {
        console.error("Error fetching Google News:", error);
        // Enhanced fallback with prioritized content
        const fallbackArticles = [
          { title: "Spelman College Glee Club Announces Spring Concert Tour", link: "#" },
          { title: "HBCU Choirs Unite for National Music Festival", link: "#" },
          { title: "Alpha Kappa Alpha Sorority Awards $2M in Scholarships", link: "#" },
          { title: "Delta Sigma Theta Announces New HBCU Grant Program", link: "#" },
          { title: "Morehouse College Choir Wins International Competition", link: "#" },
          { title: "HBCU Music Programs Receive $5M Federal Funding", link: "#" },
          { title: "New Scholarship Opportunities for HBCU Students", link: "#" },
          { title: "HBCU Vocal Ensembles Perform at Lincoln Center", link: "#" },
          { title: "Zeta Phi Beta Sorority Launches Education Initiative", link: "#" },
          { title: "HBCU Students Excel in National Choral Competition", link: "#" },
          { title: "Historically Black Colleges Expand Music Department Funding", link: "#" },
          { title: "HBCU Alumni Association Offers Performance Scholarships", link: "#" },
          { title: "Gospel Music Celebration Features HBCU Choirs", link: "#" },
          { title: "Sorority Sisters Fund New HBCU Music Facility", link: "#" },
          { title: "HBCU Glee Clubs Collaborate on Virtual Concert", link: "#" },
          { title: "New Research Initiative at Historic Black Colleges", link: "#" },
          { title: "HBCU Music Education Programs Gain Recognition", link: "#" },
          { title: "Scholarship Gala Raises Funds for HBCU Students", link: "#" },
          { title: "HBCU Athletics Championships Results", link: "#" },
          { title: "Technology Partnership Benefits HBCU Community", link: "#" }
        ];
        
        const prioritizedFallback = sortArticlesByPriority(fallbackArticles);
        setNewsArticles(prioritizedFallback);
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
          <div className="flex whitespace-nowrap animate-marquee-slow">
            {newsArticles.map((article, index) => {
              const getEmoji = (title: string) => {
                const lower = title.toLowerCase();
                if (lower.includes('choir') || lower.includes('glee') || lower.includes('choral')) return '🎵';
                if (lower.includes('sorority') || lower.includes('fraternity')) return '🤝';
                if (lower.includes('scholarship') || lower.includes('grant')) return '🎓';
                if (lower.includes('spelman')) return '💙';
                return '📰';
              };

              return (
                <span 
                  key={index} 
                  className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors"
                  onClick={() => handleArticleClick(article.link)}
                  title="Click to read full article"
                >
                  {getEmoji(article.title)} {article.title}
                </span>
              );
            })}
            
            {/* Repeat items to create continuous scroll effect */}
            {newsArticles.map((article, index) => {
              const getEmoji = (title: string) => {
                const lower = title.toLowerCase();
                if (lower.includes('choir') || lower.includes('glee') || lower.includes('choral')) return '🎵';
                if (lower.includes('sorority') || lower.includes('fraternity')) return '🤝';
                if (lower.includes('scholarship') || lower.includes('grant')) return '🎓';
                if (lower.includes('spelman')) return '💙';
                return '📰';
              };

              return (
                <span 
                  key={`repeat-${index}`} 
                  className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors"
                  onClick={() => handleArticleClick(article.link)}
                  title="Click to read full article"
                >
                  {getEmoji(article.title)} {article.title}
                </span>
              );
            })}
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
