
import React, { useState, useEffect } from "react";

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
  const [error, setError] = useState<string | null>(null);
  
  // Priority keywords for scoring articles
  const priorityKeywords = {
    spelman: 15,
    choir: 12,
    choral: 12,
    glee: 12,
    hbcu: 10,
    music: 8,
    vocal: 8,
    sorority: 7,
    fraternity: 7,
    concert: 6,
    performance: 6,
    scholarship: 6,
    grant: 5,
    funding: 5,
    morehouse: 5
  };

  const scoreArticle = (title: string): number => {
    console.log('NewsTicker: Scoring article:', title);
    const lowerTitle = title.toLowerCase();
    let score = 0;
    
    Object.entries(priorityKeywords).forEach(([keyword, points]) => {
      if (lowerTitle.includes(keyword)) {
        score += points;
        console.log(`NewsTicker: Found keyword "${keyword}" (+${points} points)`);
      }
    });
    
    console.log(`NewsTicker: Final score for "${title}": ${score}`);
    return score;
  };

  const sortArticlesByPriority = (articles: NewsArticle[]): NewsArticle[] => {
    console.log('NewsTicker: Sorting articles by priority');
    return articles
      .map(article => ({
        ...article,
        score: scoreArticle(article.title)
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  };
  
  useEffect(() => {
    console.log('NewsTicker: Starting to fetch news');
    const fetchGoogleNews = async () => {
      try {
        setError(null);
        
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

        console.log('NewsTicker: Fetching from', feeds.length, 'RSS feeds');

        for (const feed of feeds) {
          try {
            console.log('NewsTicker: Fetching feed:', feed);
            const response = await fetch(
              `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`
            );
            
            if (!response.ok) {
              console.log('NewsTicker: Feed fetch failed:', response.status);
              continue;
            }
            
            const data = await response.json();
            console.log('NewsTicker: Feed response:', data);
            
            if (data.status === 'ok' && data.items) {
              const articles = data.items
                .slice(0, 8) // Get fewer from each feed
                .map((item: any) => ({
                  title: item.title,
                  link: item.link
                }))
                .filter((article: NewsArticle) => article.title && article.title.length > 0);
              
              console.log('NewsTicker: Added', articles.length, 'articles from feed');
              allArticles.push(...articles);
            }
          } catch (error) {
            console.error(`NewsTicker: Error fetching feed ${feed}:`, error);
          }
        }

        console.log('NewsTicker: Total articles fetched:', allArticles.length);

        if (allArticles.length > 0) {
          // Remove duplicates based on title similarity
          const uniqueArticles = allArticles.filter((article, index, self) => 
            index === self.findIndex(a => a.title === article.title)
          );

          console.log('NewsTicker: Unique articles after deduplication:', uniqueArticles.length);

          // Sort by priority and take top 20
          const prioritizedArticles = sortArticlesByPriority(uniqueArticles).slice(0, 20);
          console.log('NewsTicker: Final prioritized articles:', prioritizedArticles.length);
          setNewsArticles(prioritizedArticles);
        } else {
          throw new Error('No articles found from any feed');
        }
      } catch (error) {
        console.error("NewsTicker: Error fetching Google News:", error);
        setError('Failed to fetch news');
        
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
        
        console.log('NewsTicker: Using fallback articles');
        const prioritizedFallback = sortArticlesByPriority(fallbackArticles);
        setNewsArticles(prioritizedFallback);
      } finally {
        setLoading(false);
        console.log('NewsTicker: Finished loading news');
      }
    };
    
    fetchGoogleNews();
  }, []);
  
  const handleArticleClick = (link: string, title: string) => {
    console.log('NewsTicker: Clicked article:', title, 'Link:', link);
    if (link !== "#") {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };
  
  // If not visible, don't render
  if (!isVisible) {
    console.log('NewsTicker: Not visible, not rendering');
    return null;
  }
  
  // Display loading animation while fetching
  if (loading) {
    console.log('NewsTicker: Showing loading state');
    return (
      <div className="bg-glee-columbia text-white py-0.5 relative">
        <div className="container flex items-center justify-center text-xs">
          <div className="flex-1 overflow-hidden flex items-center">
            <div className="w-full animate-pulse h-3 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && newsArticles.length === 0) {
    console.log('NewsTicker: Showing error state');
    return (
      <div className="bg-red-600 text-white py-0.5 relative">
        <div className="container flex items-center justify-center text-xs">
          <span>📰 Unable to load news at this time</span>
        </div>
      </div>
    );
  }
  
  console.log('NewsTicker: Rendering with', newsArticles.length, 'articles');
  
  return (
    <div className="bg-glee-columbia text-white py-0.5 relative">
      <div className="container flex items-center justify-center text-xs">
        <div className="flex-1 overflow-hidden flex items-center">
          <div className="flex whitespace-nowrap animate-marquee-slow">
            {newsArticles.map((article, index) => {
              const getEmoji = (title: string) => {
                const lower = title.toLowerCase();
                if (lower.includes('spelman')) return '💙';
                if (lower.includes('choir') || lower.includes('glee') || lower.includes('choral')) return '🎵';
                if (lower.includes('sorority') || lower.includes('fraternity')) return '🤝';
                if (lower.includes('scholarship') || lower.includes('grant')) return '🎓';
                if (lower.includes('hbcu')) return '🏛️';
                return '📰';
              };

              return (
                <span 
                  key={index} 
                  className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors"
                  onClick={() => handleArticleClick(article.link, article.title)}
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
                if (lower.includes('spelman')) return '💙';
                if (lower.includes('choir') || lower.includes('glee') || lower.includes('choral')) return '🎵';
                if (lower.includes('sorority') || lower.includes('fraternity')) return '🤝';
                if (lower.includes('scholarship') || lower.includes('grant')) return '🎓';
                if (lower.includes('hbcu')) return '🏛️';
                return '📰';
              };

              return (
                <span 
                  key={`repeat-${index}`} 
                  className="mx-6 cursor-pointer hover:text-yellow-200 transition-colors"
                  onClick={() => handleArticleClick(article.link, article.title)}
                  title="Click to read full article"
                >
                  {getEmoji(article.title)} {article.title}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
