
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Google OAuth credentials from environment
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "774938147540-usqdo6ttbg1f7hhqcp5n12h7qh3mkp18.apps.googleusercontent.com";
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

console.log("Environment check:", {
  hasClientId: !!GOOGLE_OAUTH_CLIENT_ID,
  hasClientSecret: !!GOOGLE_OAUTH_CLIENT_SECRET,
  hasSupabaseUrl: !!SUPABASE_URL,
  clientIdLength: GOOGLE_OAUTH_CLIENT_ID?.length || 0,
  supabaseUrl: SUPABASE_URL
});

// Validate required environment variables
if (!GOOGLE_OAUTH_CLIENT_ID) {
  console.error("GOOGLE_OAUTH_CLIENT_ID environment variable is not set");
}

if (!GOOGLE_OAUTH_CLIENT_SECRET) {
  console.error("GOOGLE_OAUTH_CLIENT_SECRET environment variable is not set");
}

if (!SUPABASE_URL) {
  console.error("SUPABASE_URL environment variable is not set");
}

const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/google-calendar-auth`;
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

console.log("OAuth configuration:", {
  redirectUri: REDIRECT_URI,
  scope: GOOGLE_SCOPE,
  endpoint: GOOGLE_OAUTH_ENDPOINT
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
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
    console.log("Processing OAuth callback...");
    
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
      console.log("Token exchange successful, expires in:", tokens.expires_in);
      
      // Store tokens in database
      const { data: existingToken } = await supabaseAdmin
        .from('user_google_tokens')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingToken) {
        console.log("Updating existing token for user:", userId);
        const { error } = await supabaseAdmin
          .from('user_google_tokens')
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || null,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (error) {
          console.error("Failed to update token:", error);
          throw error;
        }
      } else {
        console.log("Creating new token for user:", userId);
        const { error } = await supabaseAdmin
          .from('user_google_tokens')
          .insert({
            user_id: userId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
          });
          
        if (error) {
          console.error("Failed to insert token:", error);
          throw error;
        }
      }
      
      return new Response(`
        <html>
          <head><title>Calendar Connected</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>✅ Calendar Connected Successfully!</h2>
            <p>Your Google Calendar has been connected to GleeWorld.</p>
            <p>You can close this window now.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 2000);
            </script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 200,
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      return new Response(`
        <html>
          <head><title>Connection Failed</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>❌ Connection Failed</h2>
            <p>Error: ${error.message}</p>
            <p>Please try again.</p>
          </body>
        </html>
      `, { 
        headers: { 'Content-Type': 'text/html' },
        status: 500 
      });
    }
  }
  
  // Handle API requests
  try {
    // Get auth user first
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
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
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse request body safely with improved error handling
    let requestData: any = {};
    if (req.method === 'POST') {
      try {
        const bodyText = await req.text();
        console.log("Raw request body:", bodyText);
        
        if (bodyText && bodyText.trim()) {
          try {
            requestData = JSON.parse(bodyText);
            console.log("Parsed request data:", requestData);
          } catch (parseError) {
            console.error("JSON parsing failed:", parseError);
            return new Response(
              JSON.stringify({ 
                error: 'Invalid JSON in request body',
                received: bodyText 
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
        } else {
          console.log("Empty body received, using default empty object");
          requestData = {};
        }
      } catch (e) {
        console.error("Error reading request body:", e);
        return new Response(
          JSON.stringify({ error: 'Failed to read request body' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    // Extract action with improved validation
    const action = requestData?.action;
    console.log(`Processing action: "${action}" for user: ${user.id}`);
    
    // Check if action is missing, undefined, or empty
    if (!action || typeof action !== 'string' || action.trim() === '') {
      console.error("Missing, undefined, or empty action in request. Request data:", JSON.stringify(requestData));
      return new Response(
        JSON.stringify({ 
          error: 'Action is required and must be a non-empty string',
          received: requestData,
          validActions: ['generate_oauth_url', 'check_connection', 'list_calendars', 'fetch_events', 'disconnect']
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Helper function to get and verify user token
    const getUserToken = async () => {
      const { data: tokenData, error } = await supabaseAdmin
        .from('user_google_tokens')
        .select('access_token, expires_at, refresh_token')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching token:", error);
        throw new Error('Failed to fetch token');
      }
        
      if (!tokenData) {
        throw new Error('Google Calendar not connected');
      }
      
      // Check if token is expired
      const expiresAt = new Date(tokenData.expires_at);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log("Token expired, needs refresh");
        throw new Error('Google Calendar token expired. Please reconnect.');
      }
      
      return tokenData;
    };
    
    switch (action.toLowerCase().trim()) {
      case 'generate_oauth_url':
        console.log("Generating auth URL for user:", user.id);
        
        // Check for missing credentials
        if (!GOOGLE_OAUTH_CLIENT_ID) {
          console.error("GOOGLE_OAUTH_CLIENT_ID is not configured");
          return new Response(
            JSON.stringify({ 
              error: 'Google OAuth Client ID not configured in Supabase secrets',
              details: 'Please set GOOGLE_OAUTH_CLIENT_ID in your Supabase project secrets'
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        if (!GOOGLE_OAUTH_CLIENT_SECRET) {
          console.error("GOOGLE_OAUTH_CLIENT_SECRET is not configured");
          return new Response(
            JSON.stringify({ 
              error: 'Google OAuth Client Secret not configured in Supabase secrets',
              details: 'Please set GOOGLE_OAUTH_CLIENT_SECRET in your Supabase project secrets'
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        try {
          const authUrlParams = new URLSearchParams({
            client_id: GOOGLE_OAUTH_CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent',
            scope: GOOGLE_SCOPE,
            state: user.id,
          });
          
          const authUrl = `${GOOGLE_OAUTH_ENDPOINT}?${authUrlParams.toString()}`;
          
          console.log("Generated OAuth URL:", authUrl);
          console.log("OAuth URL components:", {
            clientId: GOOGLE_OAUTH_CLIENT_ID?.substring(0, 20) + '...',
            redirectUri: REDIRECT_URI,
            scope: GOOGLE_SCOPE,
            state: user.id
          });
          
          return new Response(
            JSON.stringify({ 
              authUrl,
              redirectUri: REDIRECT_URI,
              scope: GOOGLE_SCOPE
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          console.error("Error generating OAuth URL:", error);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to generate OAuth URL',
              details: error.message
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      
      case 'check_connection':
        try {
          const tokenData = await getUserToken();
          console.log("Connection check: CONNECTED");
          return new Response(
            JSON.stringify({ 
              connected: true,
              expires_at: tokenData.expires_at
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          console.log("Connection check: NOT CONNECTED -", error.message);
          return new Response(
            JSON.stringify({ 
              connected: false,
              error: error.message
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      
      case 'list_calendars':
        console.log("Fetching calendars for user:", user.id);
        
        try {
          const tokenData = await getUserToken();
          
          const calendarsResponse = await fetch(
            'https://www.googleapis.com/calendar/v3/users/me/calendarList',
            {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
              },
            }
          );
          
          if (!calendarsResponse.ok) {
            const errorText = await calendarsResponse.text();
            console.error("Failed to fetch calendars:", errorText);
            throw new Error('Failed to fetch calendars from Google');
          }
          
          const calendarsData = await calendarsResponse.json();
          const calendars = calendarsData.items?.map((cal: any) => ({
            id: cal.id,
            name: cal.summary,
            primary: cal.primary || false
          })) || [];
          
          console.log(`Fetched ${calendars.length} calendars`);
          
          return new Response(
            JSON.stringify({ calendars }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          console.error("Error in list_calendars:", error);
          return new Response(
            JSON.stringify({ 
              error: error.message,
              calendars: []
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

      case 'fetch_events':
        console.log("Fetching events for user:", user.id);
        
        try {
          const tokenData = await getUserToken();
          
          const calendarId = requestData.calendar_id || 'primary';
          const timeMin = new Date().toISOString();
          
          console.log(`Fetching events from calendar: ${calendarId}`);
          
          const eventsResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` + 
            new URLSearchParams({
              timeMin,
              maxResults: '5',
              singleEvents: 'true',
              orderBy: 'startTime'
            }).toString(),
            {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
              },
            }
          );
          
          if (!eventsResponse.ok) {
            const errorText = await eventsResponse.text();
            console.error("Failed to fetch events:", errorText);
            throw new Error('Failed to fetch events from Google');
          }
          
          const eventsData = await eventsResponse.json();
          console.log(`Successfully fetched ${eventsData.items?.length || 0} events`);
          
          const events = eventsData.items?.map((event: any) => ({
            id: event.id,
            title: event.summary || 'Untitled Event',
            start: event.start?.dateTime || event.start?.date,
            end: event.end?.dateTime || event.end?.date,
            location: event.location || '',
            description: event.description || '',
            allDay: !event.start?.dateTime,
            source: 'google'
          })) || [];
          
          return new Response(
            JSON.stringify({ events }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          console.error("Error in fetch_events:", error);
          return new Response(
            JSON.stringify({ 
              error: error.message,
              events: []
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
      case 'disconnect':
        console.log("Disconnecting Google Calendar for user:", user.id);
        
        try {
          const { error } = await supabaseAdmin
            .from('user_google_tokens')
            .delete()
            .eq('user_id', user.id);
            
          if (error) {
            console.error("Error disconnecting:", error);
            throw error;
          }
          
          console.log("Successfully disconnected user:", user.id);
          
          return new Response(
            JSON.stringify({ success: true }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } catch (error) {
          console.error("Error in disconnect:", error);
          return new Response(
            JSON.stringify({ 
              success: false,
              error: error.message 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
      default:
        console.error(`Unknown action: "${action}"`);
        return new Response(
          JSON.stringify({ 
            error: `Unknown action: ${action}`,
            validActions: ['generate_oauth_url', 'check_connection', 'list_calendars', 'fetch_events', 'disconnect']
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
