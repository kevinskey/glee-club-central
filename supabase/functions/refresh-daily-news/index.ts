
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsItem {
  headline: string;
  content: string;
  source: string;
  link?: string;
  date: string;
}

class NewsService {
  private static readonly RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';
  
  private static readonly NEWS_SOURCES = {
    hbcu: 'https://news.google.com/rss/search?q=HBCU&hl=en-US&gl=US&ceid=US:en',
    spelman: 'https://news.google.com/rss/search?q=Spelman%20College&hl=en-US&gl=US&ceid=US:en',
    music: 'https://news.google.com/rss/search?q=choral%20music&hl=en-US&gl=US&ceid=US:en',
    glee: 'https://news.google.com/rss/search?q="glee%20club"&hl=en-US&gl=US&ceid=US:en'
  };

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

  static async fetchGoogleNews(category: keyof typeof this.NEWS_SOURCES, maxItems: number = 8): Promise<NewsItem[]> {
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
      
      const filteredItems = data.items.filter((item: any) => {
        const headline = item.title || '';
        const description = item.description || '';
        return this.isContentAppropriate(headline) && this.isContentAppropriate(description);
      });
      
      return filteredItems.slice(0, maxItems).map((item: any) => ({
        headline: this.cleanHeadline(item.title || ''),
        content: item.description || item.title || '',
        source: item.source || 'Google News',
        link: item.link || '',
        date: item.pubDate || new Date().toISOString()
      }));
      
    } catch (error) {
      console.error(`Error fetching Google News for ${category}:`, error);
      return [];
    }
  }

  static async fetchMixedNews(maxItems: number = 15): Promise<NewsItem[]> {
    try {
      const [hbcuNews, spelmanNews, musicNews, gleeNews] = await Promise.all([
        this.fetchGoogleNews('hbcu', 4),
        this.fetchGoogleNews('spelman', 4),
        this.fetchGoogleNews('music', 4),
        this.fetchGoogleNews('glee', 3)
      ]);
      
      const allNews = [...spelmanNews, ...hbcuNews, ...musicNews, ...gleeNews];
      
      const appropriateNews = allNews.filter(item => 
        this.isContentAppropriate(item.headline) && this.isContentAppropriate(item.content)
      );
      
      // Shuffle and limit results
      const shuffled = appropriateNews.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, maxItems);
      
    } catch (error) {
      console.error('Error fetching mixed news:', error);
      return [];
    }
  }

  private static cleanHeadline(headline: string): string {
    return headline
      .replace(/ - [A-Z][a-z]+\.[a-z]+$/, '')
      .replace(/ \| [A-Z][a-z]+.*$/, '')
      .replace(/^\[.*?\]\s*/, '')
      .trim();
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔄 Starting daily news refresh...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch fresh news from Google News
    const freshNews = await NewsService.fetchMixedNews(12);
    console.log(`📰 Fetched ${freshNews.length} fresh news items`);

    if (freshNews.length === 0) {
      console.log('❌ No fresh news items found');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No fresh news items found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // First, deactivate old AI-generated news items
    const { error: deactivateError } = await supabase
      .from('news_items')
      .update({ active: false })
      .eq('generated_by_ai', true)
      .eq('active', true);

    if (deactivateError) {
      console.error('❌ Error deactivating old news:', deactivateError);
    } else {
      console.log('✅ Deactivated old AI-generated news items');
    }

    // Insert fresh news items
    const newsToInsert = freshNews.map(item => ({
      headline: item.headline,
      content: item.content,
      generated_by_ai: true,
      ai_prompt: 'Daily Google News Refresh',
      priority: Math.floor(Math.random() * 5) + 1, // Random priority 1-5
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      active: true,
      source: item.source,
      link: item.link
    }));

    const { data: insertedNews, error: insertError } = await supabase
      .from('news_items')
      .insert(newsToInsert)
      .select();

    if (insertError) {
      console.error('❌ Error inserting fresh news:', insertError);
      throw insertError;
    }

    console.log(`✅ Successfully inserted ${insertedNews?.length || 0} fresh news items`);

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully refreshed ${insertedNews?.length || 0} news items`,
      data: {
        deactivated_old: !deactivateError,
        inserted_new: insertedNews?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('💥 Error in daily news refresh:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
