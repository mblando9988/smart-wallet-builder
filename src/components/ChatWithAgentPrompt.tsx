import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWithAgentPromptProps {
  agentAddress: string;
  onDismiss: () => void;
}

export function ChatWithAgentPrompt({ agentAddress, onDismiss }: ChatWithAgentPromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChat = () => {
    setIsLoading(true);
    try {
      const deeplink = `cbwallet://messaging/${agentAddress}`;
      
      if (typeof window !== "undefined") {
        window.location.href = deeplink;
      }
    } catch (error) {
      console.error("Failed to open deeplink:", error);
    } finally {
      // Reset after a delay to handle cases where the app doesn't navigate away
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed bottom-24 left-4 right-4 z-40 max-w-lg mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">Chat with Base AI Agent</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Get personalized help via direct message in Base App
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleOpenChat}
                size="sm"
                className="min-h-[40px] gap-2"
                disabled={isLoading}
              >
                <MessageCircle className="h-4 w-4" />
                {isLoading ? "Opening..." : "Start Chat"}
              </Button>
              <Button
                onClick={onDismiss}
                variant="ghost"
                size="sm"
                className="min-h-[40px] text-muted-foreground"
              >
                Maybe later
              </Button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground active:text-foreground transition-colors -mr-2 -mt-2"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
