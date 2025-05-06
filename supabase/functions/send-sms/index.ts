
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  to: string;
  content: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, content, userId }: SMSRequest = await req.json();

    if (!to || !content || !userId) {
      throw new Error("Missing required fields: to, content, userId");
    }

    // Get Twilio credentials from environment
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const fromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error("Missing Twilio configuration");
    }

    // Send SMS via Twilio
    const twilioEndpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append("To", to);
    formData.append("From", fromNumber);
    formData.append("Body", content);

    const response = await fetch(twilioEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      },
      body: formData.toString(),
    });

    const twilioData = await response.json();

    if (!response.ok) {
      throw new Error(`Twilio error: ${JSON.stringify(twilioData)}`);
    }

    console.log("SMS sent successfully:", twilioData);

    // Store the message in the database for tracking
    const { supabaseClient } = await import("../shared/supabase-client.ts");
    
    const { error: dbError } = await supabaseClient
      .from("user_messages")
      .insert({
        user_id: userId,
        message_type: "sms",
        content: content,
        recipient: to,
        status: "sent",
        sent_at: new Date().toISOString()
      });

    if (dbError) {
      console.error("Database error:", dbError);
      // Continue since SMS was sent, just log the database error
    }

    return new Response(JSON.stringify({ success: true, data: twilioData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-sms function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
