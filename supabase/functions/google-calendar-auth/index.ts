
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
    // Authenticate user
    const { user, response: authResponse } = await authenticateUser(req, supabaseAdmin);
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
    
    console.log(`Processing action: "${action}" for user: ${user!.id}`);
    
    // Route to appropriate handler
    switch (action) {
      case 'generate_oauth_url':
        return await generateOAuthUrl(user!);
      
      case 'check_connection':
        return await checkConnection(user!, supabaseAdmin);
      
      case 'list_calendars':
        return await listCalendars(user!, supabaseAdmin);

      case 'fetch_events':
        const calendarId = requestData.calendar_id || 'primary';
        return await fetchEvents(user!, supabaseAdmin, calendarId);
        
      case 'disconnect':
        return await disconnect(user!, supabaseAdmin);
        
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
