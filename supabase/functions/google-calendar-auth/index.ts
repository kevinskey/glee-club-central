import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Google OAuth credentials from environment
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

if (!GOOGLE_OAUTH_CLIENT_ID) {
  console.error("GOOGLE_OAUTH_CLIENT_ID environment variable is not set");
}

if (!GOOGLE_OAUTH_CLIENT_SECRET) {
  console.error("GOOGLE_OAUTH_CLIENT_SECRET environment variable is not set");
}

const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/google-calendar-auth`;
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  
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
    console.log("Handling OAuth callback with code:", code.substring(0, 10) + "...");
    
    try {
      const state = url.searchParams.get('state');
      if (!state) {
        throw new Error('Missing state parameter');
      }
      
      const userId = state;
      console.log("Processing callback for user:", userId);
      
      // Exchange code for tokens
      const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_OAUTH_CLIENT_ID || '',
          client_secret: GOOGLE_OAUTH_CLIENT_SECRET || '',
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }).toString(),
      });
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        throw new Error(`Failed to exchange code for tokens: ${errorText}`);
      }
      
      const tokens = await tokenResponse.json();
      console.log("Token exchange successful");
      
      // Store tokens in database
      const { data: existingToken } = await supabaseAdmin
        .from('user_google_tokens')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingToken) {
        console.log("Updating existing token for user:", userId);
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
        console.log("Creating new token for user:", userId);
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
    let requestData: any = {};
    
    // Properly parse request body for POST requests
    if (req.method === 'POST') {
      try {
        const bodyText = await req.text();
        console.log("Raw body text:", bodyText);
        
        if (bodyText && bodyText.trim()) {
          // Check if it's JSON or if Supabase already parsed it
          if (bodyText.startsWith('{')) {
            requestData = JSON.parse(bodyText);
          } else {
            // Handle case where Supabase sends the parsed object as string
            try {
              requestData = JSON.parse(bodyText);
            } catch {
              // If it's not valid JSON, treat as plain text
              requestData = { rawBody: bodyText };
            }
          }
        }
        console.log("Parsed request data:", requestData);
      } catch (e) {
        console.error("Error parsing request body:", e);
        return new Response(
          JSON.stringify({ error: 'Invalid request body' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    const { action } = requestData;
    console.log("Processing action:", action);
    
    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing Authorization header");
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
      console.error("Authentication failed:", authError);
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
        console.log("Generating auth URL for user:", user.id);
        
        if (!GOOGLE_OAUTH_CLIENT_ID) {
          console.error("GOOGLE_OAUTH_CLIENT_ID is not configured");
          return new Response(
            JSON.stringify({ error: 'Google OAuth not configured' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        const authUrl = `${GOOGLE_OAUTH_ENDPOINT}?` + new URLSearchParams({
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
          scope: GOOGLE_SCOPE,
          state: user.id,
        }).toString();
        
        console.log("Generated auth URL:", authUrl.substring(0, 100) + "...");
        
        return new Response(
          JSON.stringify({ authUrl }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      
      case 'list_calendars':
        console.log("Fetching calendars for user:", user.id);
        
        // Get user's access token
        const { data: tokenData } = await supabaseAdmin
          .from('user_google_tokens')
          .select('access_token, expires_at')
          .eq('user_id', user.id)
          .single();
          
        if (!tokenData) {
          return new Response(
            JSON.stringify({ 
              error: 'Google Calendar not connected',
              calendars: []
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Check if token is expired
        const expiresAt = new Date(tokenData.expires_at);
        const now = new Date();
        
        if (expiresAt <= now) {
          return new Response(
            JSON.stringify({ 
              error: 'Google Calendar token expired. Please reconnect.',
              calendars: []
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Fetch calendars from Google Calendar API
        const calendarsResponse = await fetch(
          'https://www.googleapis.com/calendar/v3/users/me/calendarList',
          {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
            },
          }
        );
        
        if (!calendarsResponse.ok) {
          console.error("Failed to fetch calendars:", await calendarsResponse.text());
          return new Response(
            JSON.stringify({ 
              error: 'Failed to fetch calendars from Google',
              calendars: []
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        const calendarsData = await calendarsResponse.json();
        const calendars = calendarsData.items?.map((cal: any) => ({
          id: cal.id,
          name: cal.summary,
          primary: cal.primary || false
        })) || [];
        
        return new Response(
          JSON.stringify({ calendars }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      
      case 'check_connection':
        const { data: connectionTokenData } = await supabaseAdmin
          .from('user_google_tokens')
          .select('access_token, expires_at')
          .eq('user_id', user.id)
          .maybeSingle();
          
        const connected = !!connectionTokenData && !!connectionTokenData.access_token;
        
        return new Response(
          JSON.stringify({ connected }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
        
      case 'disconnect':
        console.log("Disconnecting Google Calendar for user:", user.id);
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
        console.error("Unknown action:", action);
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
