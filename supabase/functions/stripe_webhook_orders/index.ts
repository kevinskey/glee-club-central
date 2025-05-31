
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    console.log("🔔 Webhook received");

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      console.error("❌ Missing Stripe configuration");
      throw new Error("Stripe configuration missing");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ No Stripe signature found");
      throw new Error("No Stripe signature found");
    }

    console.log("🔐 Verifying webhook signature");

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return new Response(`Webhook Error: ${err}`, { status: 400 });
    }

    console.log("✅ Webhook signature verified, event type:", event.type);

    // Only handle checkout.session.completed events
    if (event.type !== "checkout.session.completed") {
      console.log("ℹ️ Ignoring event type:", event.type);
      return new Response("Event type not handled", { status: 200 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log("💳 Processing completed checkout session:", session.id);

    // Create Supabase client using service role key for database writes
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Extract order details from the session
    const orderData = {
      stripe_session_id: session.id,
      customer_email: session.customer_email || session.customer_details?.email || "unknown@gleeworld.org",
      customer_name: session.customer_details?.name || null,
      amount: session.amount_total || 0,
      currency: session.currency || "usd",
      status: session.payment_status === "paid" ? "completed" : "pending",
      shipping_address: session.shipping_details ? {
        name: session.shipping_details.name,
        address: session.shipping_details.address
      } : null,
      updated_at: new Date().toISOString(),
    };

    console.log("📦 Order data prepared:", {
      session_id: orderData.stripe_session_id,
      email: orderData.customer_email,
      amount: orderData.amount,
      status: orderData.status
    });

    // Try to retrieve line items for this session
    let lineItems: any[] = [];
    try {
      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
      });
      
      lineItems = lineItemsResponse.data.map(item => ({
        product_name: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
        currency: item.currency,
        price_data: item.price ? {
          unit_amount: item.price.unit_amount,
          product_id: typeof item.price.product === 'string' ? item.price.product : item.price.product?.id
        } : null
      }));

      console.log("🛍️ Retrieved line items:", lineItems.length, "items");
    } catch (error) {
      console.error("⚠️ Could not retrieve line items:", error);
      // Continue without line items if retrieval fails
    }

    // Check if order already exists to avoid duplicates
    const { data: existingOrder, error: checkError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("stripe_session_id", session.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Error checking for existing order:", checkError);
      throw new Error("Database error while checking for existing order");
    }

    if (existingOrder) {
      console.log("📋 Order already exists, updating status:", existingOrder.id);
      
      // Update existing order
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: orderData.status,
          customer_name: orderData.customer_name,
          shipping_address: orderData.shipping_address,
          items: lineItems.length > 0 ? lineItems : undefined,
          updated_at: orderData.updated_at
        })
        .eq("stripe_session_id", session.id);

      if (updateError) {
        console.error("❌ Error updating existing order:", updateError);
        throw new Error("Failed to update existing order");
      }

      console.log("✅ Order updated successfully");
    } else {
      console.log("📝 Creating new order record");
      
      // Insert new order
      const { error: insertError } = await supabase
        .from("orders")
        .insert({
          ...orderData,
          items: lineItems.length > 0 ? lineItems : []
        });

      if (insertError) {
        console.error("❌ Error creating new order:", insertError);
        throw new Error("Failed to create new order");
      }

      console.log("✅ New order created successfully");
    }

    // Log successful processing
    console.log("🎉 Webhook processed successfully for session:", session.id);

    return new Response(JSON.stringify({ 
      received: true,
      session_id: session.id,
      status: orderData.status
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("💥 Webhook processing failed:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      received: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
