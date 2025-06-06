
export interface NewsItem {
  id: string;
  headline: string;
  active: boolean;
  content: string;
  date: string;
  generated_by_ai?: boolean;
  link?: string;
  source?: string;
}

export class NewsService {
  private static readonly RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';
  
  private static readonly NEWS_SOURCES = {
    hbcu: 'https://news.google.com/rss/search?q=HBCU&hl=en-US&gl=US&ceid=US:en',
    spelman: 'https://news.google.com/rss/search?q=Spelman%20College&hl=en-US&gl=US&ceid=US:en',
    music: 'https://news.google.com/rss/search?q=choral%20music&hl=en-US&gl=US&ceid=US:en',
    glee: 'https://news.google.com/rss/search?q="glee%20club"&hl=en-US&gl=US&ceid=US:en'
  };

  // Content filter to exclude inappropriate content
  private static readonly FORBIDDEN_KEYWORDS = [
    'sex', 'sexual', 'porn', 'nude', 'naked', 'adult', 'explicit', 
    'prostitution', 'escort', 'dating', 'hookup', 'affair', 'scandal',
    'rape', 'assault', 'harassment', 'abuse', 'violence', 'crime',
    'drugs', 'marijuana', 'cocaine', 'arrest', 'jail', 'prison'
  ];

  private static isContentAppropriate(text: string): boolean {
    const lowerText = text.toLowerCase();
    return !this.FORBIDDEN_KEYWORDS.some(keyword => lowerText.includes(keyword));
  }

  static async fetchGoogleNews(category: keyof typeof this.NEWS_SOURCES = 'hbcu', maxItems: number = 3): Promise<NewsItem[]> {
    try {
      const rssUrl = this.NEWS_SOURCES[category];
      const apiUrl = `${this.RSS_TO_JSON_API}?rss_url=${encodeURIComponent(rssUrl)}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok' || !data.items) {
        throw new Error('Invalid response format from news API');
      }
      
      // Filter out inappropriate content
      const filteredItems = data.items.filter((item: any) => {
        const headline = item.title || '';
        const description = item.description || '';
        return this.isContentAppropriate(headline) && this.isContentAppropriate(description);
      });
      
      return filteredItems.slice(0, maxItems).map((item: any, index: number) => ({
        id: `google-news-${category}-${index}-${Date.now()}`,
        headline: this.cleanHeadline(item.title || ''),
        active: true,
        content: item.description || item.title || '',
        date: item.pubDate || new Date().toISOString(),
        link: item.link || '',
        source: item.source || 'Google News',
        generated_by_ai: false
      }));
      
    } catch (error) {
      console.error(`Error fetching Google News for ${category}:`, error);
      return [];
    }
  }

  static async fetchMixedNews(maxItems: number = 8): Promise<NewsItem[]> {
    try {
      const [hbcuNews, spelmanNews, musicNews, gleeNews] = await Promise.all([
        this.fetchGoogleNews('hbcu', 2), // Reduced from 4 to 2
        this.fetchGoogleNews('spelman', 2), // Reduced from 4 to 2
        this.fetchGoogleNews('music', 2), // Reduced from 4 to 2
        this.fetchGoogleNews('glee', 2) // Reduced from 3 to 2
      ]);
      
      const allNews = [...spelmanNews, ...hbcuNews, ...musicNews, ...gleeNews];
      
      // Additional filtering after combining sources
      const appropriateNews = allNews.filter(item => 
        this.isContentAppropriate(item.headline) && this.isContentAppropriate(item.content)
      );
      
      // Shuffle and limit results strictly
      const shuffled = appropriateNews.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(maxItems, 8)); // Never exceed 8 items
      
    } catch (error) {
      console.error('Error fetching mixed news:', error);
      return [];
    }
  }

  private static cleanHeadline(headline: string): string {
    // Remove common news source suffixes
    return headline
      .replace(/ - [A-Z][a-z]+\.[a-z]+$/, '') // Remove " - Source.com"
      .replace(/ \| [A-Z][a-z]+.*$/, '') // Remove " | Source..."
      .replace(/^\[.*?\]\s*/, '') // Remove [Category] prefixes
      .trim();
  }

  static getStaticFallbackNews(): NewsItem[] {
    const fallbackItems = [
      {
        id: "static-1",
        headline: "Spelman College Glee Club announces Spring Concert series",
        active: true,
        content: "The Spelman College Glee Club is proud to announce our Spring Concert series, featuring performances across Atlanta throughout April and May.",
        date: "May 1, 2025"
      },
      {
        id: "static-2", 
        headline: "HBCU Choir Festival featuring top collegiate ensembles",
        active: true,
        content: "Spelman College Glee Club will be participating in the annual HBCU Choir Festival this June, joining forces with top collegiate ensembles from across the country.",
        date: "May 5, 2025"
      },
      {
        id: "static-3",
        headline: "New scholarship opportunities available for music students",
        active: true,
        content: "We're pleased to announce several new scholarship opportunities for exceptional music students at Spelman College.",
        date: "May 8, 2025"
      }
    ];

    // Return only 3 fallback items
    return fallbackItems;
  }
}
