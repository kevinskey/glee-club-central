
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  
  try {
    // Get the request body
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') as string,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    );
    
    // Get the user's Google Calendar token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('user_google_tokens')
      .select('access_token, expires_at, refresh_token')
      .eq('user_id', userId)
      .single();
    
    if (tokenError) {
      throw new Error(`No Google Calendar token found for user: ${tokenError.message}`);
    }
    
    // Check if token has expired
    const expiresAt = new Date(tokenData.expires_at).getTime();
    const now = Date.now();
    
    // If token has expired, refresh it
    if (expiresAt <= now) {
      // Token has expired, refresh it
      if (!tokenData.refresh_token) {
        throw new Error('No refresh token available');
      }
      
      // Refresh the token (using the same logic as in the google-calendar-auth edge function)
      const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "";
      const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "";
      const REDIRECT_URI = Deno.env.get("GOOGLE_OAUTH_REDIRECT_URI") || "";
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: tokenData.refresh_token,
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
          grant_type: 'refresh_token',
        }).toString(),
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to refresh Google Calendar token');
      }
      
      const tokens = await tokenResponse.json();
      
      // Update the token in the database
      const { error } = await supabaseAdmin
        .from('user_google_tokens')
        .update({
          access_token: tokens.access_token,
          expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        })
        .eq('user_id', userId);
      
      if (error) {
        throw new Error(`Failed to update token in database: ${error.message}`);
      }
      
      // Return the new token
      return new Response(JSON.stringify({ token: tokens.access_token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Return the current token
    return new Response(JSON.stringify({ token: tokenData.access_token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error('Error getting Google token:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
