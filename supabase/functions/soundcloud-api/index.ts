
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
    const soundcloudClientId = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const soundcloudClientSecret = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')
    
    console.log('Environment check:')
    console.log('SOUNDCLOUD_CLIENT_ID present:', !!soundcloudClientId)
    console.log('SOUNDCLOUD_CLIENT_SECRET present:', !!soundcloudClientSecret)
    
    if (!soundcloudClientId) {
      console.error('SoundCloud Client ID not found')
      return new Response(
        JSON.stringify({
          playlists: [],
          tracks: [],
          status: 'error',
          message: 'SoundCloud API credentials are not properly configured. Please add SOUNDCLOUD_CLIENT_ID to the edge function secrets.',
          errorType: 'missing_credentials'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      )
    }

    console.log('Using Client ID:', soundcloudClientId.substring(0, 8) + '...')
    
    // Try to resolve the user first with basic client_id
    const resolveUrl = `https://api.soundcloud.com/resolve?url=https://soundcloud.com/spelman-glee&client_id=${soundcloudClientId}`
    
    console.log('Attempting to resolve Spelman Glee Club profile...')
    const resolveResponse = await fetch(resolveUrl, {
      headers: {
        'User-Agent': 'Spelman Glee Club Music App/1.0',
        'Accept': 'application/json'
      }
    })
    
    console.log('Resolve response status:', resolveResponse.status)
    
    if (!resolveResponse.ok) {
      const errorText = await resolveResponse.text()
      console.error('Failed to resolve user:', resolveResponse.status, errorText)
      
      // Return mock data for development/demo purposes
      const mockTracks = [
        {
          id: "demo-1",
          title: "Amazing Grace",
          artist: "Spelman College Glee Club",
          audioUrl: "/api/placeholder/audio1.mp3",
          albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
          duration: 240,
          waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
          likes: 1250,
          plays: 15420,
          isLiked: false,
          genre: "Gospel",
          uploadDate: "2024-01-15",
          description: "A beautiful rendition of the classic hymn",
          permalink_url: "https://soundcloud.com/spelman-glee/amazing-grace"
        },
        {
          id: "demo-2", 
          title: "Lift Every Voice and Sing",
          artist: "Spelman College Glee Club",
          audioUrl: "/api/placeholder/audio2.mp3",
          albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
          duration: 195,
          waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
          likes: 890,
          plays: 12300,
          isLiked: false,
          genre: "Traditional",
          uploadDate: "2024-02-01",
          description: "The Black National Anthem performed by our talented choir",
          permalink_url: "https://soundcloud.com/spelman-glee/lift-every-voice"
        },
        {
          id: "demo-3",
          title: "Wade in the Water",
          artist: "Spelman College Glee Club", 
          audioUrl: "/api/placeholder/audio3.mp3",
          albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
          duration: 280,
          waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
          likes: 765,
          plays: 9840,
          isLiked: false,
          genre: "Spiritual",
          uploadDate: "2024-01-28",
          description: "Traditional spiritual with contemporary arrangements",
          permalink_url: "https://soundcloud.com/spelman-glee/wade-in-the-water"
        }
      ]

      const mockPlaylists = [
        {
          id: "playlist-1",
          name: "Featured Performances 2024",
          description: "Our best performances from this year",
          track_count: 8,
          duration: 1920000,
          artwork_url: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
          permalink_url: "https://soundcloud.com/spelman-glee/sets/featured-2024",
          is_public: true,
          created_at: "2024-01-01T00:00:00Z",
          tracks: []
        }
      ]

      return new Response(
        JSON.stringify({
          playlists: mockPlaylists,
          tracks: mockTracks,
          status: 'demo_mode',
          message: `Demo mode active - using sample tracks. SoundCloud API returned: ${resolveResponse.status}`,
          isRealData: false,
          authMethod: 'demo'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      )
    }

    const userData = await resolveResponse.json()
    console.log('User resolved successfully:', userData.id, userData.username)

    // Fetch tracks and playlists
    const tracksUrl = `https://api.soundcloud.com/users/${userData.id}/tracks?client_id=${soundcloudClientId}&limit=20`
    const playlistsUrl = `https://api.soundcloud.com/users/${userData.id}/playlists?client_id=${soundcloudClientId}&limit=10`

    const [tracksResponse, playlistsResponse] = await Promise.all([
      fetch(tracksUrl, {
        headers: {
          'User-Agent': 'Spelman Glee Club Music App/1.0',
          'Accept': 'application/json'
        }
      }),
      fetch(playlistsUrl, {
        headers: {
          'User-Agent': 'Spelman Glee Club Music App/1.0',
          'Accept': 'application/json'
        }
      })
    ])

    let tracksData = []
    let playlistsData = []

    if (tracksResponse.ok) {
      tracksData = await tracksResponse.json()
      console.log('Tracks fetched successfully:', tracksData.length)
    } else {
      console.warn('Failed to fetch tracks:', tracksResponse.status)
    }

    if (playlistsResponse.ok) {
      playlistsData = await playlistsResponse.json()
      console.log('Playlists fetched successfully:', playlistsData.length)
    } else {
      console.warn('Failed to fetch playlists:', playlistsResponse.status)
    }

    // Transform data to match our interface
    const transformedTracks = tracksData.map((track: any) => ({
      id: track.id.toString(),
      title: track.title || 'Untitled Track',
      artist: track.user?.username || 'Spelman College Glee Club',
      audioUrl: track.stream_url ? `${track.stream_url}?client_id=${soundcloudClientId}` : '',
      albumArt: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
      duration: Math.floor((track.duration || 0) / 1000),
      waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
      likes: track.likes_count || 0,
      plays: track.playback_count || 0,
      isLiked: false,
      genre: track.genre || 'Music',
      uploadDate: track.created_at ? new Date(track.created_at).toISOString().split('T')[0] : '',
      description: track.description || '',
      permalink_url: track.permalink_url || ''
    }))

    const transformedPlaylists = playlistsData.map((playlist: any) => ({
      id: playlist.id.toString(),
      name: playlist.title || 'Untitled Playlist',
      description: playlist.description || '',
      track_count: playlist.track_count || 0,
      duration: playlist.duration || 0,
      artwork_url: playlist.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
      permalink_url: playlist.permalink_url || '',
      is_public: playlist.sharing === 'public',
      created_at: playlist.created_at || new Date().toISOString(),
      tracks: []
    }))

    console.log('SoundCloud data processed successfully')
    
    return new Response(
      JSON.stringify({
        playlists: transformedPlaylists,
        tracks: transformedTracks,
        status: 'success',
        message: `Successfully loaded ${transformedTracks.length} tracks and ${transformedPlaylists.length} playlists from SoundCloud API.`,
        isRealData: true,
        authMethod: 'client_id',
        userData: {
          id: userData.id,
          username: userData.username,
          display_name: userData.full_name || userData.username
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )
    
  } catch (err) {
    console.error('Unexpected error in SoundCloud API function:', err)
    
    return new Response(
      JSON.stringify({
        playlists: [],
        tracks: [],
        status: 'error',
        message: 'An unexpected error occurred while fetching SoundCloud data.',
        errorType: 'unexpected_error',
        details: err instanceof Error ? err.message : 'Unknown error'
      }),
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
