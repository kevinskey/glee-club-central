
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🟦 Square webhook received");

    const signature = req.headers.get("x-square-signature");
    const webhookSignatureKey = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY");
    
    if (!signature || !webhookSignatureKey) {
      console.error("❌ Missing webhook signature or key");
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const body = await req.text();

    // Verify the webhook signature using the Square signing key
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSignatureKey),
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"],
    );
    const data = encoder.encode(req.url + body);
    const signatureBuf = await crypto.subtle.sign("HMAC", key, data);
    const computedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuf)),
    );

    if (signature !== computedSignature) {
      console.error("❌ Webhook signature verification failed");
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }


    const event = JSON.parse(body);
    console.log("📨 Webhook event:", JSON.stringify(event, null, 2));

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different Square webhook events
    switch (event.type) {
      case "payment.created":
        console.log("💳 Payment created event received");
        await handlePaymentCreated(supabase, event.data);
        break;
      
      case "payment.updated":
        console.log("🔄 Payment updated event received");
        await handlePaymentUpdated(supabase, event.data);
        break;
      
      case "order.created":
        console.log("📋 Order created event received");
        await handleOrderCreated(supabase, event.data);
        break;
      
      case "order.updated":
        console.log("📋 Order updated event received");
        await handleOrderUpdated(supabase, event.data);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response("OK", { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("💥 Square webhook error:", error);
    return new Response("Internal Server Error", { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});

async function handlePaymentCreated(supabase: any, paymentData: any) {
  console.log("Processing payment created:", paymentData);
  
  // Update order status based on payment
  if (paymentData.object?.payment?.status === "COMPLETED") {
    await updateOrderStatus(supabase, paymentData.object.payment.order_id, "completed");
  }
}

async function handlePaymentUpdated(supabase: any, paymentData: any) {
  console.log("Processing payment updated:", paymentData);
  
  const payment = paymentData.object?.payment;
  if (payment?.status === "COMPLETED") {
    await updateOrderStatus(supabase, payment.order_id, "completed");
  } else if (payment?.status === "FAILED") {
    await updateOrderStatus(supabase, payment.order_id, "failed");
  }
}

async function handleOrderCreated(supabase: any, orderData: any) {
  console.log("Processing order created:", orderData);
  // Handle order creation if needed
}

async function handleOrderUpdated(supabase: any, orderData: any) {
  console.log("Processing order updated:", orderData);
  // Handle order updates if needed
}

async function updateOrderStatus(supabase: any, squareOrderId: string, status: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_session_id', squareOrderId); // Using this field for Square order ID

    if (error) {
      console.error("❌ Error updating order status:", error);
    } else {
      console.log(`✅ Order ${squareOrderId} status updated to ${status}`);
    }
  } catch (error) {
    console.error("💥 Error in updateOrderStatus:", error);
  }
}
