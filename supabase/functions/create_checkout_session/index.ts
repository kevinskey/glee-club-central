
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  product_id: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  buyer_email?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Starting checkout session creation");

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("❌ STRIPE_SECRET_KEY not found in environment");
      throw new Error("Stripe configuration missing");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client using service role key for database queries
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request body
    const { items, buyer_email }: CheckoutRequest = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ Invalid items provided:", items);
      throw new Error("No valid items provided");
    }

    console.log("📦 Processing checkout for items:", items);

    // Extract product IDs for database lookup
    const productIds = items.map(item => item.product_id);

    // Look up product details from the products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image_url, is_active')
      .in('id', productIds)
      .eq('is_active', true);

    if (productsError) {
      console.error("❌ Database error fetching products:", productsError);
      throw new Error("Failed to fetch product details");
    }

    if (!products || products.length === 0) {
      console.error("❌ No active products found for IDs:", productIds);
      throw new Error("No valid products found");
    }

    console.log("✅ Found products:", products.map(p => ({ id: p.id, name: p.name, price: p.price })));

    // Validate that all requested products exist
    const foundProductIds = products.map(p => p.id);
    const missingProducts = productIds.filter(id => !foundProductIds.includes(id));
    
    if (missingProducts.length > 0) {
      console.error("❌ Missing products:", missingProducts);
      throw new Error(`Products not found: ${missingProducts.join(', ')}`);
    }

    // Create a map for easy product lookup
    const productMap = new Map<string, Product>();
    products.forEach(product => {
      productMap.set(product.id, product as Product);
    });

    // Format Stripe line items with price validation
    const lineItems = items.map(item => {
      const product = productMap.get(item.product_id);
      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      // Validate quantity
      if (item.quantity <= 0 || item.quantity > 100) {
        throw new Error(`Invalid quantity ${item.quantity} for product ${product.name}`);
      }

      console.log(`💰 Adding ${item.quantity}x ${product.name} at $${product.price}`);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image_url ? [product.image_url] : [],
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Calculate total for logging
    const totalAmount = lineItems.reduce((total, item) => {
      return total + (item.price_data.unit_amount * item.quantity);
    }, 0);

    console.log(`💳 Creating checkout session for total: $${(totalAmount / 100).toFixed(2)}`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "https://gleeworld.org/store/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://gleeworld.org/store/cancelled",
      automatic_tax: { enabled: false },
      shipping_address_collection: { 
        allowed_countries: ["US"] 
      },
      customer_email: buyer_email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      payment_intent_data: {
        metadata: {
          source: "gleeworld_store",
          item_count: items.length.toString(),
        }
      },
      metadata: {
        source: "gleeworld_store",
        buyer_email: buyer_email || "guest",
        item_count: items.length.toString(),
      }
    });

    // Log checkout attempt for auditing
    const auditLog = {
      session_id: session.id,
      buyer_email: buyer_email || "guest",
      items: items,
      total_amount_cents: totalAmount,
      currency: "usd",
      created_at: new Date().toISOString(),
      stripe_url: session.url,
    };

    console.log("📝 Audit log:", auditLog);

    // Store audit log in orders table for tracking
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        stripe_session_id: session.id,
        customer_email: buyer_email || "guest@gleeworld.org",
        amount: totalAmount,
        currency: "usd",
        status: "pending",
        items: items,
      });

    if (orderError) {
      console.error("⚠️ Warning: Failed to create order record:", orderError);
      // Don't fail the checkout if we can't create the audit record
    } else {
      console.log("✅ Order record created successfully");
    }

    console.log("🎉 Checkout session created successfully:", session.id);

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id,
      total_amount: totalAmount / 100,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("💥 Checkout session creation failed:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Failed to create checkout session"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
