
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
};

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Since we can't use an actual Google News API in our client-side code,
  // we'll use placeholder data for demonstration
  useEffect(() => {
    // Simulating fetch delay
    const timer = setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          title: "Spelman College Glee Club Celebrates 100 Years of Excellence",
          link: "https://example.com/spelman-glee-club",
          source: "HBCU Times",
          publishedAt: "2 hours ago"
        },
        {
          title: "Howard University Choir Wins National Competition",
          link: "https://example.com/howard-choir",
          source: "Choral Music Today",
          publishedAt: "5 hours ago"
        },
        {
          title: "The Impact of HBCU Choirs on American Music Culture",
          link: "https://example.com/hbcu-impact",
          source: "Music Education Weekly",
          publishedAt: "1 day ago"
        },
        {
          title: "Upcoming HBCU Choral Festival Announced for Fall 2025",
          link: "https://example.com/choral-festival",
          source: "College Music News",
          publishedAt: "2 days ago"
        },
        {
          title: "Grammy-Winning Composer Partners with HBCU Choirs",
          link: "https://example.com/grammy-composer",
          source: "Music Industry News",
          publishedAt: "3 days ago"
        }
      ];
      
      setNews(mockNews);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="news-ticker-container overflow-hidden bg-glee-purple/10 h-8 flex items-center">
      {loading ? (
        <div className="px-4 text-muted-foreground">Loading news...</div>
      ) : (
        <div className="ticker-wrapper whitespace-nowrap flex items-center animate-marquee">
          {news.map((item, index) => (
            <React.Fragment key={index}>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ticker-item inline-block px-4 hover:text-glee-purple transition-colors"
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-muted-foreground ml-2 text-xs">({item.source})</span>
              </a>
              {index < news.length - 1 && (
                <ArrowRight className="h-4 w-4 text-glee-purple mx-2" />
              )}
            </React.Fragment>
          ))}
          {/* Duplicate the news items to create a seamless loop */}
          {news.map((item, index) => (
            <React.Fragment key={`dup-${index}`}>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ticker-item inline-block px-4 hover:text-glee-purple transition-colors"
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-muted-foreground ml-2 text-xs">({item.source})</span>
              </a>
              {index < news.length - 1 && (
                <ArrowRight className="h-4 w-4 text-glee-purple mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
