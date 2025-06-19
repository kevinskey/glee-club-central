
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode the token
    const decodedToken = JSON.parse(atob(token));
    const { user_id, email, expires_at, signature } = decodedToken;

    // Check if token has expired
    if (Date.now() > expires_at) {
      return new Response(
        JSON.stringify({ error: 'Token expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature
    const secret = Deno.env.get('SSO_SECRET_KEY') || 'fallback-secret-key';
    const expectedSignature = createHmac('sha256', secret)
      .update(JSON.stringify({ user_id, email, expires_at }))
      .digest('hex');

    if (signature !== expectedSignature) {
      return new Response(
        JSON.stringify({ error: 'Invalid token signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        tokenData: { user_id, email, expires_at, signature },
        valid: true 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('SSO token validation error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid token format' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
