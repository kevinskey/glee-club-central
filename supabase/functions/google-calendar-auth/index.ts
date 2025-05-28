
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./config.ts";
import { handleOAuthCallback } from "./oauth-handler.ts";
import { generateOAuthUrl, checkConnection, listCalendars, fetchEvents, disconnect } from "./api-handlers.ts";
import { authenticateUser, parseRequestBody, validateAction } from "./auth-utils.ts";

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
  
  // Handle OAuth callback - NO AUTH REQUIRED for this path
  if (code) {
    try {
      const state = url.searchParams.get('state');
      if (!state) {
        throw new Error('Missing state parameter');
      }
      
      return await handleOAuthCallback(code, state, supabaseAdmin);
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
  
  // Handle API requests - AUTH REQUIRED for these paths
  try {
    // Authenticate user (handles both Supabase and Google tokens)
    const { user, response: authResponse, googleAccessToken } = await authenticateUser(req, supabaseAdmin);
    if (authResponse) {
      return authResponse;
    }
    
    // Parse request body
    let requestData: any;
    try {
      requestData = await parseRequestBody(req);
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: error.message,
          received: req.method === 'POST' ? 'Invalid body' : 'N/A'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate action
    let action: string;
    try {
      action = validateAction(requestData?.action);
    } catch (error) {
      console.error("Missing, undefined, or empty action in request. Request data:", JSON.stringify(requestData));
      return new Response(
        JSON.stringify({ 
          error: error.message,
          received: requestData,
          validActions: ['generate_oauth_url', 'check_connection', 'list_calendars', 'fetch_events', 'disconnect']
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`Processing action: "${action}" for user: ${user?.id || 'Google token user'}`);
    
    // Route to appropriate handler
    switch (action) {
      case 'generate_oauth_url':
        if (!user) {
          return new Response(
            JSON.stringify({ error: 'User authentication required for OAuth URL generation' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await generateOAuthUrl(user);
      
      case 'check_connection':
        if (googleAccessToken) {
          // Direct check with Google token
          return new Response(
            JSON.stringify({ connected: true, source: 'google_token' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (!user) {
          return new Response(
            JSON.stringify({ connected: false, error: 'No authentication' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await checkConnection(user, supabaseAdmin);
      
      case 'list_calendars':
        if (googleAccessToken) {
          // Direct Google API call with provided token
          return await listCalendarsWithToken(googleAccessToken);
        }
        if (!user) {
          return new Response(
            JSON.stringify({ error: 'Authentication required', calendars: [] }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await listCalendars(user, supabaseAdmin);

      case 'fetch_events':
        const calendarId = requestData.calendar_id || 'primary';
        if (googleAccessToken) {
          // Direct Google API call with provided token
          return await fetchEventsWithToken(googleAccessToken, calendarId);
        }
        if (!user) {
          return new Response(
            JSON.stringify({ error: 'Authentication required', events: [] }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await fetchEvents(user, supabaseAdmin, calendarId);
        
      case 'disconnect':
        if (!user) {
          return new Response(
            JSON.stringify({ success: false, error: 'User authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await disconnect(user, supabaseAdmin);
        
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

// Helper functions for direct Google API calls
async function listCalendarsWithToken(accessToken: string) {
  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch calendars from Google');
    }
    
    const data = await response.json();
    const calendars = data.items?.map((cal: any) => ({
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
  } catch (error) {
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
}

async function fetchEventsWithToken(accessToken: string, calendarId: string = 'primary') {
  try {
    const timeMin = new Date().toISOString();
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` + 
      new URLSearchParams({
        timeMin,
        maxResults: '10',
        singleEvents: 'true',
        orderBy: 'startTime'
      }).toString(),
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch events from Google');
    }
    
    const data = await response.json();
    const events = data.items?.map((event: any) => ({
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
}
