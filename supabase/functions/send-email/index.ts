
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
    console.log("Received request to send email");
    
    // Parse request body
    let reqBody: EmailRequest;
    try {
      reqBody = await req.json();
      console.log("Request body parsed:", {
        to: reqBody.to,
        subject: reqBody.subject,
        userId: reqBody.userId,
        contentLength: reqBody.content?.length || 0
      });
    } catch (e) {
      console.error("Failed to parse request body:", e);
      throw new Error("Invalid request format");
    }
    
    const { to, subject, content, userId } = reqBody;

    if (!to || !subject || !content) {
      throw new Error("Missing required fields: to, subject, content");
    }

    // Send email via Resend
    console.log(`Sending email to ${to}`);
    const emailResponse = await resend.emails.send({
      from: "Glee World <no-reply@gleeworld.org>",
      to: [to],
      subject: subject,
      html: content,
    });

    console.log("Email sent successfully:", emailResponse);

    // Store the message in the database for tracking
    if (userId && userId !== "registration") {
      const { supabaseClient } = await import("../shared/supabase-client.ts");
      
      console.log(`Storing message record for user ${userId}`);
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
