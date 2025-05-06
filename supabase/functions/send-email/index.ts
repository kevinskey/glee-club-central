
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  content: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, content, userId }: EmailRequest = await req.json();

    if (!to || !subject || !content || !userId) {
      throw new Error("Missing required fields: to, subject, content, userId");
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Choir App <no-reply@yourdomain.com>",
      to: [to],
      subject: subject,
      html: content,
    });

    console.log("Email sent successfully:", emailResponse);

    // Store the message in the database for tracking
    const { supabaseClient } = await import("../shared/supabase-client.ts");
    
    const { error: dbError } = await supabaseClient
      .from("user_messages")
      .insert({
        user_id: userId,
        message_type: "email",
        subject: subject,
        content: content,
        recipient: to,
        status: "sent",
        sent_at: new Date().toISOString()
      });

    if (dbError) {
      console.error("Database error:", dbError);
      // Continue since email was sent, just log the database error
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    
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
