
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants for Google OAuth
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "";
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("GOOGLE_OAUTH_REDIRECT_URI") || "";
const APP_URL = Deno.env.get("APP_URL") || ""; // URL to redirect back to app after auth

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create an OAuth2 client
const createOAuth2Client = () => {
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials not configured");
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    
    // For the getAuthUrl action, we don't need authentication
    // Extract the action from the request regardless of authentication
    const requestData = await req.json();
    const { action, code } = requestData;
    
    // Special case: getting the auth URL doesn't require authentication
    if (action === 'getAuthUrl') {
      const authUrl = getAuthorizationUrl();
      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // For all other actions, verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    // Get user ID from JWT
    const jwt = authHeader.replace('Bearer ', '');
    let userId;
    
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(jwt);
      
      if (error || !user) {
        throw new Error('Invalid JWT token');
      }
      
      userId = user.id;
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
        if (!code) {
          throw new Error('Authorization code is required');
        }
        
        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);
        
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
          throw new Error(`Failed to store tokens: ${error.message}`);
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      case 'refreshToken': {
        // Get refresh token for user
        const { data: tokenData, error: tokenError } = await supabaseAdmin
          .from('user_google_tokens')
          .select('refresh_token')
          .eq('user_id', userId)
          .single();
        
        if (tokenError || !tokenData?.refresh_token) {
          throw new Error('No refresh token found for user');
        }
        
        // Refresh the access token
        const tokens = await refreshAccessToken(tokenData.refresh_token);
        
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
          throw new Error(`Failed to update tokens: ${error.message}`);
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      case 'disconnect': {
        // Delete tokens from database
        const { error } = await supabaseAdmin
          .from('user_google_tokens')
          .delete()
          .eq('user_id', userId);
        
        if (error) {
          throw new Error(`Failed to disconnect: ${error.message}`);
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      default:
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
