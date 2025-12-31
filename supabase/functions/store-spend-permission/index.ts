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
    const { userAddress, spenderAddress, tokenAddress, allowanceUsdc, periodDays, permissionData } = await req.json();

    if (!userAddress || !spenderAddress || !tokenAddress || !allowanceUsdc) {
      throw new Error("Missing required fields");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Deactivate any existing permissions for this user
    await supabase
      .from("spend_permissions")
      .update({ is_active: false })
      .eq("user_address", userAddress.toLowerCase())
      .eq("is_active", true);

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (periodDays || 1));

    // Store the new permission
    const { data, error } = await supabase
      .from("spend_permissions")
      .insert({
        user_address: userAddress.toLowerCase(),
        spender_address: spenderAddress.toLowerCase(),
        token_address: tokenAddress.toLowerCase(),
        chain_id: 8453,
        allowance_usdc: allowanceUsdc,
        period_days: periodDays || 1,
        permission_data: permissionData,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to store permission:", error);
      throw new Error("Failed to store spend permission");
    }

    console.log("Stored spend permission for:", userAddress);

    return new Response(JSON.stringify({
      success: true,
      permission: data,
      message: `Spend permission granted: $${allowanceUsdc} USDC daily limit`,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Store permission error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to store permission";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
