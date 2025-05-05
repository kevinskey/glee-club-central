
import React, { useState, useEffect } from "react";
import { Newspaper } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-sm">
          <Newspaper className="h-4 w-4 text-glee-purple" />
          <span>HBCU Choral News</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 font-semibold bg-muted/50">
          <h3 className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            HBCU Choral News
          </h3>
        </div>
        <Separator />
        <ScrollArea className="h-60">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading news...
            </div>
          ) : (
            <div className="p-0">
              {news.map((item, index) => (
                <div key={index} className="p-3 hover:bg-muted/50 transition-colors">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h4 className="font-medium line-clamp-2 text-sm">{item.title}</h4>
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span>{item.source}</span>
                      <span>{item.publishedAt}</span>
                    </div>
                  </a>
                  {index < news.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
