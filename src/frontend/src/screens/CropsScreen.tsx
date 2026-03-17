import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Droplets,
  FlaskConical,
  Heart,
  Loader2,
  Plus,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppShell";
import { useAddCropSnapshot, useCallerCrops } from "../hooks/useQueries";

const CROP_IMAGES: Record<string, string> = {
  rice: "/assets/generated/crop-rice-palay.dim_400x300.jpg",
  palay: "/assets/generated/crop-rice-palay.dim_400x300.jpg",
  corn: "/assets/generated/crop-corn-mais.dim_400x300.jpg",
  mais: "/assets/generated/crop-corn-mais.dim_400x300.jpg",
  eggplant: "/assets/generated/crop-eggplant-talong.dim_400x300.jpg",
  talong: "/assets/generated/crop-eggplant-talong.dim_400x300.jpg",
};

function getCropImage(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(CROP_IMAGES)) {
    if (lower.includes(key)) return CROP_IMAGES[key];
  }
  return "/assets/generated/crop-rice-palay.dim_400x300.jpg";
}

function getHealthBadge(health: bigint) {
  const h = Number(health);
  if (h >= 80)
    return {
      label: "Healthy",
      color: "oklch(0.41 0.13 145)",
      bg: "oklch(0.93 0.04 145)",
    };
  if (h >= 60)
    return {
      label: "Warning",
      color: "oklch(0.65 0.15 60)",
      bg: "oklch(0.95 0.05 60)",
    };
  return {
    label: "Alert",
    color: "oklch(0.55 0.22 27)",
    bg: "oklch(0.95 0.08 27)",
  };
}

const SAMPLE_CROPS = [
  {
    name: "Rice (Palay)",
    variety: "Dinorado",
    soilMoisture: BigInt(78),
    temperature: BigInt(28),
    expectedHarvest: "Oct 2025",
    health: BigInt(95),
  },
  {
    name: "Corn (Mais)",
    variety: "Yellow Sweet",
    soilMoisture: BigInt(65),
    temperature: BigInt(30),
    expectedHarvest: "Nov 2025",
    health: BigInt(88),
  },
  {
    name: "Eggplant (Talong)",
    variety: "Long Purple",
    soilMoisture: BigInt(70),
    temperature: BigInt(29),
    expectedHarvest: "Dec 2025",
    health: BigInt(72),
  },
];

interface CropsScreenProps {
  userName: string;
}

