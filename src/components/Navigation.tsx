import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  ArrowLeftRight, 
  FileCode, 
  Settings,
  Zap
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
  { id: "contracts", label: "Contracts", icon: FileCode },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border px-2 py-2 z-50 md:relative md:border-t-0 md:border-r md:w-20 md:h-full md:flex md:flex-col md:py-6">
      {/* Logo - Only visible on desktop */}
      <div className="hidden md:flex items-center justify-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex items-center justify-around md:flex-col md:gap-2 md:items-center md:justify-start md:flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 md:w-14 md:h-14 md:justify-center",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon className="h-5 w-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10 md:hidden">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
