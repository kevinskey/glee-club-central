
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY");

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LowStockItem {
  id: string;
  name: string;
  quantity_in_stock: number;
  price: number;
}

interface AlertUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting low stock alert check...");

    // Get items with low stock (< 10 units)
    const { data: lowStockItems, error: itemsError } = await supabase
      .from('store_items')
      .select('id, name, quantity_in_stock, price')
      .lt('quantity_in_stock', 10)
      .eq('is_active', true);

    if (itemsError) {
      console.error('Error fetching low stock items:', itemsError);
      throw itemsError;
    }

    if (!lowStockItems || lowStockItems.length === 0) {
      console.log('No low stock items found');
      return new Response(JSON.stringify({ message: 'No low stock items found' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${lowStockItems.length} low stock items`);

    // Get users with Merchandise Manager or Treasurer roles
    const { data: alertUsers, error: usersError } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name
      `)
      .or('role_tags.cs.{"Merchandise Manager"},role_tags.cs.{"Treasurer"}')
      .eq('status', 'active');

    if (usersError) {
      console.error('Error fetching alert users:', usersError);
      throw usersError;
    }

    if (!alertUsers || alertUsers.length === 0) {
      console.log('No users found with appropriate roles');
      return new Response(JSON.stringify({ message: 'No users found with appropriate roles' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get email addresses for these users
    const userEmails: AlertUser[] = [];
    for (const user of alertUsers) {
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user.id);
      if (!authError && authUser.user?.email) {
        userEmails.push({
          id: user.id,
          email: authUser.user.email,
          first_name: user.first_name || 'User',
          last_name: user.last_name || ''
        });
      }
    }

    console.log(`Found ${userEmails.length} users to alert`);

    // Generate email content
    const generateEmailContent = (items: LowStockItem[], userName: string) => {
      const itemsList = items.map(item => 
        `<li><strong>${item.name}</strong> - ${item.quantity_in_stock} units remaining (Price: $${item.price})</li>`
      ).join('');

      return `
        <h2>Low Stock Alert - GleeWorld Store</h2>
        <p>Dear ${userName},</p>
        <p>The following items in the GleeWorld store are running low on inventory (less than 10 units):</p>
        <ul>
          ${itemsList}
        </ul>
        <p>Please consider restocking these items to avoid running out of inventory.</p>
        <p>You can manage inventory by logging into the admin dashboard and navigating to Store Management > Inventory.</p>
        <p>Best regards,<br>GleeWorld Automated System</p>
      `;
    };

    // Send alerts to each user
    const emailPromises = userEmails.map(async (user) => {
      try {
        const emailContent = generateEmailContent(lowStockItems, `${user.first_name} ${user.last_name}`.trim());
        
        const emailResponse = await resend.emails.send({
          from: "GleeWorld Store <no-reply@gleeworld.org>",
          to: [user.email],
          subject: `Low Stock Alert - ${lowStockItems.length} item${lowStockItems.length > 1 ? 's' : ''} need attention`,
          html: emailContent,
          text: emailContent.replace(/<[^>]*>?/gm, ''), // Strip HTML for plain text version
        });

        console.log(`Email sent to ${user.email}:`, emailResponse);

        // Log the alert in user_messages table
        await supabase
          .from('user_messages')
          .insert({
            user_id: user.id,
            message_type: 'email',
            subject: `Low Stock Alert - ${lowStockItems.length} item${lowStockItems.length > 1 ? 's' : ''} need attention`,
            content: emailContent,
            recipient: user.email,
            status: 'sent',
            sent_at: new Date().toISOString()
          });

        return { success: true, user: user.email };
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        return { success: false, user: user.email, error: error.message };
      }
    });

    const emailResults = await Promise.all(emailPromises);
    const successCount = emailResults.filter(result => result.success).length;
    const failureCount = emailResults.filter(result => !result.success).length;

    console.log(`Email sending complete. Success: ${successCount}, Failures: ${failureCount}`);

    return new Response(JSON.stringify({
      success: true,
      message: `Low stock alert sent successfully`,
      details: {
        lowStockItemsCount: lowStockItems.length,
        usersAlerted: successCount,
        emailFailures: failureCount,
        lowStockItems: lowStockItems.map(item => ({
          name: item.name,
          stock: item.quantity_in_stock
        }))
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in low-stock-alert function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to process low stock alert"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
