
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      throw new Error('YouTube URL is required')
    }

    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    if (!youtubeApiKey) {
      throw new Error('YouTube API key not configured')
    }

    // Extract video ID or playlist ID from URL
    const videoId = extractVideoId(url)
    const playlistId = extractPlaylistId(url)
    
    let result = {}

    if (playlistId) {
      // Fetch playlist information
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${youtubeApiKey}`
      )
      
      if (!playlistResponse.ok) {
        throw new Error('Failed to fetch playlist information')
      }
      
      const playlistData = await playlistResponse.json()
      
      if (playlistData.items && playlistData.items.length > 0) {
        const playlist = playlistData.items[0].snippet
        result = {
          title: playlist.title,
          description: playlist.description || `Playlist by ${playlist.channelTitle}`,
          thumbnail_url: playlist.thumbnails?.maxres?.url || 
                        playlist.thumbnails?.high?.url || 
                        playlist.thumbnails?.medium?.url || 
                        playlist.thumbnails?.default?.url,
          content_type: 'playlist',
          channel_title: playlist.channelTitle,
          published_at: playlist.publishedAt
        }
      }
    } else if (videoId) {
      // Fetch video information
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${youtubeApiKey}`
      )
      
      if (!videoResponse.ok) {
        throw new Error('Failed to fetch video information')
      }
      
      const videoData = await videoResponse.json()
      
      if (videoData.items && videoData.items.length > 0) {
        const video = videoData.items[0].snippet
        const stats = videoData.items[0].statistics
        result = {
          title: video.title,
          description: video.description || `Video by ${video.channelTitle}`,
          thumbnail_url: video.thumbnails?.maxres?.url || 
                        video.thumbnails?.high?.url || 
                        video.thumbnails?.medium?.url || 
                        video.thumbnails?.default?.url,
          content_type: 'video',
          channel_title: video.channelTitle,
          published_at: video.publishedAt,
          view_count: stats?.viewCount,
          like_count: stats?.likeCount
        }
      }
    } else {
      throw new Error('Invalid YouTube URL - could not extract video or playlist ID')
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('YouTube API Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^"&?\/\s]{11})/,
    /(?:youtu\.be\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/embed\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/live\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/watch\?.*v=)([^"&?\/\s]{11})/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

function extractPlaylistId(url: string): string | null {
  const patterns = [
    /[?&]list=([^"&?\/\s]+)/,
    /youtube\.com\/playlist\?list=([^"&?\/\s]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}