export function CropsScreen({ userName }: CropsScreenProps) {
  const { data: crops, isLoading } = useCallerCrops();
  const { mutate: addCrop, isPending } = useAddCropSnapshot();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    variety: "",
    soilMoisture: "",
    temperature: "",
    expectedHarvest: "",
    health: "",
  });

  const displayCrops = crops && crops.length > 0 ? crops : SAMPLE_CROPS;
  const active = displayCrops.length;
  const alerts = displayCrops.filter((c) => Number(c.health) < 60).length;
  const avgHealth = Math.round(
    displayCrops.reduce((s, c) => s + Number(c.health), 0) /
      displayCrops.length,
  );

  const handleSubmit = () => {
    if (!form.name || !form.variety) {
      toast.error("Please fill in crop name and variety");
      return;
    }
    addCrop(
      {
        name: form.name,
        variety: form.variety,
        soilMoisture: BigInt(Number.parseInt(form.soilMoisture) || 70),
        temperature: BigInt(Number.parseInt(form.temperature) || 28),
        expectedHarvest: form.expectedHarvest || "TBD",
        health: BigInt(Number.parseInt(form.health) || 80),
      },
      {
        onSuccess: () => {
          toast.success("Crop added successfully! 🌱");
          setShowForm(false);
          setForm({
            name: "",
            variety: "",
            soilMoisture: "",
            temperature: "",
            expectedHarvest: "",
            health: "",
          });
        },
        onError: () => toast.error("Failed to add crop"),
      },
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName={userName} subtitle="Farm Overview" />

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
        <div className="px-4 py-5">
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {
                label: "Active",
                value: `${active}`,
                color: "oklch(0.60 0.12 185)",
                bg: "oklch(0.95 0.04 185)",
              },
              {
                label: "Alert",
                value: `${alerts}`,
                color: "oklch(0.55 0.22 27)",
                bg: "oklch(0.95 0.08 27)",
              },
              {
                label: "Health",
                value: `${avgHealth}%`,
                color: "oklch(0.41 0.13 145)",
                bg: "oklch(0.93 0.04 145)",
              },
            ].map(({ label, value, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl p-3 text-center"
                style={{ background: bg }}
              >
                <p className="font-display font-bold text-xl" style={{ color }}>
                  {value}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-foreground">
              My Crops
            </h2>
            <Button
              size="sm"
              data-ocid="crops.add_button"
              onClick={() => setShowForm(true)}
              className="rounded-xl gap-1 font-bold text-xs h-8"
              style={{ background: "oklch(0.41 0.13 145)", color: "white" }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Crop
            </Button>
          </div>

          {isLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="crops.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-agri-forest" />
            </div>
          ) : (
            <div className="space-y-4">
              {displayCrops.map((crop, i) => {
                const badge = getHealthBadge(crop.health);
                return (
                  <motion.div
                    key={crop.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    data-ocid={`crops.item.${i + 1}`}
                    className="bg-card rounded-2xl overflow-hidden shadow-card"
                  >
                    <div className="relative">
                      <img
                        src={getCropImage(crop.name)}
                        alt={crop.name}
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display font-bold text-base text-foreground">
                            {crop.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {crop.variety}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Health
                          </p>
                          <p
                            className="font-bold text-lg"
                            style={{ color: badge.color }}
                          >
                            {Number(crop.health)}%
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <StatPill
                          icon={<Droplets className="w-3.5 h-3.5" />}
                          label="Soil Moisture"
                          value={`${Number(crop.soilMoisture)}%`}
                          color="oklch(0.60 0.12 185)"
                        />
                        <StatPill
                          icon={<Thermometer className="w-3.5 h-3.5" />}
                          label="Temperature"
                          value={`${Number(crop.temperature)}°C`}
                          color="oklch(0.65 0.15 60)"
                        />
                        <StatPill
                          icon={<Calendar className="w-3.5 h-3.5" />}
                          label="Harvest"
                          value={crop.expectedHarvest}
                          color="oklch(0.41 0.13 145)"
                        />
                        <StatPill
                          icon={<Wind className="w-3.5 h-3.5" />}
                          label="Wind Shield"
                          value="Optimal"
                          color="oklch(0.55 0.18 30)"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {displayCrops.length === 0 && !isLoading && (
            <div
              className="flex flex-col items-center py-12 text-center"
              data-ocid="crops.empty_state"
            >
              <div className="text-5xl mb-3">🌱</div>
              <p className="font-bold text-foreground mb-1">No crops yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first crop to start monitoring
              </p>
              <Button
                onClick={() => setShowForm(true)}
                style={{ background: "oklch(0.41 0.13 145)", color: "white" }}
                className="rounded-xl"
              >
                Add Your First Crop
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add Crop Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-sm rounded-3xl mx-auto"
          data-ocid="crops.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              Add New Crop 🌾
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">
                Crop Name (e.g. Rice/Palay)
              </Label>
              <Input
                data-ocid="crops.input"
                placeholder="Rice (Palay)"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Variety</Label>
              <Input
                placeholder="e.g. Dinorado"
                value={form.variety}
                onChange={(e) =>
                  setForm((p) => ({ ...p, variety: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold">Soil Moisture %</Label>
                <Input
                  type="number"
                  placeholder="78"
                  value={form.soilMoisture}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, soilMoisture: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Temperature °C</Label>
                <Input
                  type="number"
                  placeholder="28"
                  value={form.temperature}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, temperature: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold">
                  Expected Harvest
                </Label>
                <Input
                  placeholder="Oct 2025"
                  value={form.expectedHarvest}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, expectedHarvest: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Health %</Label>
                <Input
                  type="number"
                  placeholder="95"
                  value={form.health}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, health: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowForm(false)}
                data-ocid="crops.cancel_button"
              >
                Cancel
              </Button>
              <Button
                data-ocid="crops.submit_button"
                className="flex-1 rounded-xl font-bold"
                style={{ background: "oklch(0.41 0.13 145)", color: "white" }}
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add Crop"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  color,
}: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2">
      <span style={{ color }}>{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
