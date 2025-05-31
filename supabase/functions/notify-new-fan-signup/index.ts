
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FanSignupNotification {
  fan_id: string;
  full_name: string;
  email: string;
  favorite_memory?: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received fan signup notification");
    
    const fanData: FanSignupNotification = await req.json();
    console.log("Fan data:", {
      id: fanData.fan_id,
      name: fanData.full_name,
      email: fanData.email,
      hasMemory: !!fanData.favorite_memory
    });

    // Format the email content
    const emailSubject = "🎶 New GleeWorld Fan Signup!";
    
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35;">🎶 New GleeWorld Fan Signup!</h2>
        
        <p>A new fan has joined the GleeWorld community!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Fan Details:</h3>
          <p><strong>Name:</strong> ${fanData.full_name}</p>
          <p><strong>Email:</strong> ${fanData.email}</p>
          ${fanData.favorite_memory ? 
            `<p><strong>Favorite Song/Memory:</strong></p>
             <blockquote style="background-color: #fff; padding: 15px; border-left: 4px solid #ff6b35; margin: 10px 0; font-style: italic;">
               "${fanData.favorite_memory}"
             </blockquote>` : 
            '<p><em>No favorite memory shared</em></p>'
          }
          <p><strong>Signed up:</strong> ${new Date(fanData.created_at).toLocaleString()}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This notification was automatically generated when a new fan signed up on the GleeWorld website.
        </p>
      </div>
    `;

    // Send the notification email
    console.log("Sending notification email...");
    const emailResponse = await resend.emails.send({
      from: "GleeWorld <admin@gleeworld.org>",
      to: ["Kpj64110@gmail.com", "admin@gleeworld.org"],
      subject: emailSubject,
      html: emailBody,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Fan signup notification sent",
        emailId: emailResponse.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in notify-new-fan-signup function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to process fan signup notification"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
