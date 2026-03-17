import { BookOpen, Home, Sprout, User, Users } from "lucide-react";
import type React from "react";

export type TabId = "home" | "crops" | "community" | "blog" | "profile";

const tabs: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "crops", label: "My Crops", Icon: Sprout },
  { id: "community", label: "Community", Icon: Users },
  { id: "blog", label: "Blog", Icon: BookOpen },
  { id: "profile", label: "Profile", Icon: User },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => onChange(id)}
              data-ocid={`nav.${id}.tab`}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            >
              <div
                className={`w-10 h-7 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? "bg-agri-pale" : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-agri-forest" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive ? "text-agri-forest" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      {/* iOS home indicator */}
      <div className="flex justify-center pb-1">
        <div className="w-28 h-1 rounded-full bg-foreground/20" />
      </div>
    </nav>
  );
}
