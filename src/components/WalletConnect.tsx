import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronDown, Copy, ExternalLink, Check, Loader2 } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { base, baseSepolia } from "@/lib/wagmi";

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { data: balance } = useBalance({
    address,
  });

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExplorerUrl = () => {
    const baseUrl = chain?.id === baseSepolia.id 
      ? "https://sepolia.basescan.org" 
      : "https://basescan.org";
    return `${baseUrl}/address/${address}`;
  };

  const getNetworkName = () => {
    if (chain?.id === base.id) return "Base";
    if (chain?.id === baseSepolia.id) return "Base Sepolia";
    return chain?.name || "Unknown";
  };

  if (!isConnected) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            variant="gradient"
            className="gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {connector.name === "Coinbase Wallet" ? "Smart Wallet" : connector.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="glass"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Wallet className="h-3 w-3 text-primary-foreground" />
        </div>
        <span className="font-mono text-sm">{truncatedAddress}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isDropdownOpen && "rotate-180"
        )} />
      </Button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-full mt-2 w-72 glass rounded-xl p-4 z-50"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Connected</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
                  {getNetworkName()}
                </span>
              </div>

              {/* Balance */}
              {balance && (
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Balance</p>
                  <p className="text-lg font-semibold">
                    {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
                  </p>
                </div>
              )}
              
              {/* Address */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary">
                <span className="font-mono text-xs text-muted-foreground truncate flex-1">
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </div>

              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => {
                    disconnect();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-sm text-destructive hover:bg-destructive/10 rounded-lg py-2 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
