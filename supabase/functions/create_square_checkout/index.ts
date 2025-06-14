
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    console.log("🟦 Starting Square checkout session creation");

    // Get Square credentials
    const squareAppId = Deno.env.get("SQUARE_APPLICATION_ID");
    const squareAccessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    
    if (!squareAppId || !squareAccessToken) {
      console.error("❌ Square credentials not found in environment");
      throw new Error("Square configuration missing");
    }

    // Create Supabase client
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

    console.log("📦 Processing Square checkout for items:", items);

    // Extract product IDs for database lookup
    const productIds = items.map(item => item.product_id);

    // Look up product details from the store_items table
    const { data: products, error: productsError } = await supabase
      .from('store_items')
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

    // Create a map for easy product lookup
    const productMap = new Map<string, Product>();
    products.forEach(product => {
      productMap.set(product.id, product as Product);
    });

    // Calculate total amount in cents
    let totalAmountCents = 0;
    const orderItems = items.map(item => {
      const product = productMap.get(item.product_id);
      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const itemTotal = Math.round(product.price * 100 * item.quantity);
      totalAmountCents += itemTotal;

      return {
        name: product.name,
        quantity: item.quantity.toString(),
        base_price_money: {
          amount: Math.round(product.price * 100),
          currency: "USD"
        }
      };
    });

    console.log(`💰 Creating Square checkout for total: $${(totalAmountCents / 100).toFixed(2)}`);

    // Create Square checkout request
    const checkoutRequest = {
      ask_for_shipping_address: true,
      merchant_support_email: buyer_email || "store@gleeworld.org",
      pre_populate_buyer_email: buyer_email || "",
      redirect_url: "https://gleeworld.org/store/success",
      order: {
        location_id: "main", // You might need to get this from Square
        line_items: orderItems
      }
    };

    // Make request to Square Checkout API
    const squareResponse = await fetch("https://connect.squareup.com/v2/online-checkout/payment-links", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${squareAccessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2023-10-18"
      },
      body: JSON.stringify(checkoutRequest)
    });

    if (!squareResponse.ok) {
      const errorData = await squareResponse.text();
      console.error("❌ Square API error:", errorData);
      throw new Error(`Square API error: ${squareResponse.status}`);
    }

    const checkoutData = await squareResponse.json();
    
    if (!checkoutData.payment_link) {
      console.error("❌ No payment link in Square response:", checkoutData);
      throw new Error("Failed to create Square checkout link");
    }

    console.log("✅ Square checkout created:", checkoutData.payment_link.id);

    // Store order record in database
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        stripe_session_id: checkoutData.payment_link.id, // Reusing this field for Square
        customer_email: buyer_email || "guest@gleeworld.org",
        amount: totalAmountCents,
        currency: "usd",
        status: "pending",
        items: items,
      });

    if (orderError) {
      console.error("⚠️ Warning: Failed to create order record:", orderError);
    } else {
      console.log("✅ Order record created successfully");
    }

    return new Response(JSON.stringify({ 
      url: checkoutData.payment_link.url,
      checkout_id: checkoutData.payment_link.id,
      total_amount: totalAmountCents / 100,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("💥 Square checkout creation failed:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Failed to create Square checkout session"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
