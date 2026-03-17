import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Bell,
  Camera,
  ChevronRight,
  Clock,
  FlaskConical,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Scan,
  Wifi,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { AppHeader } from "../components/AppShell";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile, useUserProfile } from "../hooks/useQueries";

const ROLE_LABELS: Record<string, string> = {
  farmer: "🌾 Magsasaka (Farmer)",
  consumer: "🛒 Mamimili (Consumer)",
  ngo: "🤝 NGO / Organization",
};

interface SensorValues {
  moisture: number;
  temperature: number;
  windSpeed: number;
}

function useSensorAnimation(): SensorValues {
  const [values, setValues] = useState<SensorValues>({
    moisture: 42.8,
    temperature: 31.2,
    windSpeed: 12.4,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((prev) => ({
        moisture: Math.max(
          0,
          Math.min(100, prev.moisture + (Math.random() - 0.5) * 1.0),
        ),
        temperature: Math.max(
          0,
          Math.min(50, prev.temperature + (Math.random() - 0.5) * 0.4),
        ),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 0.6),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return values;
}

interface ProfileScreenProps {
  userName: string;
}

interface EditFormState {
  displayName: string;
  phone: string;
  email: string;
  location: string;
  role: string;
}

export function ProfileScreen({ userName }: ProfileScreenProps) {
  const { data: profile, isLoading } = useUserProfile();
  const saveProfileMutation = useSaveUserProfile();
  const { clear, identity } = useInternetIdentity();
  const principalEmail = identity?.getPrincipal().toString() ?? "Anonymous";
  const sensor = useSensorAnimation();
  const [scanning, setScanning] = useState(false);

  // Local profile state — hydrate from backend profile when available
  const [localProfile, setLocalProfile] = useState<EditFormState>({
    displayName: "",
    phone: "0991-9920-187",
    email: "ramirezvogne@gmail.com",
    location: "Brgy.15, Laoag City, Ilocos Norte",
    role: "farmer",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>(localProfile);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings toggles
  const [pushNotif, setPushNotif] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Hydrate name/role from backend when profile loads
  useEffect(() => {
    if (profile) {
      setLocalProfile((prev) => ({
        ...prev,
        displayName: profile.name || prev.displayName,
        role: profile.role || prev.role,
      }));
    }
  }, [profile]);

  // Ensure dark mode is always off
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("agrilife-dark-mode");
    } catch {
      /* ignore */
    }
  }, []);

  const displayName = localProfile.displayName || profile?.name || userName;

  const handleOpenEdit = () => {
    setEditForm({
      ...localProfile,
      displayName: localProfile.displayName || profile?.name || userName,
    });
    setEditAvatarUrl(avatarUrl);
    setEditOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditAvatarUrl(url);
  };

  const handleSaveProfile = async () => {
    const prevProfile = { ...localProfile };
    const roleValue = (editForm.role as UserRole) ?? UserRole.farmer;

    // Optimistically update UI
    setLocalProfile(editForm);
    if (editAvatarUrl !== avatarUrl) {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
      setAvatarUrl(editAvatarUrl);
    }
    setEditOpen(false);

    try {
      await saveProfileMutation.mutateAsync({
        name: editForm.displayName,
        role: roleValue,
      });
      toast.success("Profile saved!");
    } catch {
      // Revert on error
      setLocalProfile(prevProfile);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleScan = () => {
    if (scanning) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success(
        "Scan complete! Soil health: Good. No pests detected. NPK: Balanced.",
      );
    }, 2000);
  };

  const handleRec = () => toast.info("Feature coming soon! 🌱");

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName={userName} subtitle="My Profile" />

      <main
        className="flex-1 bg-background overflow-y-auto pb-28"
        style={{
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          marginTop: "-12px",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div className="px-4 py-5 space-y-5">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-5 shadow-card text-center"
          >
            <button
              type="button"
              onClick={handleOpenEdit}
              data-ocid="profile.edit_button"
              className="relative w-20 h-20 mx-auto mb-3 group cursor-pointer"
              aria-label="Edit profile"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-display font-bold text-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.52 0.14 145))",
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-agri-forest rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Pencil className="w-3 h-3 text-white" />
              </span>
            </button>

            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-agri-forest mx-auto" />
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  data-ocid="profile.edit_button"
                >
                  <h2 className="font-display font-bold text-xl text-foreground">
                    {displayName}
                  </h2>
                </button>
                <p className="text-muted-foreground text-sm mt-0.5 truncate max-w-full px-4">
                  {localProfile.email || principalEmail}
                </p>
                <span
                  className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "oklch(0.93 0.04 145)",
                    color: "oklch(0.33 0.11 145)",
                  }}
                >
                  {ROLE_LABELS[localProfile.role] ??
                    ROLE_LABELS[profile?.role ?? ""] ??
                    profile?.role}
                </span>
              </>
            )}
          </motion.div>

          {/* Edit Profile Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="rounded-3xl max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-lg text-agri-forest">
                  Edit Profile
                </DialogTitle>
              </DialogHeader>

              {/* Avatar picker */}
              <div className="flex flex-col items-center gap-2 mb-1">
                <div className="relative">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-display font-bold text-3xl"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.52 0.14 145))",
                      }}
                    >
                      {editForm.displayName.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="profile.upload_button"
                  className="flex items-center gap-1.5 text-xs font-semibold text-agri-forest hover:opacity-75 transition-opacity cursor-pointer px-3 py-1.5 rounded-full bg-agri-pale"
                >
                  <Camera className="w-3.5 h-3.5" /> Change Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="edit-name"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Display Name
                  </Label>
                  <Input
                    id="edit-name"
                    data-ocid="profile.input"
                    value={editForm.displayName}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        displayName: e.target.value,
                      }))
                    }
                    className="mt-1 rounded-xl"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-phone"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Phone
                  </Label>
                  <Input
                    id="edit-phone"
                    data-ocid="profile.input"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="mt-1 rounded-xl"
                    placeholder="0900-000-0000"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-email"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    data-ocid="profile.input"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="mt-1 rounded-xl"
                    type="email"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-location"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    data-ocid="profile.input"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, location: e.target.value }))
                    }
                    className="mt-1 rounded-xl"
                    placeholder="City, Province"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Role
                  </Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(v) =>
                      setEditForm((p) => ({ ...p, role: v }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="profile.select"
                      className="mt-1 rounded-xl"
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">
                        🌾 Magsasaka (Farmer)
                      </SelectItem>
                      <SelectItem value="consumer">
                        🛒 Mamimili (Consumer)
                      </SelectItem>
                      <SelectItem value="ngo">🤝 NGO / Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  data-ocid="profile.cancel_button"
                  className="flex-1 rounded-xl"
                  onClick={() => setEditOpen(false)}
                  disabled={saveProfileMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="profile.save_button"
                  className="flex-1 rounded-xl bg-agri-forest hover:bg-agri-forest/90 text-white"
                  onClick={handleSaveProfile}
                  disabled={saveProfileMutation.isPending}
                >
                  {saveProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* AgriTech Hub */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="rounded-3xl p-5 text-white mb-1"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.41 0.13 145))",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="w-5 h-5 text-white/80" />
                <div>
                  <h3 className="font-display font-bold text-lg">
                    AgriTech Hub
                  </h3>
                  <p className="text-white/70 text-xs">
                    Live Sync · Field Sensors
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <SensorCard
                  icon={<Activity className="w-4 h-4" />}
                  label="Soil Moisture"
                  value={`${sensor.moisture.toFixed(1)}%`}
                />
                <SensorCard
                  icon={<Activity className="w-4 h-4" />}
                  label="Temperature"
                  value={`${sensor.temperature.toFixed(1)}°C`}
                />
                <SensorCard
                  icon={<Wind className="w-4 h-4" />}
                  label="Wind Speed"
                  value={`${sensor.windSpeed.toFixed(1)} km/h`}
                />
                <SensorCard
                  icon={<FlaskConical className="w-4 h-4" />}
                  label="NPK Levels"
                  value="Optimal"
                />
              </div>
              <button
                type="button"
                onClick={handleScan}
                disabled={scanning}
                className="w-full py-2.5 rounded-xl bg-white/20 font-bold text-sm hover:bg-white/30 active:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                data-ocid="profile.scan.button"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" /> Run Diagnostic Scan →
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <div className="bg-card rounded-3xl p-5 shadow-card">
              <h3 className="font-display font-bold text-base text-foreground mb-4">
                Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-agri-pale flex items-center justify-center">
                      <Bell className="w-4 h-4 text-agri-forest" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Push Notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Farm alerts & updates
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotif}
                    data-ocid="profile.switch"
                    onCheckedChange={(v) => {
                      setPushNotif(v);
                      toast.success(
                        v ? "Notifications enabled" : "Notifications disabled",
                      );
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-agri-pale flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-agri-forest" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        SMS Alerts
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Text messages for critical events
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={smsAlerts}
                    data-ocid="profile.switch"
                    onCheckedChange={(v) => {
                      setSmsAlerts(v);
                      toast.success(
                        v ? "SMS alerts enabled" : "SMS alerts disabled",
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visit Us */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="bg-card rounded-3xl p-5 shadow-card">
              <h3 className="font-display font-bold text-base text-foreground mb-3">
                Visit Us at Agri-Life
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-4 h-4 text-agri-forest flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">
                    {localProfile.location}
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <Clock className="w-4 h-4 text-agri-forest flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">
                    Mon-Fri 10am–5pm · Sat 1pm–5pm
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone className="w-4 h-4 text-agri-forest flex-shrink-0 mt-0.5" />
                  <a
                    href={`tel:${localProfile.phone}`}
                    data-ocid="profile.link"
                    className="text-agri-forest font-semibold hover:underline active:opacity-70 transition-opacity"
                  >
                    {localProfile.phone}
                  </a>
                </div>
                <div className="flex gap-3 items-start">
                  <Mail className="w-4 h-4 text-agri-forest flex-shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${localProfile.email}`}
                    data-ocid="profile.link"
                    className="text-agri-forest font-semibold hover:underline active:opacity-70 transition-opacity break-all"
                  >
                    {localProfile.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-agri-pale rounded-3xl p-5">
              <h3 className="font-display font-bold text-base text-agri-forest mb-3">
                Recommended for You
              </h3>
              <div className="space-y-2">
                {[
                  "Try Bokashi composting to improve your soil health!",
                  "Join the upcoming SmartFarm workshop this Saturday.",
                  "Check the latest market prices for Palay in Region I.",
                ].map((rec, i) => (
                  <motion.button
                    type="button"
                    key={rec}
                    onClick={handleRec}
                    whileTap={{ scale: 0.97 }}
                    data-ocid={`profile.rec.button.${i + 1}`}
                    className="w-full flex items-start gap-2 text-sm text-left cursor-pointer hover:opacity-75 transition-opacity py-1 rounded-lg"
                  >
                    <ChevronRight className="w-4 h-4 text-agri-forest flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{rec}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Log out */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Button
              variant="outline"
              data-ocid="profile.logout.button"
              className="w-full h-12 rounded-2xl font-bold text-destructive border-destructive/30 hover:bg-destructive/5 cursor-pointer"
              onClick={() => clear()}
            >
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </Button>
          </motion.div>

          {/* Footer */}
          <footer className="text-center pb-4">
            <p className="text-xs text-muted-foreground">
              Thank you for using AgriLife
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function SensorCard({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      key={value}
      animate={{ opacity: [0.6, 1] }}
      transition={{ duration: 0.4 }}
      className="bg-white/15 rounded-xl p-3"
    >
      <div className="flex items-center gap-1.5 mb-1 text-white/70">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="font-display font-bold text-white text-lg">{value}</p>
    </motion.div>
  );
}
