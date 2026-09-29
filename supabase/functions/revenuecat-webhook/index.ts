import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

serve(async (req) => {
  // Security check: Match bearer token with REVENUECAT_WEBHOOK_SECRET if configured
  const authHeader = req.headers.get("Authorization");
  const webhookSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
  if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
    console.error("Unauthorized webhook request: invalid bearer token");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await req.json();
    const event = payload.event;
    
    if (!event) {
      return new Response("No event payload found", { status: 400 });
    }

    const eventType = event.type;
    const userId = event.app_user_id;
    const entitlementIds = event.entitlement_ids || [];

    console.log(`Received RevenueCat event: ${eventType} for user ${userId}`);

    if (userId) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      let isPremium = false;
      let shouldUpdate = false;

      const entitlementId = "MuscliKnot Pro";

      // Determine the state based on event type
      if (
        eventType === "INITIAL_PURCHASE" ||
        eventType === "RENEWAL" ||
        eventType === "UNCANCELLATION" ||
        eventType === "TRANSFER"
      ) {
        if (entitlementIds.length > 0 || entitlementIds.includes(entitlementId)) {
          isPremium = true;
          shouldUpdate = true;
        }
      } else if (eventType === "EXPIRATION" || eventType === "REVOCATION") {
        isPremium = false;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        console.log(`Updating database for user ${userId}: is_premium = ${isPremium}`);
        const updates = [
          supabaseAdmin.from('user_stats').update({ is_premium: isPremium }).eq('user_id', userId),
          supabaseAdmin.from('profiles').update({ is_premium: isPremium }).eq('id', userId)
        ];

        const results = await Promise.all(updates);
        const finalError = results.every(r => r.error) ? results[0].error : null;

        if (finalError) {
          console.error(`Database update failed for user ${userId}:`, finalError);
          return new Response(`Database update failed: ${finalError.message}`, { status: 500 });
        }

        console.log(`Successfully synced user ${userId} premium status to ${isPremium}`);
      } else {
        console.log(`Event type ${eventType} does not require a database premium state change.`);
      }
    } else {
      console.warn("No app_user_id found in RevenueCat event.");
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Error processing RevenueCat webhook:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
