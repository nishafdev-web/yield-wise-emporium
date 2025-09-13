import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Get cart items from request body
    const { cartItems } = await req.json();
    if (!cartItems || cartItems.length === 0) {
      throw new Error("No items in cart");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create line items for Stripe checkout
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.products?.name || 'Product',
          description: `Agricultural product - ${item.products?.name}`,
        },
        unit_amount: Math.round((item.products?.price || 0) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Calculate total amount for order creation
    const totalAmount = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.products?.price || 0) * item.quantity;
    }, 0);

    // Create order record in database
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: 'To be provided',
        shipping_city: 'To be provided',
        phone: 'To be provided'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    for (const item of cartItems) {
      const { error: itemError } = await supabaseClient
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.products?.price || 0
        });

      if (itemError) throw itemError;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      metadata: {
        order_id: orderData.id,
        user_id: user.id
      }
    });

    console.log("Payment session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});