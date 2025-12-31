import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { TokenChip, TokenRow } from "@coinbase/onchainkit/token";
import type { Token } from "@coinbase/onchainkit/token";
import { cn } from "@/lib/utils";

// Base network tokens with real addresses
const tokens: (Token & { balance: string; value: string; change: number })[] = [
  {
    address: "",
    chainId: 8453,
    decimals: 18,
    image: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
    name: "Ethereum",
    symbol: "ETH",
    balance: "2.4521",
    value: "$8,245.67",
    change: 3.24,
  },
  {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chainId: 8453,
    decimals: 6,
    image: "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
    name: "USD Coin",
    symbol: "USDC",
    balance: "5,432.00",
    value: "$5,432.00",
    change: 0.01,
  },
  {
    address: "0x4200000000000000000000000000000000000006",
    chainId: 8453,
    decimals: 18,
    image: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
    name: "Wrapped ETH",
    symbol: "WETH",
    balance: "0.8912",
    value: "$2,998.45",
    change: 3.18,
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

      {/* Token Chips - OnchainKit Component */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        {tokens.map((token) => (
          <TokenChip
            key={token.symbol}
            token={token}
            isPressable={false}
            className="!bg-secondary/80 !shadow-none"
          />
        ))}
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

      {/* Token List - OnchainKit TokenRow */}
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
              className="glass rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 hover:bg-secondary/60 transition-all duration-200 cursor-pointer group">
                <TokenRow
                  token={token}
                  amount={token.balance}
                  hideSymbol
                  as="div"
                  className="!p-0 flex-1"
                />
                <div className="text-right ml-4">
                  <p className="font-semibold">{token.value}</p>
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
