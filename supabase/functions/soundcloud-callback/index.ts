
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('SoundCloud callback function invoked', req.method, req.url)
  
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
    const state = url.searchParams.get('state')
    
    console.log('Callback parameters:')
    console.log('- Code present:', !!code)
    console.log('- Error:', error)
    console.log('- State present:', !!state)
    
    const soundcloudClientId = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const soundcloudClientSecret = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')
    
    if (!soundcloudClientId || !soundcloudClientSecret) {
      console.error('Missing SoundCloud credentials')
      return new Response(
        generateErrorPage('Configuration Error', 'SoundCloud credentials not configured'),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 500 
        }
      )
    }
    
    // Handle OAuth errors
    if (error) {
      const errorMsg = errorDescription || error
      console.error('OAuth error:', errorMsg)
      return new Response(
        generateErrorPage('Authorization Failed', errorMsg),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 400 
        }
      )
    }
    
    // Validate authorization code
    if (!code) {
      console.error('No authorization code received')
      return new Response(
        generateErrorPage('Authorization Failed', 'No authorization code received'),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 400 
        }
      )
    }
    
    // Get the origin from the request
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/')
    const redirectUri = `${origin}/functions/v1/soundcloud-callback`
    
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
      return new Response(
        generateErrorPage('Token Exchange Failed', `Failed to exchange code for token: ${responseText}`),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 400 
        }
      )
    }
    
    let tokenData_parsed
    try {
      tokenData_parsed = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse token response:', parseError)
      return new Response(
        generateErrorPage('Parse Error', 'Invalid response from SoundCloud'),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 500 
        }
      )
    }
    
    if (!tokenData_parsed.access_token) {
      console.error('No access token in response:', tokenData_parsed)
      return new Response(
        generateErrorPage('Token Error', 'No access token received'),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 400 
        }
      )
    }
    
    console.log('Access token received successfully')
    
    // Fetch user data
    const userResponse = await fetch('https://api.soundcloud.com/me', {
      headers: {
        'Authorization': `OAuth ${tokenData_parsed.access_token}`,
        'Accept': 'application/json',
        'User-Agent': 'Spelman-Glee-Club-App/1.0',
      }
    })
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('Failed to fetch user data:', errorText)
      return new Response(
        generateErrorPage('User Data Error', 'Failed to fetch user profile'),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
          status: 400 
        }
      )
    }
    
    const userData = await userResponse.json()
    console.log('User data fetched:', userData.username)
    
    // Generate success page with tokens and redirect
    const successPage = generateSuccessPage(tokenData_parsed, userData, origin)
    
    return new Response(successPage, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      status: 200
    })
    
  } catch (error) {
    console.error('Callback processing error:', error)
    return new Response(
      generateErrorPage('Server Error', error instanceof Error ? error.message : 'Unknown error'),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 500 
      }
    )
  }
})

function generateErrorPage(title: string, message: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SoundCloud Authorization Error</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #ff5500, #ff7700);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .error {
            color: #721c24;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        button {
            background: #ff5500;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }
        button:hover {
            background: #e04400;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SoundCloud Authorization</h1>
        <div class="error">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
        <button onclick="window.close()">Close Window</button>
    </div>
</body>
</html>
  `
}

function generateSuccessPage(tokenData: any, userData: any, origin: string): string {
  const redirectUrl = `${origin}/admin/music?connected=soundcloud`
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SoundCloud Authorization Success</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #ff5500, #ff7700);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .success {
            color: #155724;
            background: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff5500;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SoundCloud Authorization</h1>
        <div class="success">
            <h3>Successfully Connected!</h3>
            <p>Welcome, ${userData.display_name || userData.username}!</p>
            <p>Storing your credentials and redirecting...</p>
        </div>
        <div class="spinner"></div>
    </div>
    
    <script>
        // Store tokens in localStorage
        localStorage.setItem('soundcloud_access_token', '${tokenData.access_token}');
        localStorage.setItem('soundcloud_user', JSON.stringify({
            id: ${userData.id},
            username: '${userData.username}',
            display_name: '${userData.display_name || userData.username}',
            avatar_url: '${userData.avatar_url || ''}',
            followers_count: ${userData.followers_count || 0},
            followings_count: ${userData.followings_count || 0},
            track_count: ${userData.track_count || 0},
            playlist_count: ${userData.playlist_count || 0}
        }));
        
        if ('${tokenData.refresh_token}') {
            localStorage.setItem('soundcloud_refresh_token', '${tokenData.refresh_token}');
        }
        
        console.log('SoundCloud credentials stored successfully');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = '${redirectUrl}';
        }, 2000);
    </script>
</body>
</html>
  `
}
