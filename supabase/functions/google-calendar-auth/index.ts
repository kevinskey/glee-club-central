
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Google OAuth credentials from environment
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "";
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "";
const REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/google-calendar-auth`;
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') as string,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
  );
  
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  
  // Handle OAuth callback
  if (code) {
    try {
      const state = url.searchParams.get('state');
      if (!state) {
        throw new Error('Missing state parameter');
      }
      
      const userId = state;
      
      // Exchange code for tokens
      const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }).toString(),
      });
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Failed to exchange code for tokens: ${errorText}`);
      }
      
      const tokens = await tokenResponse.json();
      
      // Store tokens in database
      const { data: existingToken } = await supabaseAdmin
        .from('user_google_tokens')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingToken) {
        await supabaseAdmin
          .from('user_google_tokens')
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || null,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        await supabaseAdmin
          .from('user_google_tokens')
          .insert({
            user_id: userId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
          });
      }
      
      return new Response(`
        <html>
          <head><title>Calendar Connected</title></head>
          <body>
            <h2>Calendar Connected Successfully!</h2>
            <p>Your Google Calendar has been connected to GleeWorld. You can close this window now.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 200,
      });
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
  
  // Handle API requests
  try {
    let requestData;
    
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { action } = requestData || {};
    
    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    switch (action) {
      case 'get_auth_url':
        const authUrl = `${GOOGLE_OAUTH_ENDPOINT}?` + new URLSearchParams({
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
          scope: GOOGLE_SCOPE,
          state: user.id,
        }).toString();
        
        return new Response(
          JSON.stringify({ authUrl }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      
      case 'check_connection':
        const { data: tokenData } = await supabaseAdmin
          .from('user_google_tokens')
          .select('access_token, expires_at')
          .eq('user_id', user.id)
          .maybeSingle();
          
        const connected = !!tokenData && !!tokenData.access_token;
        
        return new Response(
          JSON.stringify({ connected }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
        
      case 'disconnect':
        await supabaseAdmin
          .from('user_google_tokens')
          .delete()
          .eq('user_id', user.id);
          
        return new Response(
          JSON.stringify({ success: true }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
        
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
