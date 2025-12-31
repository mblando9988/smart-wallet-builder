import { useState, useEffect } from "react";

const CHAT_PROMPT_KEY = "base-ai-agent-chat-prompt-dismissed";

export function useChatPrompt(isConnected: boolean) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem(CHAT_PROMPT_KEY);
    if (dismissed) {
      setHasDismissed(true);
    }
  }, []);

  useEffect(() => {
    // Show prompt when wallet connects and user hasn't dismissed before
    if (isConnected && !hasDismissed) {
      // Small delay to let the connection UI settle
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowPrompt(false);
    }
  }, [isConnected, hasDismissed]);

  const dismissPrompt = () => {
    setShowPrompt(false);
    setHasDismissed(true);
    localStorage.setItem(CHAT_PROMPT_KEY, "true");
  };

  const resetPrompt = () => {
    localStorage.removeItem(CHAT_PROMPT_KEY);
    setHasDismissed(false);
  };

  return {
    showPrompt,
    dismissPrompt,
    resetPrompt,
  };
}
