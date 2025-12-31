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
            className="flex items-center justify-center h-full"
          >
            <p className="text-muted-foreground">Settings coming soon...</p>
          </motion.div>
        );
      default:
        return <PortfolioTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center md:hidden">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Base AI Agent</h1>
              <p className="text-xs text-muted-foreground">
                Your Web3 Assistant on Base
              </p>
            </div>
          </div>
          <WalletConnect />
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-2xl mx-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={activeTab === "chat" ? "h-[calc(100vh-180px)] md:h-[calc(100vh-120px)]" : ""}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

export default Index;
