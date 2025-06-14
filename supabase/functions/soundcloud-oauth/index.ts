
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('SoundCloud OAuth function invoked', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    
    const soundcloudClientId = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const soundcloudClientSecret = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')
    
    if (!soundcloudClientId || !soundcloudClientSecret) {
      console.error('SoundCloud credentials not found')
      return new Response(
        JSON.stringify({ error: 'SoundCloud credentials not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Generate OAuth authorization URL
    if (action === 'authorize') {
      const redirectUri = `${url.origin}/admin/music?callback=soundcloud`
      const scope = 'non-expiring'
      const state = crypto.randomUUID() // Generate random state for security
      
      const authUrl = new URL('https://soundcloud.com/connect')
      authUrl.searchParams.set('client_id', soundcloudClientId)
      authUrl.searchParams.set('redirect_uri', redirectUri)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', scope)
      authUrl.searchParams.set('state', state)
      
      console.log('Generated OAuth URL:', authUrl.toString())
      
      return new Response(
        JSON.stringify({ 
          authUrl: authUrl.toString(),
          state: state,
          redirectUri: redirectUri
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Exchange authorization code for access token
    if (action === 'exchange' && req.method === 'POST') {
      const body = await req.json()
      const { code, redirectUri } = body
      
      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Authorization code is required' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }
      
      console.log('Exchanging authorization code for access token')
      
      const tokenResponse = await fetch('https://api.soundcloud.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          'grant_type': 'authorization_code',
          'client_id': soundcloudClientId,
          'client_secret': soundcloudClientSecret,
          'redirect_uri': redirectUri,
          'code': code
        })
      })

      console.log('Token exchange response status:', tokenResponse.status)
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error('Token exchange failed:', errorText)
        return new Response(
          JSON.stringify({ error: 'Failed to exchange authorization code', details: errorText }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      const tokenData = await tokenResponse.json()
      console.log('Token exchange successful')
      
      // Fetch user data with the access token
      const userResponse = await fetch('https://api.soundcloud.com/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        }
      })

      if (!userResponse.ok) {
        console.error('Failed to fetch user data')
        return new Response(
          JSON.stringify({ error: 'Failed to fetch user data' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      const userData = await userResponse.json()
      console.log('User data fetched successfully:', userData.username)

      return new Response(
        JSON.stringify({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresIn: tokenData.expires_in,
          user: {
            id: userData.id,
            username: userData.username,
            display_name: userData.full_name || userData.username,
            avatar_url: userData.avatar_url,
            followers_count: userData.followers_count,
            followings_count: userData.followings_count,
            track_count: userData.track_count,
            playlist_count: userData.playlist_count
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Fetch user's tracks and playlists with access token
    if (action === 'fetch-data' && req.method === 'POST') {
      const body = await req.json()
      const { accessToken } = body
      
      if (!accessToken) {
        return new Response(
          JSON.stringify({ error: 'Access token is required' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      console.log('Fetching user data with access token')

      // Fetch user's tracks and playlists
      const [tracksResponse, playlistsResponse] = await Promise.all([
        fetch('https://api.soundcloud.com/me/tracks?limit=50', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        }),
        fetch('https://api.soundcloud.com/me/playlists?limit=50', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
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

      // Transform tracks data
      const transformedTracks = tracksData.map((track: any) => ({
        id: track.id.toString(),
        title: track.title || 'Untitled Track',
        artist: track.user?.username || 'Unknown Artist',
        permalink_url: track.permalink_url || '',
        artwork_url: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
        duration: Math.floor((track.duration || 0) / 1000),
        likes: track.likes_count || 0,
        plays: track.playback_count || 0,
        genre: track.genre || 'Unknown',
        uploadDate: track.created_at ? new Date(track.created_at).toISOString().split('T')[0] : '',
        description: track.description || '',
        embeddable_by: track.embeddable_by || 'all',
        stream_url: track.stream_url || ''
      }))

      // Transform playlists data
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
        tracks: playlist.tracks || []
      }))

      return new Response(
        JSON.stringify({
          tracks: transformedTracks,
          playlists: transformedPlaylists,
          status: 'success',
          message: `Successfully loaded ${transformedTracks.length} tracks and ${transformedPlaylists.length} playlists`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action or method' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )

  } catch (error) {
    console.error('SoundCloud OAuth Error:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
