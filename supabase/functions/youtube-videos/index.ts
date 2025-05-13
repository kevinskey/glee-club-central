
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get channelId from query parameters or use default
    const url = new URL(req.url);
    const channelId = url.searchParams.get('channelId') || 'UCk1x0JI7pM6YaBbtP1pKgJw'; // Default to Spelman Glee Club channel
    const maxResults = url.searchParams.get('maxResults') || '10';

    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured');
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    const videos = data.items
      .filter(item => item.id.kind === 'youtube#video')
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnailUrl: item.snippet.thumbnails.high?.url || 
                     item.snippet.thumbnails.medium?.url || 
                     item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        viewCount: 0, // These would require additional API calls
        likeCount: 0,
        commentCount: 0,
        duration: ''
      }));

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
