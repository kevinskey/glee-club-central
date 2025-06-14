
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  content: string;
  userId: string;
  template?: string;
  templateData?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send email via Elastic Email");
    
    const { to, subject, content, userId, template, templateData }: EmailRequest = await req.json();

    if (!to || !subject || !content) {
      throw new Error("Missing required fields: to, subject, content");
    }

    const elasticEmailApiKey = Deno.env.get("ELASTIC_EMAIL_API_KEY");
    if (!elasticEmailApiKey) {
      throw new Error("Elastic Email API key not configured");
    }

    // Prepare email data for Elastic Email API
    const emailData = new FormData();
    emailData.append('apikey', elasticEmailApiKey);
    emailData.append('from', 'noreply@gleeworld.org');
    emailData.append('fromName', 'Spelman College Glee Club');
    emailData.append('to', to);
    emailData.append('subject', subject);
    emailData.append('bodyHtml', content);
    emailData.append('bodyText', content.replace(/<[^>]*>?/gm, '')); // Strip HTML for plain text

    // Send email via Elastic Email API
    console.log(`Sending email to ${to} via Elastic Email`);
    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      body: emailData
    });

    const responseText = await response.text();
    console.log("Elastic Email response:", responseText);

    if (!response.ok) {
      throw new Error(`Elastic Email API error: ${responseText}`);
    }

    const emailResponse = JSON.parse(responseText);

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
          sent_at: new Date().toISOString(),
          provider: "elastic_email",
          external_id: emailResponse.data?.messageid
        });

      if (dbError) {
        console.error("Database error:", dbError);
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
