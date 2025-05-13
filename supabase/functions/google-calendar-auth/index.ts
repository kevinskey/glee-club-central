
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Google OAuth credentials
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "";
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("GOOGLE_OAUTH_REDIRECT_URI") || "https://dzzptovqfqausipsgabw.supabase.co/functions/v1/google-calendar-auth";
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Initialize Supabase client with admin privileges
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') as string,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
  );
  
  // Parse URL and query params
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  
  // If we have a code parameter, this is the OAuth callback
  if (code) {
    try {
      // Get user ID from state parameter (used for storing tokens)
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
        // Update existing token
        await supabaseAdmin
          .from('user_google_tokens')
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || null, // Only update if provided
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Insert new token
        await supabaseAdmin
          .from('user_google_tokens')
          .insert({
            user_id: userId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
          });
      }
      
      // Return success page that can be closed
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
        JSON.stringify({
          error: 'Invalid JSON in request body'
        }),
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
    
    // Check user permissions
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, is_super_admin')
      .eq('id', user.id)
      .single();
    
    const isAdmin = profile?.is_super_admin || 
                    profile?.role === 'admin' || 
                    profile?.role === 'administrator' ||
                    profile?.role === 'director';
    
    switch (action) {
      case 'get_auth_url':
        // Generate OAuth URL for connecting Google Calendar
        const authUrl = `${GOOGLE_OAUTH_ENDPOINT}?` + new URLSearchParams({
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
          scope: GOOGLE_SCOPE,
          state: user.id, // Use state parameter to store user ID
        }).toString();
        
        return new Response(
          JSON.stringify({ authUrl }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      
      case 'check_connection':
        // Check if user has a valid Google Calendar connection
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
        // Only admins can disconnect calendar
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized: Admin privileges required' }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Delete token from database
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
