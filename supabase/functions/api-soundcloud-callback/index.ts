
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('SoundCloud API callback function invoked', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const errorDescription = url.searchParams.get('error_description')
    
    console.log('Callback parameters:')
    console.log('- Code present:', !!code)
    console.log('- Error:', error)
    
    const soundcloudClientId = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const soundcloudClientSecret = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')
    
    if (!soundcloudClientId || !soundcloudClientSecret) {
      console.error('Missing SoundCloud credentials')
      return Response.redirect(`${url.origin}/admin/music?error=missing_credentials`, 302)
    }
    
    // Handle OAuth errors
    if (error) {
      const errorMsg = errorDescription || error
      console.error('OAuth error:', errorMsg)
      return Response.redirect(`${url.origin}/admin/music?error=soundcloud_auth_failed&details=${encodeURIComponent(errorMsg)}`, 302)
    }
    
    // Validate authorization code
    if (!code) {
      console.error('No authorization code received')
      return Response.redirect(`${url.origin}/admin/music?error=no_code`, 302)
    }
    
    const redirectUri = `${url.origin}/functions/v1/api-soundcloud-callback`
    
    console.log('Token exchange parameters:')
    console.log('- Redirect URI:', redirectUri)
    console.log('- Code:', code.substring(0, 10) + '...')
    
    // Exchange code for access token
    const tokenUrl = 'https://api.soundcloud.com/oauth2/token'
    const tokenData = new URLSearchParams()
    tokenData.append('grant_type', 'authorization_code')
    tokenData.append('client_id', soundcloudClientId)
    tokenData.append('client_secret', soundcloudClientSecret)
    tokenData.append('redirect_uri', redirectUri)
    tokenData.append('code', code)
    
    console.log('Making token exchange request...')
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      body: tokenData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Spelman-Glee-Club-App/1.0',
      }
    })
    
    console.log('Token response status:', tokenResponse.status)
    
    const responseText = await tokenResponse.text()
    console.log('Token response body:', responseText)
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', responseText)
      return Response.redirect(`${url.origin}/admin/music?error=token_exchange_failed&details=${encodeURIComponent(responseText)}`, 302)
    }
    
    let tokenDataParsed
    try {
      tokenDataParsed = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse token response:', parseError)
      return Response.redirect(`${url.origin}/admin/music?error=parse_error`, 302)
    }
    
    if (!tokenDataParsed.access_token) {
      console.error('No access token in response:', tokenDataParsed)
      return Response.redirect(`${url.origin}/admin/music?error=no_access_token`, 302)
    }
    
    console.log('Access token received successfully')
    
    // Fetch user data
    const userResponse = await fetch('https://api.soundcloud.com/me', {
      headers: {
        'Authorization': `OAuth ${tokenDataParsed.access_token}`,
        'Accept': 'application/json',
        'User-Agent': 'Spelman-Glee-Club-App/1.0',
      }
    })
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('Failed to fetch user data:', errorText)
      return Response.redirect(`${url.origin}/admin/music?error=user_data_failed`, 302)
    }
    
    const userData = await userResponse.json()
    console.log('User data fetched:', userData.username)
    
    // Create a response that stores tokens and redirects
    const redirectUrl = `${url.origin}/admin/music?connected=soundcloud&access_token=${tokenDataParsed.access_token}&user=${encodeURIComponent(JSON.stringify({
      id: userData.id,
      username: userData.username,
      display_name: userData.display_name || userData.username,
      avatar_url: userData.avatar_url || '',
      followers_count: userData.followers_count || 0,
      followings_count: userData.followings_count || 0,
      track_count: userData.track_count || 0,
      playlist_count: userData.playlist_count || 0
    }))}`
    
    // Log success for debugging
    console.log('Successfully processed SoundCloud OAuth callback')
    console.log('- Access token length:', tokenDataParsed.access_token.length)
    console.log('- User ID:', userData.id)
    console.log('- Username:', userData.username)
    
    return Response.redirect(redirectUrl, 302)
    
  } catch (error) {
    console.error('Callback processing error:', error)
    const origin = new URL(req.url).origin
    return Response.redirect(`${origin}/admin/music?error=server_error&details=${encodeURIComponent(error.message)}`, 302)
  }
})
