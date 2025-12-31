import { motion } from "framer-motion";
import { ArrowLeftRight, Settings2, TrendingUp, RefreshCw, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠", balance: "2.4521" },
  { symbol: "USDC", name: "USD Coin", icon: "◉", balance: "5,432.00" },
  { symbol: "WETH", name: "Wrapped ETH", icon: "⟠", balance: "0.8912" },
];

const routes = [
  { name: "0x Protocol", price: "1,683.45", gas: "$0.02", total: "1,683.43", best: true },
  { name: "1inch", price: "1,681.20", gas: "$0.03", total: "1,681.17" },
  { name: "Aerodrome", price: "1,684.10", gas: "$0.05", total: "1,684.05" },
];

export function SwapInterface() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [amount, setAmount] = useState("0.5");
  const [showRoutes, setShowRoutes] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Swap</h2>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Swap Card */}
      <div className="gradient-border rounded-2xl p-4 relative">
        <div className="space-y-2">
          {/* From Token */}
          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">From</span>
              <span className="text-xs text-muted-foreground">
                Balance: {fromToken.balance}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-bold focus:outline-none"
                placeholder="0.0"
              />
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <span className="text-xl">{fromToken.icon}</span>
                <span className="font-semibold">{fromToken.symbol}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button className="p-2 rounded-full bg-secondary border-4 border-card hover:bg-muted transition-colors">
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* To Token */}
          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">To</span>
              <span className="text-xs text-muted-foreground">
                Balance: {toToken.balance}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex-1 text-2xl font-bold text-muted-foreground">
                ~1,683.45
              </span>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <span className="text-xl">{toToken.icon}</span>
                <span className="font-semibold">{toToken.symbol}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Rate Info */}
        <div className="mt-4 p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm">1 ETH = 3,367.12 USDC</span>
          </div>
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Route Comparison */}
      <div className="space-y-3">
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="font-medium">Compare Routes</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            showRoutes && "rotate-180"
          )} />
        </button>

        {showRoutes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {routes.map((route) => (
              <div
                key={route.name}
                className={cn(
                  "glass rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all",
                  route.best && "ring-1 ring-success/50 bg-success/5"
                )}
              >
                <div className="flex items-center gap-3">
                  {route.best && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-success/20 text-success">
                      Best
                    </span>
                  )}
                  <span className="font-medium text-sm">{route.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{route.total} USDC</p>
                  <p className="text-xs text-muted-foreground">Gas: {route.gas}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Swap Button */}
      <Button variant="gradient" size="lg" className="w-full">
        Swap {amount} ETH for USDC
      </Button>
    </motion.div>
  );
}
