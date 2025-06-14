
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('SoundCloud API function invoked', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Processing SoundCloud API request')
    
    // Return mock SoundCloud data
    const mockData = {
      playlists: [
        {
          id: 'playlist-1',
          name: 'Spelman Glee Club - Featured Performances',
          description: 'Our most celebrated vocal performances and arrangements',
          track_count: 5,
          duration: 900000,
          artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          permalink_url: 'https://soundcloud.com/doctorkj/sets/featured-performances',
          is_public: true,
          created_at: new Date().toISOString(),
          tracks: [
            {
              id: 'track-1',
              title: 'Amazing Grace',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 240,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 456,
              plays: 3200,
              isLiked: false,
              genre: 'Spiritual',
              uploadDate: new Date().toISOString(),
              description: 'Traditional spiritual arranged for mixed choir',
              permalink_url: 'https://soundcloud.com/doctorkj/amazing-grace'
            },
            {
              id: 'track-2',
              title: 'Lift Every Voice and Sing',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 300,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 623,
              plays: 4850,
              isLiked: false,
              genre: 'Anthem',
              uploadDate: new Date().toISOString(),
              description: 'The Black National Anthem performed with passion',
              permalink_url: 'https://soundcloud.com/doctorkj/lift-every-voice'
            }
          ]
        },
        {
          id: 'playlist-2',
          name: 'Classical Masterworks',
          description: 'Classical choral pieces from our concert repertoire',
          track_count: 3,
          duration: 600000,
          artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          permalink_url: 'https://soundcloud.com/doctorkj/sets/classical-masterworks',
          is_public: true,
          created_at: new Date().toISOString(),
          tracks: [
            {
              id: 'track-6',
              title: 'Ave Maria (Schubert)',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 240,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 567,
              plays: 4200,
              isLiked: false,
              genre: 'Classical',
              uploadDate: new Date().toISOString(),
              description: 'Schubert\'s beloved Ave Maria performed by our soprano section',
              permalink_url: 'https://soundcloud.com/doctorkj/ave-maria-schubert'
            }
          ]
        }
      ],
      tracks: [],
      status: 'success',
      message: 'SoundCloud playlists loaded successfully'
    }

    console.log('Returning mock data with', mockData.playlists.length, 'playlists')
    
    const response = new Response(
      JSON.stringify(mockData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )
    
    console.log('Response created successfully')
    return response

  } catch (error) {
    console.error('SoundCloud API Error:', error)
    
    const errorResponse = {
      playlists: [],
      tracks: [],
      status: 'error',
      message: error?.message || 'Failed to load SoundCloud content',
      error: true
    }
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    )
  }
})
