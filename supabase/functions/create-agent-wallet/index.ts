import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CDP_API_KEY_NAME = Deno.env.get("CDP_API_KEY_NAME");
    const CDP_API_KEY_SECRET = Deno.env.get("CDP_API_KEY_SECRET");

    if (!CDP_API_KEY_NAME || !CDP_API_KEY_SECRET) {
      throw new Error("CDP API credentials not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we already have an agent wallet
    const { data: existingWallet } = await supabase
      .from("agent_wallets")
      .select("*")
      .limit(1)
      .single();

    if (existingWallet) {
      console.log("Returning existing agent wallet:", existingWallet.smart_account_address);
      return new Response(JSON.stringify({
        walletId: existingWallet.wallet_id,
        smartAccountAddress: existingWallet.smart_account_address,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create new CDP server wallet
    // Note: In production, you would call CDP's API to create a wallet
    // For now, we'll generate a placeholder that can be replaced with real CDP integration
    const walletId = `wallet_${crypto.randomUUID()}`;
    
    // This would normally come from CDP API - using placeholder for now
    // The user needs to implement actual CDP wallet creation
    const smartAccountAddress = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Store the wallet
    const { error: insertError } = await supabase
      .from("agent_wallets")
      .insert({
        wallet_id: walletId,
        smart_account_address: smartAccountAddress,
      });

    if (insertError) {
      console.error("Failed to store wallet:", insertError);
      throw new Error("Failed to create agent wallet");
    }

    console.log("Created new agent wallet:", smartAccountAddress);

    return new Response(JSON.stringify({
      walletId,
      smartAccountAddress,
      message: "Agent wallet created. Note: For production, integrate with CDP Server Wallets API.",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Create wallet error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create wallet";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
