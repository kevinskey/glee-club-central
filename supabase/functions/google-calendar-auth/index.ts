
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants for Google OAuth
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "9zx7bAIxfErcwdDg9Xn2cwup";
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("GOOGLE_OAUTH_REDIRECT_URI") || "https://dzzptovqfqausipsgabw.supabase.co/functions/v1/google-calendar-auth";
const APP_URL = Deno.env.get("APP_URL") || "https://glee-club-central.lovable.app"; 

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create an OAuth2 client
const createOAuth2Client = () => {
  if (!GOOGLE_OAUTH_CLIENT_ID) {
    throw new Error("Google OAuth client ID not configured");
  }
  
  return {
    clientId: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  };
};

// Get OAuth2 authorization URL
const getAuthorizationUrl = () => {
  const oauth2Client = createOAuth2Client();
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly',
  ];
  
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('client_id', oauth2Client.clientId);
  url.searchParams.append('redirect_uri', oauth2Client.redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', scopes.join(' '));
  url.searchParams.append('access_type', 'offline');
  url.searchParams.append('prompt', 'consent');
  
  return url.toString();
};

// Exchange authorization code for tokens
const exchangeCodeForTokens = async (code: string) => {
  const oauth2Client = createOAuth2Client();
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: oauth2Client.clientId,
      client_secret: oauth2Client.clientSecret,
      redirect_uri: oauth2Client.redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Token exchange error:", errorText);
    throw new Error(`Failed to exchange code for tokens: ${errorText}`);
  }
  
  return tokenResponse.json();
};

// Refresh access token using refresh token
const refreshAccessToken = async (refreshToken: string) => {
  const oauth2Client = createOAuth2Client();
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: oauth2Client.clientId,
      client_secret: oauth2Client.clientSecret,
      grant_type: 'refresh_token',
    }).toString(),
  });
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Failed to refresh token: ${errorText}`);
  }
  
  return tokenResponse.json();
};

// Main handler
serve(async (req) => {
  console.log("Received request to google-calendar-auth function");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    
    // Extract the action from the request regardless of authentication
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data:", JSON.stringify(requestData));
    } catch (e) {
      console.error("Error parsing request JSON:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const { action, code } = requestData;
    
    // Special case: getting the auth URL doesn't require authentication
    if (action === 'getAuthUrl') {
      console.log("Getting auth URL");
      try {
        const authUrl = getAuthorizationUrl();
        console.log("Auth URL generated:", authUrl);
        return new Response(JSON.stringify({ authUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } catch (error) {
        console.error("Error generating auth URL:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
    }
    
    // For all other actions, verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing Authorization header");
      throw new Error('Missing Authorization header');
    }
    
    // Get user ID from JWT
    let userId;
    
    try {
      const jwt = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(jwt);
      
      if (error || !user) {
        console.error("JWT verification error:", error);
        throw new Error('Invalid JWT token');
      }
      
      userId = user.id;
      console.log("Authenticated user ID:", userId);
    } catch (error) {
      console.error('JWT verification error:', error);
      return new Response(JSON.stringify({ error: 'Invalid authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle different actions
    switch (action) {
      case 'handleCallback': {
        console.log("Handling OAuth callback");
        if (!code) {
          throw new Error('Authorization code is required');
        }
        
        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);
        console.log("Tokens received:", JSON.stringify({
          access_token: "REDACTED",
          refresh_token: "REDACTED",
          expires_in: tokens.expires_in
        }));
        
        // Store tokens in the database
        const { error } = await supabaseAdmin
          .from('user_google_tokens')
          .upsert({
            user_id: userId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error("Error storing tokens:", error);
          throw new Error(`Failed to store tokens: ${error.message}`);
        }
        
        console.log("Tokens stored successfully");
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      case 'refreshToken': {
        console.log("Refreshing access token");
        // Get refresh token for user
        const { data: tokenData, error: tokenError } = await supabaseAdmin
          .from('user_google_tokens')
          .select('refresh_token')
          .eq('user_id', userId)
          .single();
        
        if (tokenError || !tokenData?.refresh_token) {
          console.error("Error getting refresh token:", tokenError);
          throw new Error('No refresh token found for user');
        }
        
        // Refresh the access token
        const tokens = await refreshAccessToken(tokenData.refresh_token);
        console.log("Token refreshed");
        
        // Update tokens in database
        const { error } = await supabaseAdmin
          .from('user_google_tokens')
          .update({
            access_token: tokens.access_token,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (error) {
          console.error("Error updating tokens:", error);
          throw new Error(`Failed to update tokens: ${error.message}`);
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      case 'disconnect': {
        console.log("Disconnecting Google Calendar");
        // Delete tokens from database
        const { error } = await supabaseAdmin
          .from('user_google_tokens')
          .delete()
          .eq('user_id', userId);
        
        if (error) {
          console.error("Error disconnecting:", error);
          throw new Error(`Failed to disconnect: ${error.message}`);
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      default:
        console.error("Unknown action:", action);
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
