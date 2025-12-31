import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ChevronDown, Copy, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const mockAddress = "0x7a23...d4f8";
  const fullAddress = "0x7a2391c8E3B99f5C6e9a23D4F8e6c3B5A9d4f8E3";

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        variant="gradient"
        className={cn("gap-2", className)}
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
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
        <span className="font-mono text-sm">{mockAddress}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isDropdownOpen && "rotate-180"
        )} />
      </Button>

      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="absolute right-0 top-full mt-2 w-64 glass rounded-xl p-3 z-50"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Connected</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
                Base Network
              </span>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary">
              <span className="font-mono text-xs text-muted-foreground truncate flex-1">
                {fullAddress}
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
                href={`https://basescan.org/address/${fullAddress}`}
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
                  setIsConnected(false);
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
    </div>
  );
}
