
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
      console.error('SoundCloud Client ID not found in environment')
      return new Response(
        JSON.stringify({
          playlists: [],
          tracks: [],
          status: 'error',
          message: 'SoundCloud Client ID is not configured. Please add your SoundCloud Client ID to the edge function secrets.',
          errorType: 'missing_credentials',
          requiresAuth: true
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
    
    // Try to resolve user by username first
    const resolveUrl = `https://api.soundcloud.com/resolve?url=https://soundcloud.com/doctorkj&client_id=${soundcloudClientId}`
    
    console.log('Attempting to resolve SoundCloud user...')
    const resolveResponse = await fetch(resolveUrl, {
      headers: {
        'User-Agent': 'Spelman Glee Club Music App/1.0',
        'Accept': 'application/json'
      }
    })
    
    console.log('Resolve response status:', resolveResponse.status)
    console.log('Resolve response headers:', Object.fromEntries(resolveResponse.headers.entries()))
    
    if (!resolveResponse.ok) {
      const errorText = await resolveResponse.text()
      console.error('Failed to resolve user:', resolveResponse.status, errorText)
      
      let errorMessage = 'Unable to access SoundCloud data.'
      let errorType = 'api_error'
      
      if (resolveResponse.status === 401) {
        errorMessage = 'Invalid SoundCloud Client ID. Please check your credentials in the edge function secrets.'
        errorType = 'invalid_credentials'
      } else if (resolveResponse.status === 403) {
        errorMessage = 'SoundCloud API access denied. The API may require OAuth authentication or the Client ID may not have proper permissions.'
        errorType = 'access_denied'
      } else if (resolveResponse.status === 404) {
        errorMessage = 'SoundCloud user "doctorkj" not found. Please verify the username is correct.'
        errorType = 'user_not_found'
      } else if (resolveResponse.status === 429) {
        errorMessage = 'SoundCloud API rate limit exceeded. Please try again later.'
        errorType = 'rate_limit'
      }
      
      return new Response(
        JSON.stringify({
          playlists: [],
          tracks: [],
          status: 'error',
          message: errorMessage,
          errorType: errorType,
          httpStatus: resolveResponse.status,
          requiresAuth: true,
          details: errorText
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

    // Try to fetch tracks
    const tracksUrl = `https://api.soundcloud.com/users/${userData.id}/tracks?client_id=${soundcloudClientId}&limit=50`
    
    console.log('Fetching user tracks...')
    const tracksResponse = await fetch(tracksUrl, {
      headers: {
        'User-Agent': 'Spelman Glee Club Music App/1.0',
        'Accept': 'application/json'
      }
    })

    let tracksData = []
    if (tracksResponse.ok) {
      tracksData = await tracksResponse.json()
      console.log('Tracks fetched successfully:', tracksData.length)
    } else {
      const errorText = await tracksResponse.text()
      console.warn('Failed to fetch tracks:', tracksResponse.status, errorText)
    }

    // Try to fetch playlists
    const playlistsUrl = `https://api.soundcloud.com/users/${userData.id}/playlists?client_id=${soundcloudClientId}&limit=50`
    
    console.log('Fetching user playlists...')
    const playlistsResponse = await fetch(playlistsUrl, {
      headers: {
        'User-Agent': 'Spelman Glee Club Music App/1.0',
        'Accept': 'application/json'
      }
    })

    let playlistsData = []
    if (playlistsResponse.ok) {
      playlistsData = await playlistsResponse.json()
      console.log('Playlists fetched successfully:', playlistsData.length)
    } else {
      const errorText = await playlistsResponse.text()
      console.warn('Failed to fetch playlists:', playlistsResponse.status, errorText)
    }

    // Transform the real data to match our expected format
    const transformedTracks = tracksData.map((track: any) => ({
      id: track.id.toString(),
      title: track.title || 'Untitled Track',
      artist: track.user?.username || 'Unknown Artist',
      audioUrl: track.stream_url ? `${track.stream_url}?client_id=${soundcloudClientId}` : '',
      albumArt: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
      duration: Math.floor((track.duration || 0) / 1000), // Convert ms to seconds
      waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
      likes: track.likes_count || 0,
      plays: track.playback_count || 0,
      isLiked: false,
      genre: track.genre || 'Unknown',
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
      tracks: [] // Would need separate API calls to get track details
    }))

    console.log('SoundCloud data processed successfully')
    console.log('Final result:', {
      tracksCount: transformedTracks.length,
      playlistsCount: transformedPlaylists.length
    })
    
    return new Response(
      JSON.stringify({
        playlists: transformedPlaylists,
        tracks: transformedTracks,
        status: 'success',
        message: `Successfully loaded ${transformedTracks.length} tracks and ${transformedPlaylists.length} playlists from SoundCloud.`,
        isRealData: true,
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

  } catch (error) {
    console.error('SoundCloud API Error:', error)
    
    return new Response(
      JSON.stringify({
        playlists: [],
        tracks: [],
        status: 'error',
        message: 'Failed to connect to SoundCloud API. Please check your network connection and API credentials.',
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: 'network_error',
        requiresAuth: true
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
