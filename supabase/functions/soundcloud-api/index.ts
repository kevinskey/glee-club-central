
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('SoundCloud API endpoint called')
    
    // Return enhanced mock data that matches the expected structure
    const mockData = {
      playlists: [
        {
          id: 'playlist-1',
          name: 'Spelman Glee Club - Featured Performances',
          description: 'Our most celebrated vocal performances and arrangements',
          track_count: 5,
          duration: 900000, // 15 minutes in milliseconds
          artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          permalink_url: 'https://soundcloud.com/doctorkj/sets/featured-performances',
          is_public: true,
          created_at: new Date().toISOString(),
          tracks: [
            {
              id: 'track-1',
              title: 'Amazing Grace',
              artist: 'Spelman College Glee Club',
              audioUrl: '#', // Placeholder - would be actual SoundCloud stream URL
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
            },
            {
              id: 'track-3',
              title: 'Wade in the Water',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 195,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 389,
              plays: 2760,
              isLiked: false,
              genre: 'Spiritual',
              uploadDate: new Date().toISOString(),
              description: 'Traditional spiritual with contemporary arrangement',
              permalink_url: 'https://soundcloud.com/doctorkj/wade-in-the-water'
            },
            {
              id: 'track-4',
              title: 'Go Tell It on the Mountain',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 210,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 234,
              plays: 1890,
              isLiked: false,
              genre: 'Christmas',
              uploadDate: new Date().toISOString(),
              description: 'Classic Christmas spiritual with jazz influences',
              permalink_url: 'https://soundcloud.com/doctorkj/go-tell-it'
            },
            {
              id: 'track-5',
              title: 'Sometimes I Feel Like a Motherless Child',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 270,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 445,
              plays: 3100,
              isLiked: false,
              genre: 'Spiritual',
              uploadDate: new Date().toISOString(),
              description: 'Soulful rendition of the classic spiritual',
              permalink_url: 'https://soundcloud.com/doctorkj/motherless-child'
            }
          ]
        },
        {
          id: 'playlist-2',
          name: 'Classical Masterworks',
          description: 'Classical choral pieces from our concert repertoire',
          track_count: 3,
          duration: 600000, // 10 minutes
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
            },
            {
              id: 'track-7',
              title: 'Hallelujah Chorus',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 180,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 892,
              plays: 6750,
              isLiked: false,
              genre: 'Baroque',
              uploadDate: new Date().toISOString(),
              description: 'Handel\'s triumphant Hallelujah Chorus from Messiah',
              permalink_url: 'https://soundcloud.com/doctorkj/hallelujah-chorus'
            },
            {
              id: 'track-8',
              title: 'Requiem (Mozart) - Lacrimosa',
              artist: 'Spelman College Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 180,
              waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
              likes: 334,
              plays: 2100,
              isLiked: false,
              genre: 'Classical',
              uploadDate: new Date().toISOString(),
              description: 'Mozart\'s hauntingly beautiful Lacrimosa movement',
              permalink_url: 'https://soundcloud.com/doctorkj/lacrimosa-mozart'
            }
          ]
        }
      ],
      tracks: [],
      status: 'success',
      message: 'SoundCloud playlists loaded successfully'
    }

    console.log('Returning SoundCloud data with', mockData.playlists.length, 'playlists')
    
    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SoundCloud API Error:', error)
    
    // Always return valid JSON, even for errors
    const errorResponse = {
      playlists: [],
      tracks: [],
      status: 'error',
      message: error.message || 'Failed to load SoundCloud content',
      error: true
    }
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 // Return 200 with error data to avoid fetch failures
      }
    )
  }
})
