
export const GOOGLE_OAUTH_CLIENT_ID = "774938147540-lv0j2tkim0k8fbdvov1s7rqtmphqj3q9.apps.googleusercontent.com";
export const GOOGLE_OAUTH_CLIENT_SECRET = "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";
export const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

export const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/google-calendar-auth`;
export const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
export const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
