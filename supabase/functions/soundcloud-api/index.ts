
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
    
    if (!soundcloudClientId || !soundcloudClientSecret) {
      console.error('SoundCloud credentials not found in environment')
      return new Response(
        JSON.stringify({
          playlists: [],
          tracks: [],
          status: 'error',
          message: 'SoundCloud API credentials are not properly configured. Please add both SOUNDCLOUD_CLIENT_ID and SOUNDCLOUD_CLIENT_SECRET to the edge function secrets.',
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
    console.log('Using Client Secret:', soundcloudClientSecret ? 'present' : 'missing')
    
    // First, try to get an OAuth token using client credentials
    console.log('Attempting OAuth token exchange...')
    const tokenResponse = await fetch('https://api.soundcloud.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Spelman Glee Club Music App/1.0'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': soundcloudClientId,
        'client_secret': soundcloudClientSecret
      })
    })

    console.log('Token response status:', tokenResponse.status)
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('OAuth token failed:', tokenResponse.status, errorText)
      
      // Try with just client_id as fallback (some public endpoints might work)
      console.log('Trying fallback with client_id only...')
      
      const resolveUrl = `https://api.soundcloud.com/resolve?url=https://soundcloud.com/doctorkj&client_id=${soundcloudClientId}`
      
      const resolveResponse = await fetch(resolveUrl, {
        headers: {
          'User-Agent': 'Spelman Glee Club Music App/1.0',
          'Accept': 'application/json'
        }
      })
      
      console.log('Fallback resolve response status:', resolveResponse.status)
      
      if (!resolveResponse.ok) {
        const fallbackErrorText = await resolveResponse.text()
        console.error('Fallback also failed:', resolveResponse.status, fallbackErrorText)
        
        let errorMessage = 'Unable to access SoundCloud API with provided credentials.'
        let errorType = 'api_error'
        
        if (resolveResponse.status === 401) {
          errorMessage = 'SoundCloud API authentication failed. The provided Client ID and Secret may be invalid or the application may not have proper permissions.'
          errorType = 'invalid_credentials'
        } else if (resolveResponse.status === 403) {
          errorMessage = 'SoundCloud API access denied. This may require OAuth user consent or additional API permissions.'
          errorType = 'access_denied'
        } else if (resolveResponse.status === 404) {
          errorMessage = 'SoundCloud user "doctorkj" not found or not accessible with current credentials.'
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
            details: fallbackErrorText
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

      // If fallback worked, continue with client_id method
      const userData = await resolveResponse.json()
      console.log('User resolved via fallback:', userData.id, userData.username)

      // Continue with existing logic using client_id
      const tracksUrl = `https://api.soundcloud.com/users/${userData.id}/tracks?client_id=${soundcloudClientId}&limit=50`
      const playlistsUrl = `https://api.soundcloud.com/users/${userData.id}/playlists?client_id=${soundcloudClientId}&limit=50`

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
        console.log('Tracks fetched:', tracksData.length)
      } else {
        console.warn('Failed to fetch tracks:', tracksResponse.status)
      }

      if (playlistsResponse.ok) {
        playlistsData = await playlistsResponse.json()
        console.log('Playlists fetched:', playlistsData.length)
      } else {
        console.warn('Failed to fetch playlists:', playlistsResponse.status)
      }

      // Transform data
      const transformedTracks = tracksData.map((track: any) => ({
        id: track.id.toString(),
        title: track.title || 'Untitled Track',
        artist: track.user?.username || 'Unknown Artist',
        audioUrl: track.stream_url ? `${track.stream_url}?client_id=${soundcloudClientId}` : '',
        albumArt: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
        duration: Math.floor((track.duration || 0) / 1000),
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
        tracks: []
      }))

      return new Response(
        JSON.stringify({
          playlists: transformedPlaylists,
          tracks: transformedTracks,
          status: 'success',
          message: `Successfully loaded ${transformedTracks.length} tracks and ${transformedPlaylists.length} playlists from SoundCloud using fallback method.`,
          isRealData: true,
          authMethod: 'client_id_fallback',
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
    }

    // If OAuth token worked, use it for authenticated requests
    const tokenData = await tokenResponse.json()
    console.log('OAuth token obtained successfully')
    
    const accessToken = tokenData.access_token
    
    // Now make authenticated requests
    const resolveUrl = `https://api.soundcloud.com/resolve?url=https://soundcloud.com/doctorkj`
    
    console.log('Making authenticated resolve request...')
    const resolveResponse = await fetch(resolveUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Spelman Glee Club Music App/1.0',
        'Accept': 'application/json'
      }
    })
    
    console.log('Authenticated resolve response status:', resolveResponse.status)
    
    if (!resolveResponse.ok) {
      const errorText = await resolveResponse.text()
      console.error('Authenticated resolve failed:', resolveResponse.status, errorText)
      
      return new Response(
        JSON.stringify({
          playlists: [],
          tracks: [],
          status: 'error',
          message: 'Failed to resolve SoundCloud user with authenticated token.',
          errorType: 'resolve_failed',
          httpStatus: resolveResponse.status,
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
    console.log('User resolved with OAuth:', userData.id, userData.username)

    // Fetch tracks and playlists with OAuth token
    const tracksUrl = `https://api.soundcloud.com/users/${userData.id}/tracks?limit=50`
    const playlistsUrl = `https://api.soundcloud.com/users/${userData.id}/playlists?limit=50`

    const [tracksResponse, playlistsResponse] = await Promise.all([
      fetch(tracksUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'Spelman Glee Club Music App/1.0',
          'Accept': 'application/json'
        }
      }),
      fetch(playlistsUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'Spelman Glee Club Music App/1.0',
          'Accept': 'application/json'
        }
      })
    ])

    let tracksData = []
    let playlistsData = []

    if (tracksResponse.ok) {
      tracksData = await tracksResponse.json()
      console.log('OAuth tracks fetched:', tracksData.length)
    } else {
      const errorText = await tracksResponse.text()
      console.warn('Failed to fetch tracks with OAuth:', tracksResponse.status, errorText)
    }

    if (playlistsResponse.ok) {
      playlistsData = await playlistsResponse.json()
      console.log('OAuth playlists fetched:', playlistsData.length)
    } else {
      const errorText = await playlistsResponse.text()
      console.warn('Failed to fetch playlists with OAuth:', playlistsResponse.status, errorText)
    }

    // Transform data with OAuth access
    const transformedTracks = tracksData.map((track: any) => ({
      id: track.id.toString(),
      title: track.title || 'Untitled Track',
      artist: track.user?.username || 'Unknown Artist',
      audioUrl: track.stream_url || '',
      albumArt: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
      duration: Math.floor((track.duration || 0) / 1000),
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
      tracks: []
    }))

    console.log('SoundCloud data processed successfully with OAuth')
    
    return new Response(
      JSON.stringify({
        playlists: transformedPlaylists,
        tracks: transformedTracks,
        status: 'success',
        message: `Successfully loaded ${transformedTracks.length} tracks and ${transformedPlaylists.length} playlists from SoundCloud using OAuth authentication.`,
        isRealData: true,
        authMethod: 'oauth',
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
