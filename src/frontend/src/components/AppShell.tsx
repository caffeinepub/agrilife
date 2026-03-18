import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Bell,
  CheckCircle2,
  Droplets,
  MessageSquare,
  Wheat,
} from "lucide-react";
import React, { useState } from "react";

const NOTIFICATIONS = [
  {
    id: 1,
    icon: <Wheat className="w-4 h-4" />,
    iconBg: "oklch(0.41 0.13 145)",
    title: "Harvest Ready!",
    message: "Your crop Palay (Dinorado) is ready for harvest.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    icon: <MessageSquare className="w-4 h-4" />,
    iconBg: "oklch(0.60 0.12 185)",
    title: "New Community Post",
    message: "Joseph Rizal shared an update in the community feed.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    icon: <Droplets className="w-4 h-4" />,
    iconBg: "oklch(0.55 0.18 240)",
    title: "Soil Moisture Alert",
    message: "Field A soil moisture is below 30%. Consider irrigation.",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 4,
    icon: <CheckCircle2 className="w-4 h-4" />,
    iconBg: "oklch(0.65 0.15 60)",
    title: "Workshop Reminder",
    message: "Organic composting workshop this Saturday at the community hall!",
    time: "1 day ago",
    unread: false,
  },
];

interface AppHeaderProps {
  userName: string;
  subtitle?: string;
}

export function AppHeader({ userName, subtitle }: AppHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const unreadCount = NOTIFICATIONS.filter(
    (n) => n.unread && !readIds.has(n.id),
  ).length;

  const handleOpenNotif = () => {
    setNotifOpen(true);
    // Mark all as read when opened
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  };

  return (
    <>
      <header
        className="relative z-10 px-5 pt-10 pb-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.41 0.13 145))",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <img
                src="/assets/uploads/AgriLearn-countrysid-2-1.png"
                alt="AgriLife logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-white font-display font-bold text-lg tracking-wide">
              AgriLife
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenNotif}
              className="relative w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/25 active:scale-95 transition-all"
              data-ocid="header.button"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
              )}
            </button>
            <Avatar className="w-9 h-9 border-2 border-white/30">
              <AvatarFallback
                className="text-xs font-bold"
                style={{ background: "oklch(0.52 0.14 145)", color: "white" }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          <p className="text-white/75 text-sm">{subtitle ?? today}</p>
          <h1 className="text-white font-display font-bold text-2xl mt-0.5">
            Magandang Araw, {userName.split(" ")[0]}!
          </h1>
        </div>
      </header>

      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[75vh] flex flex-col"
          data-ocid="header.sheet"
        >
          <SheetHeader className="pb-2">
            <SheetTitle className="font-display font-bold text-xl text-left">
              🔔 Notifications
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-3 pb-4">
              {NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.id}
                  className="flex gap-3 items-start p-3 rounded-2xl transition-colors"
                  style={{
                    background: readIds.has(notif.id)
                      ? "oklch(0.97 0.01 145)"
                      : "oklch(0.93 0.04 145)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: notif.iconBg }}
                  >
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {notif.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
