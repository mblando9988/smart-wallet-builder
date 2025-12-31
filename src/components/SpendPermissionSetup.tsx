import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Check, Loader2, AlertCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// USDC on Base mainnet
const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

interface SpendPermissionSetupProps {
  userAddress: string;
  onPermissionGranted?: () => void;
}

interface PermissionStatus {
  hasPermission: boolean;
  permission?: {
    allowance_usdc: number;
    expires_at: string;
    spender_address: string;
  };
}

export function SpendPermissionSetup({ userAddress, onPermissionGranted }: SpendPermissionSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);
  const [dailyLimit, setDailyLimit] = useState(1); // Default $1 daily limit
  const [agentAddress, setAgentAddress] = useState<string | null>(null);

  // Check existing permission and get agent wallet
  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        // Get or create agent wallet
        const { data: walletData, error: walletError } = await supabase.functions.invoke("create-agent-wallet", {
          body: {},
        });

        if (walletError) {
          console.error("Wallet error:", walletError);
        } else if (walletData?.smartAccountAddress) {
          setAgentAddress(walletData.smartAccountAddress);
        }

        // Check permission status
        const { data, error } = await supabase.functions.invoke("check-spend-permission", {
          body: { userAddress },
        });

        if (error) {
          console.error("Check permission error:", error);
        } else {
          setPermissionStatus(data);
        }
      } catch (err) {
        console.error("Failed to check status:", err);
      } finally {
        setIsChecking(false);
      }
    };

    if (userAddress) {
      checkStatus();
    }
  }, [userAddress]);

  const handleSetupPermission = async () => {
    if (!agentAddress) {
      toast({
        title: "Agent wallet not ready",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In production, you would use the Base Account SDK to request the permission
      // For now, we'll simulate storing the permission
      const { data, error } = await supabase.functions.invoke("store-spend-permission", {
        body: {
          userAddress,
          spenderAddress: agentAddress,
          tokenAddress: USDC_BASE_ADDRESS,
          allowanceUsdc: dailyLimit,
          periodDays: 1,
          permissionData: {
            note: "Demo permission - integrate with @base-org/account SDK for production",
          },
        },
      });

      if (error) throw error;

      setPermissionStatus({
        hasPermission: true,
        permission: data.permission,
      });

      toast({
        title: "Spend permission granted",
        description: `The agent can now spend up to $${dailyLimit} USDC daily on your behalf.`,
      });

      onPermissionGranted?.();
    } catch (err) {
      console.error("Setup permission error:", err);
      toast({
        title: "Failed to set up permission",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-6"
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </motion.div>
    );
  }

  if (permissionStatus?.hasPermission) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Spend Permission Active</h3>
            <p className="text-xs text-muted-foreground">
              ${permissionStatus.permission?.allowance_usdc} USDC daily limit
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          The AI agent can execute transactions on your behalf within this limit.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Set Up Spend Permission</h3>
          <p className="text-xs text-muted-foreground">
            Allow the agent to transact on your behalf
          </p>
        </div>
      </div>

      {/* Daily Limit Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Daily Limit (USDC)</label>
        <div className="flex gap-2">
          {[1, 2, 5].map((amount) => (
            <Button
              key={amount}
              variant={dailyLimit === amount ? "default" : "outline"}
              size="sm"
              onClick={() => setDailyLimit(amount)}
              className="flex-1 min-h-[44px]"
            >
              <DollarSign className="h-3 w-3 mr-1" />
              {amount}
            </Button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/50">
        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          This permission allows the AI agent to spend up to ${dailyLimit} USDC per day from your wallet. 
          You can revoke this permission at any time.
        </p>
      </div>

      {/* CTA */}
      <Button
        onClick={handleSetupPermission}
        disabled={isLoading || !agentAddress}
        className="w-full min-h-[48px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Setting up...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Grant Spend Permission
          </>
        )}
      </Button>
    </motion.div>
  );
}
