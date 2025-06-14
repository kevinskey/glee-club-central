
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
    // Get action from request body for POST requests, URL params for GET requests
    let action: string | null = null
    let requestBody: any = {}
    
    if (req.method === 'POST') {
      try {
        requestBody = await req.json()
        action = requestBody.action
        console.log('POST request action:', action)
      } catch (e) {
        console.error('Failed to parse JSON body:', e)
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }
    } else {
      const url = new URL(req.url)
      action = url.searchParams.get('action')
      console.log('GET request action:', action)
    }
    
    console.log('Processing action:', action)
    console.log('Request body:', requestBody)
    
    const soundcloudClientId = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const soundcloudClientSecret = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')
    
    console.log('Environment check:')
    console.log('SOUNDCLOUD_CLIENT_ID present:', !!soundcloudClientId)
    console.log('SOUNDCLOUD_CLIENT_SECRET present:', !!soundcloudClientSecret)
    
    if (!soundcloudClientId) {
      console.error('SoundCloud Client ID not found')
      return new Response(
        JSON.stringify({ error: 'SoundCloud Client ID not configured. Please add SOUNDCLOUD_CLIENT_ID to your environment variables.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    if (!soundcloudClientSecret && (action === 'exchange' || action === 'fetch-data')) {
      console.error('SoundCloud Client Secret not found for action requiring authentication')
      return new Response(
        JSON.stringify({ error: 'SoundCloud Client Secret not configured. Please add SOUNDCLOUD_CLIENT_SECRET to your environment variables.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Generate OAuth authorization URL
    if (action === 'authorize') {
      // Use the current origin from the request
      const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://gleeworld.org'
      const redirectUri = `${origin}/admin/music?callback=soundcloud`
      const scope = 'non-expiring'
      const state = crypto.randomUUID()
      
      const authUrl = new URL('https://soundcloud.com/connect')
      authUrl.searchParams.set('client_id', soundcloudClientId)
      authUrl.searchParams.set('redirect_uri', redirectUri)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', scope)
      authUrl.searchParams.set('state', state)
      
      console.log('Generated OAuth URL:', authUrl.toString())
      console.log('Redirect URI:', redirectUri)
      
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
      const { code, redirectUri } = requestBody
      
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
      console.log('Code:', code.substring(0, 10) + '...')
      console.log('Redirect URI:', redirectUri)
      
      try {
        const tokenResponse = await fetch('https://api.soundcloud.com/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'client_id': soundcloudClientId,
            'client_secret': soundcloudClientSecret!,
            'redirect_uri': redirectUri,
            'code': code
          })
        })

        console.log('Token exchange response status:', tokenResponse.status)
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          console.error('Token exchange failed:', errorText)
          return new Response(
            JSON.stringify({ 
              error: 'Failed to exchange authorization code', 
              details: errorText,
              status: tokenResponse.status 
            }),
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
          const errorText = await userResponse.text()
          console.error('Failed to fetch user data:', errorText)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch user data', details: errorText }),
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
              followers_count: userData.followers_count || 0,
              followings_count: userData.followings_count || 0,
              track_count: userData.track_count || 0,
              playlist_count: userData.playlist_count || 0
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      } catch (fetchError) {
        console.error('Network error during token exchange:', fetchError)
        return new Response(
          JSON.stringify({ 
            error: 'Network error during authentication', 
            details: fetchError instanceof Error ? fetchError.message : 'Unknown network error' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }
    }

    // Fetch user's tracks and playlists with access token
    if (action === 'fetch-data' && req.method === 'POST') {
      const { accessToken } = requestBody
      
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

      try {
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
          console.warn('Failed to fetch tracks:', tracksResponse.status, await tracksResponse.text())
        }

        if (playlistsResponse.ok) {
          playlistsData = await playlistsResponse.json()
          console.log('Playlists fetched:', playlistsData.length)
        } else {
          console.warn('Failed to fetch playlists:', playlistsResponse.status, await playlistsResponse.text())
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
      } catch (fetchError) {
        console.error('Error fetching user data:', fetchError)
        return new Response(
          JSON.stringify({
            error: 'Failed to fetch SoundCloud data',
            details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: `Invalid action "${action}" or method "${req.method}"` }),
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
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
