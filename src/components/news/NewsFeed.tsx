
import React, { useState, useEffect } from "react";
import { ArrowRight, Music, BookOpen } from "lucide-react";

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
          title: "Dr. Kevin Johnson Leads Masterclass at National Choral Convention",
          link: "https://example.com/johnson-masterclass",
          source: "Choral Director",
          publishedAt: "5 hours ago"
        },
        {
          title: "Spring Concert Series Announced - Tickets Now Available",
          link: "https://example.com/spring-concert",
          source: "Campus Events",
          publishedAt: "1 day ago"
        },
        {
          title: "Glee Club to Perform at Governor's Arts Celebration",
          link: "https://example.com/governors-arts",
          source: "State Arts Council",
          publishedAt: "2 days ago"
        },
        {
          title: "New Scholarship Established for Voice Students",
          link: "https://example.com/voice-scholarship",
          source: "Alumni News",
          publishedAt: "3 days ago"
        }
      ];
      
      setNews(mockNews);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="news-ticker-container overflow-hidden bg-gradient-to-r from-glee-purple/5 to-glee-gold/5 h-9 flex items-center border-b border-gray-200 dark:border-gray-800">
      {loading ? (
        <div className="px-4 text-muted-foreground flex items-center">
          <Music className="animate-pulse h-4 w-4 mr-2 text-glee-purple" />
          <span>Loading news...</span>
        </div>
      ) : (
        <div className="ticker-wrapper whitespace-nowrap flex items-center animate-marquee">
          {news.map((item, index) => (
            <React.Fragment key={index}>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ticker-item inline-flex items-center px-4 hover:text-glee-purple transition-colors"
              >
                <Music className="h-3.5 w-3.5 mr-2 text-glee-purple" />
                <span className="font-medium">{item.title}</span>
                <span className="text-muted-foreground ml-2 text-xs">({item.source})</span>
              </a>
              {index < news.length - 1 && (
                <ArrowRight className="h-3 w-3 text-glee-purple/50 mx-2" />
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
                className="ticker-item inline-flex items-center px-4 hover:text-glee-purple transition-colors"
              >
                <Music className="h-3.5 w-3.5 mr-2 text-glee-purple" />
                <span className="font-medium">{item.title}</span>
                <span className="text-muted-foreground ml-2 text-xs">({item.source})</span>
              </a>
              {index < news.length - 1 && (
                <ArrowRight className="h-3 w-3 text-glee-purple/50 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
