
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    console.log('SoundCloud API called')
    
    // Return mock data for now since SoundCloud API authentication is failing
    const mockData = {
      playlists: [
        {
          id: 'featured-playlist-1',
          name: 'Featured Performances',
          description: 'Our best vocal performances from recent concerts',
          track_count: 3,
          duration: 720000, // 12 minutes in milliseconds
          artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          permalink_url: '#',
          is_public: true,
          created_at: new Date().toISOString(),
          tracks: [
            {
              id: 'track-1',
              title: 'Amazing Grace',
              artist: 'Spelman Glee Club',
              audioUrl: '#', // Would be actual audio URL
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 240,
              waveformData: [],
              likes: 328,
              plays: 2150,
              isLiked: false,
              genre: 'Spiritual',
              uploadDate: new Date().toISOString(),
              description: 'Traditional spiritual arranged for choir',
              permalink_url: '#'
            },
            {
              id: 'track-2',
              title: 'Lift Every Voice and Sing',
              artist: 'Spelman Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 300,
              waveformData: [],
              likes: 445,
              plays: 3200,
              isLiked: false,
              genre: 'Anthem',
              uploadDate: new Date().toISOString(),
              description: 'The Black National Anthem',
              permalink_url: '#'
            },
            {
              id: 'track-3',
              title: 'Wade in the Water',
              artist: 'Spelman Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 180,
              waveformData: [],
              likes: 267,
              plays: 1890,
              isLiked: false,
              genre: 'Spiritual',
              uploadDate: new Date().toISOString(),
              description: 'Traditional spiritual with modern arrangement',
              permalink_url: '#'
            }
          ]
        },
        {
          id: 'classical-playlist-2',
          name: 'Classical Repertoire',
          description: 'Beautiful classical pieces from our concert season',
          track_count: 2,
          duration: 480000, // 8 minutes
          artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          permalink_url: '#',
          is_public: true,
          created_at: new Date().toISOString(),
          tracks: [
            {
              id: 'track-4',
              title: 'Ave Maria',
              artist: 'Spelman Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 240,
              waveformData: [],
              likes: 156,
              plays: 980,
              isLiked: false,
              genre: 'Classical',
              uploadDate: new Date().toISOString(),
              description: 'Schubert\'s Ave Maria performed by our soprano section',
              permalink_url: '#'
            },
            {
              id: 'track-5',
              title: 'O Come, O Come Emmanuel',
              artist: 'Spelman Glee Club',
              audioUrl: '#',
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 240,
              waveformData: [],
              likes: 89,
              plays: 567,
              isLiked: false,
              genre: 'Sacred',
              uploadDate: new Date().toISOString(),
              description: 'Traditional advent hymn',
              permalink_url: '#'
            }
          ]
        }
      ],
      tracks: [],
      note: 'Using demo content - SoundCloud integration coming soon'
    }

    console.log('Returning mock SoundCloud data with', mockData.playlists.length, 'playlists')
    
    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SoundCloud API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        playlists: [],
        tracks: [],
        note: 'Error loading SoundCloud content'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 with error data instead of 500
      }
    )
  }
})
