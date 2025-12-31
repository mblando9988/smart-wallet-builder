import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { PortfolioTracker } from "@/components/PortfolioTracker";
import { AIChatInterface } from "@/components/AIChatInterface";
import { SwapInterface } from "@/components/SwapInterface";
import { ContractDeployer } from "@/components/ContractDeployer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <PortfolioTracker />;
      case "chat":
        return <AIChatInterface />;
      case "swap":
        return <SwapInterface />;
      case "contracts":
        return <ContractDeployer />;
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-64"
          >
            <p className="text-muted-foreground">Settings coming soon...</p>
          </motion.div>
        );
      default:
        return <PortfolioTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Compact for mobile per Base guidelines */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Base AI Agent</h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Your Web3 Assistant
            </p>
          </div>
        </div>
        <WalletConnect />
      </header>

      {/* Main Content Area - Mobile optimized with safe area padding */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className={activeTab === "chat" ? "h-[calc(100vh-180px)]" : ""}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation - Per Base mini-app guidelines */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
