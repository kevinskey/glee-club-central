
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

    if (!soundcloudClientSecret && (finalAction === 'exchange' || finalAction === 'fetch-data')) {
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
      const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://gleeworld.org'
      const redirectUri = `${origin}/admin/music`
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
            error: 'No authorization code provided in callback',
            redirect: '/admin/music?error=no_code'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      // Use the origin to construct redirect URI
      const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://gleeworld.org'
      const redirectUri = `${origin}/admin/music`
      
      console.log('Exchanging code for access token')
      console.log('Using redirect URI:', redirectUri)
      
      try {
        const tokenResponse = await fetch('https://api.soundcloud.com/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'Spelman Glee Club Music App/1.0',
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
          
          // Redirect to admin page with error
          return new Response(
            JSON.stringify({ 
              error: 'Failed to exchange authorization code for access token', 
              details: errorText,
              status: tokenResponse.status,
              redirect: '/admin/music?error=token_exchange_failed'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          )
        }

        const tokenData = await tokenResponse.json()
        console.log('Token exchange successful, fetching user data...')
        
        // Fetch user data with the access token
        const userResponse = await fetch('https://api.soundcloud.com/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json',
            'User-Agent': 'Spelman Glee Club Music App/1.0',
          }
        })

        if (!userResponse.ok) {
          const errorText = await userResponse.text()
          console.error('Failed to fetch user data:', errorText)
          return new Response(
            JSON.stringify({ 
              error: 'Failed to fetch user data after successful token exchange', 
              details: errorText,
              redirect: '/admin/music?error=user_fetch_failed'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          )
        }

        const userData = await userResponse.json()
        console.log('User data fetched successfully:', userData.username)

        // Return success with redirect
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
            },
            redirect: '/admin/music?success=connected'
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
            details: fetchError instanceof Error ? fetchError.message : 'Unknown network error',
            redirect: '/admin/music?error=network_error'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }
    }

    // Exchange authorization code for access token (alternative endpoint)
    if (finalAction === 'exchange' && req.method === 'POST') {
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
      
      console.log('Exchanging authorization code for access token (POST)')
      
      try {
        const tokenResponse = await fetch('https://api.soundcloud.com/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'Spelman Glee Club Music App/1.0',
          },
          body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'client_id': soundcloudClientId,
            'client_secret': soundcloudClientSecret!,
            'redirect_uri': redirectUri,
            'code': code
          })
        })

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
        
        // Fetch user data
        const userResponse = await fetch('https://api.soundcloud.com/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json',
            'User-Agent': 'Spelman Glee Club Music App/1.0',
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

    return new Response(
      JSON.stringify({ 
        error: `Invalid action "${finalAction}" or method "${req.method}"`,
        availableActions: ['authorize', 'callback', 'exchange'],
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
        message: error instanceof Error ? error.message : 'Unknown error',
        redirect: '/admin/music?error=internal_error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
