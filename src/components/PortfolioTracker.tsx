import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenData {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: number;
  icon: string;
}

const tokens: TokenData[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "2.4521",
    value: "$8,245.67",
    change: 3.24,
    icon: "⟠",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "5,432.00",
    value: "$5,432.00",
    change: 0.01,
    icon: "◉",
  },
  {
    symbol: "WETH",
    name: "Wrapped ETH",
    balance: "0.8912",
    value: "$2,998.45",
    change: 3.18,
    icon: "⟠",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function PortfolioTracker() {
  const totalValue = "$16,676.12";
  const totalChange = 2.87;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Total Portfolio Value */}
      <motion.div
        variants={itemVariants}
        className="gradient-border rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Total Portfolio Value</span>
          </div>
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-bold tracking-tight gradient-text">
              {totalValue}
            </h2>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium pb-1",
              totalChange >= 0 ? "text-success" : "text-destructive"
            )}>
              {totalChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{Math.abs(totalChange)}%</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Base Network • Updated just now
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 text-center">
          <TrendingUp className="h-5 w-5 text-success mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">24h Gain</p>
          <p className="text-sm font-semibold text-success">+$465.23</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <Sparkles className="h-5 w-5 text-accent mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Assets</p>
          <p className="text-sm font-semibold">3 Tokens</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <Wallet className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="text-sm font-semibold">24 Total</p>
        </div>
      </motion.div>

      {/* Token List */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Assets
        </h3>
        <div className="space-y-2">
          {tokens.map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass rounded-xl p-4 flex items-center justify-between hover:bg-secondary/60 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {token.icon}
                </div>
                <div>
                  <p className="font-semibold">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{token.value}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    {token.balance} {token.symbol}
                  </span>
                  <span className={cn(
                    "text-xs font-medium",
                    token.change >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {token.change >= 0 ? "+" : ""}{token.change}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
