
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
    // SoundCloud username to fetch data from
    const soundcloudUsername = 'doctorkj'
    
    console.log('Fetching SoundCloud data for user:', soundcloudUsername)
    
    // Use SoundCloud's widget API which doesn't require authentication
    const widgetApiUrl = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/${soundcloudUsername}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`
    
    // For demo purposes, let's create some mock data that represents what we might get
    // In a real implementation, you'd need to either:
    // 1. Use SoundCloud's OAuth flow for authenticated access
    // 2. Parse the widget HTML to extract track information
    // 3. Use the SoundCloud Go+ API (requires payment)
    
    const mockPlaylists = [
      {
        id: "playlist_1",
        name: "Spelman Glee Club Classics",
        description: "A collection of our most beloved performances",
        track_count: 8,
        duration: 1800000, // 30 minutes in milliseconds
        artwork_url: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        permalink_url: `https://soundcloud.com/${soundcloudUsername}/sets/classics`,
        is_public: true,
        created_at: "2024-01-15T00:00:00Z",
        tracks: [
          {
            id: "track_1",
            title: "Amazing Grace",
            artist: "Spelman College Glee Club",
            audioUrl: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            duration: 240,
            waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
            likes: 150,
            plays: 2500,
            isLiked: false,
            genre: "Gospel",
            uploadDate: "2024-01-15",
            description: "Beautiful rendition of Amazing Grace",
            permalink_url: `https://soundcloud.com/${soundcloudUsername}/amazing-grace`
          },
          {
            id: "track_2",
            title: "Lift Every Voice and Sing",
            artist: "Spelman College Glee Club",
            audioUrl: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            duration: 300,
            waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
            likes: 200,
            plays: 3200,
            isLiked: false,
            genre: "Spiritual",
            uploadDate: "2024-01-20",
            description: "The Black National Anthem performed with passion",
            permalink_url: `https://soundcloud.com/${soundcloudUsername}/lift-every-voice`
          }
        ]
      },
      {
        id: "playlist_2",
        name: "Holiday Concert 2024",
        description: "Songs from our winter holiday performance",
        track_count: 6,
        duration: 1500000, // 25 minutes
        artwork_url: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        permalink_url: `https://soundcloud.com/${soundcloudUsername}/sets/holiday-2024`,
        is_public: true,
        created_at: "2024-12-01T00:00:00Z",
        tracks: [
          {
            id: "track_3",
            title: "Silent Night",
            artist: "Spelman College Glee Club",
            audioUrl: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            duration: 220,
            waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
            likes: 180,
            plays: 2800,
            isLiked: false,
            genre: "Christmas",
            uploadDate: "2024-12-01",
            description: "Traditional Christmas carol",
            permalink_url: `https://soundcloud.com/${soundcloudUsername}/silent-night`
          }
        ]
      }
    ]

    const mockTracks = [
      {
        id: "track_4",
        title: "Wade in the Water",
        artist: "Spelman College Glee Club",
        audioUrl: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        duration: 280,
        waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
        likes: 320,
        plays: 4500,
        isLiked: false,
        genre: "Spiritual",
        uploadDate: "2024-02-14",
        description: "Traditional African American spiritual",
        permalink_url: `https://soundcloud.com/${soundcloudUsername}/wade-in-the-water`
      },
      {
        id: "track_5",
        title: "Precious Lord",
        artist: "Spelman College Glee Club",
        audioUrl: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        duration: 260,
        waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
        likes: 275,
        plays: 3800,
        isLiked: false,
        genre: "Gospel",
        uploadDate: "2024-03-10",
        description: "Thomas Dorsey's beloved gospel hymn",
        permalink_url: `https://soundcloud.com/${soundcloudUsername}/precious-lord`
      }
    ]

    console.log('Mock data prepared successfully')

    const responseData = {
      playlists: mockPlaylists,
      tracks: mockTracks,
      status: 'success',
      message: `Successfully loaded demo SoundCloud content for ${soundcloudUsername}. Note: Due to SoundCloud API changes requiring OAuth, this is demonstration data.`
    }

    console.log('SoundCloud demo data processed successfully')
    
    return new Response(
      JSON.stringify(responseData),
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
    
    const errorResponse = {
      playlists: [],
      tracks: [],
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to load SoundCloud content',
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
