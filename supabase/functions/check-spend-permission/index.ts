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
    const { userAddress } = await req.json();

    if (!userAddress) {
      throw new Error("Missing user address");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get active permission for user
    const { data: permission, error } = await supabase
      .from("spend_permissions")
      .select("*")
      .eq("user_address", userAddress.toLowerCase())
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch permission:", error);
      throw new Error("Failed to check spend permission");
    }

    // Check if permission is expired
    if (permission && permission.expires_at) {
      const expiresAt = new Date(permission.expires_at);
      if (expiresAt < new Date()) {
        // Mark as inactive
        await supabase
          .from("spend_permissions")
          .update({ is_active: false })
          .eq("id", permission.id);

        return new Response(JSON.stringify({
          hasPermission: false,
          message: "Spend permission has expired",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({
      hasPermission: !!permission,
      permission: permission || null,
      message: permission 
        ? `Active: $${permission.allowance_usdc} USDC daily limit`
        : "No active spend permission",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Check permission error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to check permission";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
