import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Wallet, MessageSquare, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Zap,
    title: "Welcome to Base AI Agent",
    description: "Your intelligent Web3 assistant on Base. Manage assets, swap tokens, and deploy contracts — all in one place.",
    color: "bg-primary",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Assistance",
    description: "Chat with our AI to get help with transactions, understand DeFi concepts, or get guidance on your next move.",
    color: "bg-primary",
  },
  {
    icon: ArrowLeftRight,
    title: "Swap & Transact",
    description: "Connect your wallet to swap tokens instantly on Base. Fast, secure, and gasless with Smart Wallet.",
    color: "bg-primary",
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground min-h-[44px] min-w-[44px] flex items-center justify-center active:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-lg">
              <Icon className="h-10 w-10 text-primary-foreground" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-4 leading-tight">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-6 space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full min-h-[52px] text-base font-semibold gap-2"
        >
          {isLastSlide ? (
            <>
              <Wallet className="h-5 w-5" />
              Get Started
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
