import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import Stripe from "https://esm.sh/stripe@14.16.0?target=deno";

// Set up Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Since Edge Functions run in Deno, use this crypto provider
const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  
  if (!signature) {
    return new Response("No signature provided", { status: 400 });
  }

  const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!endpointSecret) {
    console.error("No STRIPE_WEBHOOK_SECRET set in edge function env");
    return new Response("Webhook secret configured improperly", { status: 500 });
  }

  const body = await req.text();
  let receivedEvent;

  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      endpointSecret,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error("Signature verification failed", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  // Handle the event
  console.log(`Received event: ${receivedEvent.type}`);

  if (receivedEvent.type === "checkout.session.completed") {
    // The payment is successful and the subscription is created
    const session = receivedEvent.data.object as Stripe.Checkout.Session;
    
    // This is the user id we passed securely in expo-web-browser
    const userId = session.client_reference_id;
    
    if (userId) {
      // Connect to supabase admin to bypass RLS
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Try to update both tables to be safe. We ignore individual errors 
      // as long as one of them succeeds.
      const updates = [
        supabaseAdmin.from('user_stats').update({ is_premium: true }).eq('user_id', userId),
        supabaseAdmin.from('profiles').update({ is_premium: true }).eq('id', userId)
      ];

      const results = await Promise.all(updates);
      const finalError = results.every(r => r.error) ? results[0].error : null;

      if (finalError) {
        console.error("Error updating user premium status:", finalError);
        return new Response(`Database update failed: ${finalError.message}`, { status: 500 });
      }

      console.log(`Successfully upgraded user ${userId} to Premium!`);
    } else {
      console.warn("No client_reference_id found on checkout session.");
    }
  }

  return new Response(JSON.stringify({ ok: true }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
});
