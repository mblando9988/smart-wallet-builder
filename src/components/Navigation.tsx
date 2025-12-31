import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  ArrowLeftRight, 
  FileCode, 
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "swap", label: "Swap", icon: ArrowLeftRight },
  { id: "contracts", label: "Deploy", icon: FileCode },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-2 z-50 safe-area-bottom">
      {/* Nav Items - Mobile Bottom Tab Bar per Base guidelines */}
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                // 44px minimum touch target per Base guidelines
                "relative flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-colors",
                // Active/inactive states without hover-only effects
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground active:bg-secondary/50"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                />
              )}
              <Icon className="h-5 w-5 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
              {/* Labels always visible per Base guidelines */}
              <span className={cn(
                "text-[11px] font-medium relative z-10 leading-tight",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
