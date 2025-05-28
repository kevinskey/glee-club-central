
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GOOGLE_TOKEN_ENDPOINT, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, REDIRECT_URI } from "./config.ts";
import { OAuthTokens } from "./types.ts";

export async function handleOAuthCallback(
  code: string,
  state: string,
  supabaseAdmin: SupabaseClient
): Promise<Response> {
  console.log("Processing OAuth callback with code:", code.substring(0, 20) + "...");
  
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
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString(),
  });
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Token exchange failed:", errorText);
    throw new Error(`Failed to exchange code for tokens: ${errorText}`);
  }
  
  const tokens: OAuthTokens = await tokenResponse.json();
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
  
  console.log("Successfully stored tokens, redirecting to success page");
  
  return new Response(`
    <html>
      <head><title>Calendar Connected</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h2>✅ Calendar Connected Successfully!</h2>
        <p>Your Google Calendar has been connected to GleeWorld.</p>
        <p>You can close this window now and return to the app.</p>
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
}
