
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
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client using service role key for inserting orders
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get request body
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided");
    }

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity * 100); // Convert to cents
    }, 0);

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout-success`,
      cancel_url: `${req.headers.get("origin")}/store`,
      automatic_tax: { enabled: false },
      shipping_address_collection: { allowed_countries: ["US"] },
      customer_email: undefined, // Allow guest checkout
    });

    // Create order record in database
    const { error: insertError } = await supabaseService
      .from("orders")
      .insert({
        stripe_session_id: session.id,
        customer_email: "guest@glee.world", // Placeholder for guest orders
        amount: totalAmount,
        status: "pending",
        items: items,
      });

    if (insertError) {
      console.error("Error creating order record:", insertError);
      // Don't fail the checkout if we can't create the record
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
