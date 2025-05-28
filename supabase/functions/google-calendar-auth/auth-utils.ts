import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./config.ts";

export async function authenticateUser(req: Request, supabaseAdmin: SupabaseClient) {
  // First check for Google access token in query params (for OAuth callback)
  const url = new URL(req.url);
  const googleAccessToken = url.searchParams.get('access_token');
  
  if (googleAccessToken) {
    console.log("Found Google access token in query params");
    // For Google OAuth callback, we don't need Supabase auth
    return { user: null, response: null, googleAccessToken };
  }

  // Check Authorization header for both Supabase and Google tokens
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.error("Missing Authorization header for API request");
    return {
      user: null,
      response: new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    };
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Check if this is a Google access token (typically longer and different format)
  if (token.startsWith('ya29.') || token.length > 200) {
    console.log("Found Google access token in Authorization header");
    return { user: null, response: null, googleAccessToken: token };
  }
  
  // Otherwise, treat as Supabase token
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  
  if (authError || !user) {
    console.error("Authentication failed:", authError);
    return {
      user: null,
      response: new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    };
  }
  
  return { user, response: null };
}

export async function parseRequestBody(req: Request) {
  if (req.method !== 'POST') {
    return {};
  }
  
  try {
    const bodyText = await req.text();
    console.log("Raw request body:", bodyText);
    
    if (bodyText && bodyText.trim()) {
      try {
        const requestData = JSON.parse(bodyText);
        console.log("Parsed request data:", requestData);
        return requestData;
      } catch (parseError) {
        console.error("JSON parsing failed:", parseError);
        throw new Error('Invalid JSON in request body');
      }
    } else {
      console.log("Empty body received");
      return {};
    }
  } catch (e) {
    console.error("Error reading request body:", e);
    throw new Error('Failed to read request body');
  }
}

export function validateAction(action: any): string {
  if (!action || typeof action !== 'string' || action.trim() === '') {
    throw new Error('Action is required and must be a non-empty string');
  }
  return action.toLowerCase().trim();
}
