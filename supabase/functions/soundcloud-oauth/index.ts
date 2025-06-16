
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
    let requestBody: any = {}
    
    if (req.method === 'POST') {
      try {
        requestBody = await req.json()
        console.log('POST request body:', requestBody)
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
    }
    
    const finalAction = action || requestBody.action
    console.log('Processing action:', finalAction)
    
    const soundcloudClientId = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const soundcloudClientSecret = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')
    
    console.log('Environment check:')
    console.log('SOUNDCLOUD_CLIENT_ID present:', !!soundcloudClientId)
    console.log('SOUNDCLOUD_CLIENT_SECRET present:', !!soundcloudClientSecret)
    
    if (!soundcloudClientId) {
      console.error('SoundCloud Client ID not found')
      return new Response(
        JSON.stringify({ 
          error: 'SoundCloud Client ID not configured. Please add SOUNDCLOUD_CLIENT_ID to your environment variables.',
          needsSetup: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    if (!soundcloudClientSecret && (finalAction === 'callback' || finalAction === 'exchange' || finalAction === 'fetch-data')) {
      console.error('SoundCloud Client Secret not found for action requiring authentication')
      return new Response(
        JSON.stringify({ 
          error: 'SoundCloud Client Secret not configured. Please add SOUNDCLOUD_CLIENT_SECRET to your environment variables.',
          needsSetup: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Generate OAuth authorization URL
    if (finalAction === 'authorize') {
      const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/')
      console.log('Request origin:', origin)
      
      // FIXED: Use the correct callback HTML file path
      const redirectUri = `${origin}/soundcloud-callback.html`
      const state = crypto.randomUUID()
      
      console.log('Generated redirect URI:', redirectUri)
      
      // Use the correct SoundCloud OAuth URL with proper scope
      const authUrl = new URL('https://secure.soundcloud.com/connect')
      authUrl.searchParams.set('client_id', soundcloudClientId)
      authUrl.searchParams.set('redirect_uri', redirectUri)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', 'non-expiring')
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

    // Handle OAuth callback - check both URL params and request body
    const code = url.searchParams.get('code') || requestBody.code
    const state = url.searchParams.get('state') || requestBody.state
    
    if (finalAction === 'callback' || code) {
      console.log('Processing OAuth callback')
      console.log('Code present:', !!code)
      console.log('State present:', !!state)
      
      if (!code) {
        console.error('No authorization code provided')
        return new Response(
          JSON.stringify({ 
            error: 'No authorization code provided in callback'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      // Use the same redirect URI for token exchange (the callback HTML file)
      const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/')
      const redirectUri = `${origin}/soundcloud-callback.html`
      
      console.log('Token exchange - using redirect URI:', redirectUri)
      
      try {
        // Prepare the token exchange request with proper format
        const tokenUrl = 'https://api.soundcloud.com/oauth2/token'
        console.log('Making token exchange request to:', tokenUrl)
        
        const formData = new FormData()
        formData.append('grant_type', 'authorization_code')
        formData.append('client_id', soundcloudClientId)
        formData.append('client_secret', soundcloudClientSecret!)
        formData.append('redirect_uri', redirectUri)
        formData.append('code', code)
        
        const tokenResponse = await fetch(tokenUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Spelman-Glee-Club-App/1.0',
          }
        })

        console.log('Token exchange response status:', tokenResponse.status)
        console.log('Token exchange response headers:', Object.fromEntries(tokenResponse.headers.entries()))
        
        const responseText = await tokenResponse.text()
        console.log('Token exchange raw response:', responseText)
        
        if (!tokenResponse.ok) {
          console.error('Token exchange failed with status:', tokenResponse.status)
          console.error('Token exchange error response:', responseText)
          
          return new Response(
            JSON.stringify({ 
              error: 'Failed to exchange authorization code for access token', 
              details: responseText,
              status: tokenResponse.status,
              url: tokenUrl,
              hint: 'Check if your SoundCloud app credentials are correct and the redirect URI matches'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          )
        }

        let tokenData
        try {
          tokenData = JSON.parse(responseText)
          console.log('Token data parsed successfully:', Object.keys(tokenData))
        } catch (parseError) {
          console.error('Failed to parse token response as JSON:', parseError)
          return new Response(
            JSON.stringify({ 
              error: 'Invalid JSON response from SoundCloud token endpoint',
              details: responseText
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500 
            }
          )
        }
        
        if (!tokenData.access_token) {
          console.error('No access token in response:', tokenData)
          return new Response(
            JSON.stringify({ 
              error: 'No access token received from SoundCloud',
              details: tokenData
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          )
        }
        
        console.log('Token exchange successful, fetching user data...')
        
        // Fetch user data with the access token
        const userResponse = await fetch('https://api.soundcloud.com/me', {
          headers: {
            'Authorization': `OAuth ${tokenData.access_token}`,
            'Accept': 'application/json',
            'User-Agent': 'Spelman-Glee-Club-App/1.0',
          }
        })

        console.log('User data response status:', userResponse.status)
        
        if (!userResponse.ok) {
          const errorText = await userResponse.text()
          console.error('Failed to fetch user data:', errorText)
          return new Response(
            JSON.stringify({ 
              error: 'Failed to fetch user data after successful token exchange', 
              details: errorText,
              status: userResponse.status
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          )
        }

        const userData = await userResponse.json()
        console.log('User data fetched successfully:', userData.username)

        // Return success with user data and tokens
        return new Response(
          JSON.stringify({
            success: true,
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

    // Fetch user data with existing access token
    if (finalAction === 'fetch-data') {
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
      
      try {
        // Fetch tracks and playlists
        const [tracksResponse, playlistsResponse] = await Promise.all([
          fetch('https://api.soundcloud.com/me/tracks?limit=20', {
            headers: {
              'Authorization': `OAuth ${accessToken}`,
              'Accept': 'application/json',
              'User-Agent': 'Spelman-Glee-Club-App/1.0',
            }
          }),
          fetch('https://api.soundcloud.com/me/playlists?limit=10', {
            headers: {
              'Authorization': `OAuth ${accessToken}`,
              'Accept': 'application/json',
              'User-Agent': 'Spelman-Glee-Club-App/1.0',
            }
          })
        ])

        let tracks = []
        let playlists = []

        if (tracksResponse.ok) {
          const tracksData = await tracksResponse.json()
          tracks = tracksData.map((track: any) => ({
            id: track.id.toString(),
            title: track.title || 'Untitled Track',
            artist: track.user?.username || 'Unknown Artist',
            stream_url: track.stream_url,
            artwork_url: track.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
            duration: Math.floor((track.duration || 0) / 1000),
            likes: track.likes_count || 0,
            plays: track.playback_count || 0,
            genre: track.genre || 'Music',
            uploadDate: track.created_at ? new Date(track.created_at).toISOString().split('T')[0] : '',
            description: track.description || '',
            permalink_url: track.permalink_url || ''
          }))
        }

        if (playlistsResponse.ok) {
          const playlistsData = await playlistsResponse.json()
          playlists = playlistsData.map((playlist: any) => ({
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
        }

        return new Response(
          JSON.stringify({
            tracks,
            playlists,
            status: 'success'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      } catch (error) {
        console.error('Error fetching user data:', error)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to fetch user data', 
            details: error instanceof Error ? error.message : 'Unknown error' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        error: `Invalid action "${finalAction}" or method "${req.method}"`,
        availableActions: ['authorize', 'callback', 'fetch-data'],
        receivedAction: finalAction,
        method: req.method
      }),
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
