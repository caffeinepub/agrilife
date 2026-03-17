import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Droplets,
  Heart,
  Leaf,
  Lightbulb,
  Shield,
  Thermometer,
  Users,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppShell";
import type { TabId } from "../components/BottomNav";
import {
  useAllArticles,
  useAllPosts,
  useCallerCrops,
  useCoreValues,
} from "../hooks/useQueries";

const DAILY_TIPS = [
  "Practice crop rotation and avoid planting the same crop in the same soil twice in a row to improve soil health.",
  "Use organic compost to enrich your soil naturally — kitchen waste and rice husks work great!",
  "Monitor soil moisture daily during the dry season to prevent crop stress.",
  "Intercropping corn with legumes can help fix nitrogen and reduce fertilizer costs.",
  "Collect rainwater during the wet season to sustain irrigation through dry months.",
];

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

const QUICK_LINKS = [
  {
    id: "blog" as TabId,
    label: "Blog",
    Icon: BookOpen,
    color: "oklch(0.60 0.12 185)",
  },
  {
    id: "community" as TabId,
    label: "Community",
    Icon: Users,
    color: "oklch(0.65 0.15 60)",
  },
  {
    id: "crops" as TabId,
    label: "My Crops",
    Icon: Leaf,
    color: "oklch(0.41 0.13 145)",
  },
  {
    id: "profile" as TabId,
    label: "Profile",
    Icon: Heart,
    color: "oklch(0.55 0.18 30)",
  },
];

interface HomeScreenProps {
  userName: string;
  onTabChange: (tab: TabId) => void;
}

type CropItem = {
  name: string;
  variety: string;
  soilMoisture: bigint | number;
  temperature: bigint | number;
  expectedHarvest?: string;
  health?: bigint | number;
  windShield?: string;
};

type ArticleItem = {
  title: string;
  category: string;
  summary: string;
  body: string;
};

export function HomeScreen({ userName, onTabChange }: HomeScreenProps) {
  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const { data: articles = [] } = useAllArticles();
  const { data: posts = [] } = useAllPosts();
  const { data: crops = [] } = useCallerCrops();
  const { data: coreValues = [] } = useCoreValues();

  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(
    null,
  );
  const [coreValuesOpen, setCoreValuesOpen] = useState(false);

  const displayCrops =
    crops.length > 0 ? crops.slice(0, 2) : SAMPLE_CROPS.slice(0, 2);
  const displayArticles = (
    articles.length > 0 ? articles : SAMPLE_ARTICLES
  ).slice(0, 4);
  const displayCoreValues =
    coreValues.length > 0 ? coreValues : SAMPLE_CORE_VALUES;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName={userName} />

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
        <div className="px-4 py-5 space-y-6">
          {/* Daily Tip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-agri-pale rounded-2xl p-4 flex gap-3">
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: "oklch(0.41 0.13 145)" }}
              >
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-agri-forest font-bold text-xs uppercase tracking-wider mb-1">
                  💡 Daily Tip
                </p>
                <p className="text-foreground text-sm leading-relaxed">
                  {DAILY_TIPS[tipIndex]}
                </p>
              </div>
            </div>
          </motion.div>

          {/* My Crops */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg text-foreground">
                Crop Snapshots
              </h2>
              <button
                type="button"
                onClick={() => onTabChange("crops")}
                className="flex items-center gap-1 text-sm font-semibold text-agri-forest"
                data-ocid="home.crops.link"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {displayCrops.map((crop, i) => (
                <div
                  key={crop.name}
                  data-ocid={`home.crop.item.${i + 1}`}
                  className="bg-card rounded-2xl overflow-hidden shadow-card"
                >
                  <img
                    src={getCropImage(crop.name)}
                    alt={crop.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-bold text-sm text-foreground">
                      {crop.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {crop.variety}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "oklch(0.60 0.12 185 / 0.15)",
                          color: "oklch(0.40 0.12 185)",
                        }}
                      >
                        💧 {Number(crop.soilMoisture)}%
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "oklch(0.65 0.15 60 / 0.15)",
                          color: "oklch(0.45 0.15 60)",
                        }}
                      >
                        🌡️ {Number(crop.temperature)}°C
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCrop(crop as CropItem)}
                      className="mt-2 w-full py-1.5 rounded-xl text-xs font-bold text-agri-forest bg-agri-pale hover:bg-agri-pale/80 transition-colors"
                      data-ocid={`home.crop.view.${i + 1}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Quick Links */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-lg text-foreground mb-3">
              Quick Links
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_LINKS.map(({ id, label, Icon, color }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => onTabChange(id)}
                  data-ocid={`home.quicklink.${id}.button`}
                  className="flex flex-col items-center gap-2 p-3 bg-card rounded-2xl shadow-card"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}22` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </motion.section>

          {/* Fresh Perspectives (Blog Preview) */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg text-foreground">
                Fresh Perspectives
              </h2>
              <button
                type="button"
                onClick={() => onTabChange("blog")}
                className="flex items-center gap-1 text-sm font-semibold text-agri-forest"
                data-ocid="home.blog.link"
              >
                See All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4"
              style={{ scrollbarWidth: "none" }}
            >
              {displayArticles.map((article, i) => (
                <div
                  key={article.title}
                  data-ocid={`home.article.item.${i + 1}`}
                  className="flex-shrink-0 w-52 bg-card rounded-2xl overflow-hidden shadow-card"
                >
                  <img
                    src={getBlogImage(article.category)}
                    alt={article.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-agri-forest">
                      {article.category}
                    </span>
                    <p className="font-bold text-sm text-foreground mt-1 line-clamp-2 leading-tight">
                      {article.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedArticle(article as ArticleItem)}
                      className="mt-2 text-xs font-semibold text-agri-mid flex items-center gap-1 hover:opacity-75 transition-opacity"
                      data-ocid={`home.article.discover.${i + 1}.button`}
                    >
                      Discover More <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Community Feed Preview */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg text-foreground">
                Community Feed
              </h2>
              <button
                type="button"
                onClick={() => onTabChange("community")}
                className="flex items-center gap-1 text-sm font-semibold text-agri-forest"
                data-ocid="home.community.link"
              >
                See All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {(posts.length > 0 ? posts : SAMPLE_POSTS)
                .slice(0, 2)
                .map((post, i) => (
                  <div
                    key={post.author}
                    data-ocid={`home.post.item.${i + 1}`}
                    className="bg-card rounded-2xl p-4 shadow-card"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.52 0.14 145))",
                        }}
                      >
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          {post.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                ))}
            </div>
          </motion.section>

          {/* Core Values */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div
              className="rounded-3xl p-5 text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.41 0.13 145))",
              }}
            >
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
                🌾 Our Core Values
              </p>
              <h3 className="font-display font-bold text-xl mb-1">
                Integrity, Innovation, and Community Empowerment.
              </h3>
              <p className="text-white/75 text-sm mb-4">
                Discover the heart of innovation and tradition in agriculture!
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {displayCoreValues.map((val, i) => (
                  <div
                    key={val.title}
                    className="bg-white/15 rounded-xl p-2.5 text-center"
                  >
                    <div className="text-xl mb-1">
                      {["🌱", "⚡", "🤝"][i] || "✨"}
                    </div>
                    <p className="font-bold text-xs">{val.title}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCoreValuesOpen(true)}
                className="w-full py-2.5 rounded-xl bg-white/20 font-bold text-sm hover:bg-white/30 transition-all"
                data-ocid="home.corevalues.button"
              >
                Explore Our Values
              </button>
            </div>
          </motion.section>

          {/* Footer */}
          <footer className="text-center pt-2 pb-4">
            <p className="text-xs text-muted-foreground">
              Thank you for using AgriLife
            </p>
          </footer>
        </div>
      </main>

      {/* ── Crop Details Dialog ── */}
      <Dialog
        open={!!selectedCrop}
        onOpenChange={(open) => !open && setSelectedCrop(null)}
      >
        <DialogContent
          className="max-w-sm mx-auto rounded-3xl p-0 overflow-hidden"
          data-ocid="home.crop.dialog"
        >
          {selectedCrop && (
            <>
              <div className="relative">
                <img
                  src={getCropImage(selectedCrop.name)}
                  alt={selectedCrop.name}
                  className="w-full h-48 object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.10 0.04 145 / 0.85) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display font-bold text-xl leading-tight">
                    {selectedCrop.name}
                  </p>
                  <p className="text-white/80 text-sm">
                    {selectedCrop.variety}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Health bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Crop Health
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          Number(selectedCrop.health ?? 80) >= 90
                            ? "oklch(0.41 0.13 145 / 0.15)"
                            : Number(selectedCrop.health ?? 80) >= 70
                              ? "oklch(0.65 0.15 60 / 0.15)"
                              : "oklch(0.55 0.18 30 / 0.15)",
                        color:
                          Number(selectedCrop.health ?? 80) >= 90
                            ? "oklch(0.33 0.11 145)"
                            : Number(selectedCrop.health ?? 80) >= 70
                              ? "oklch(0.45 0.15 60)"
                              : "oklch(0.45 0.18 30)",
                      }}
                    >
                      {Number(selectedCrop.health ?? 80)}% Healthy
                    </span>
                  </div>
                  <Progress
                    value={Number(selectedCrop.health ?? 80)}
                    className="h-2.5 rounded-full"
                  />
                </div>

                {/* Stat pills */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    className="flex items-center gap-2 rounded-2xl p-3"
                    style={{ background: "oklch(0.60 0.12 185 / 0.1)" }}
                  >
                    <Droplets
                      className="w-4 h-4"
                      style={{ color: "oklch(0.40 0.12 185)" }}
                    />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Soil Moisture
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.40 0.12 185)" }}
                      >
                        {Number(selectedCrop.soilMoisture)}%
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-2xl p-3"
                    style={{ background: "oklch(0.65 0.15 60 / 0.1)" }}
                  >
                    <Thermometer
                      className="w-4 h-4"
                      style={{ color: "oklch(0.45 0.15 60)" }}
                    />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Temperature
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.45 0.15 60)" }}
                      >
                        {Number(selectedCrop.temperature)}°C
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-2xl p-3"
                    style={{ background: "oklch(0.41 0.13 145 / 0.1)" }}
                  >
                    <Leaf
                      className="w-4 h-4"
                      style={{ color: "oklch(0.41 0.13 145)" }}
                    />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Expected Harvest
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.33 0.11 145)" }}
                      >
                        {selectedCrop.expectedHarvest ?? "Oct 2025"}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-2xl p-3"
                    style={{ background: "oklch(0.55 0.18 270 / 0.08)" }}
                  >
                    <Wind
                      className="w-4 h-4"
                      style={{ color: "oklch(0.45 0.15 270)" }}
                    />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Wind Shield
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.45 0.15 270)" }}
                      >
                        {selectedCrop.windShield ?? "Active"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full rounded-xl font-bold"
                  style={{ background: "oklch(0.41 0.13 145)", color: "white" }}
                  onClick={() => {
                    setSelectedCrop(null);
                    onTabChange("crops");
                  }}
                  data-ocid="home.crop.dialog.button"
                >
                  <Leaf className="w-4 h-4 mr-2" /> Open Full Dashboard
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Article Reader Sheet ── */}
      <Sheet
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      >
        <SheetContent
          side="bottom"
          className="h-[90vh] rounded-t-3xl p-0 overflow-hidden flex flex-col"
          data-ocid="home.article.sheet"
        >
          {selectedArticle && (
            <>
              <div className="relative flex-shrink-0">
                <img
                  src={getBlogImage(selectedArticle.category)}
                  alt={selectedArticle.title}
                  className="w-full h-48 object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.10 0.04 145 / 0.85) 0%, transparent 50%)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  data-ocid="home.article.sheet.close_button"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: "oklch(0.41 0.13 145)",
                      color: "white",
                    }}
                  >
                    {selectedArticle.category}
                  </span>
                </div>
              </div>

              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-4">
                  <h2 className="font-display font-bold text-xl text-foreground leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-sm font-medium text-agri-forest">
                    {selectedArticle.summary}
                  </p>
                  <div className="text-sm text-foreground leading-relaxed space-y-3">
                    {selectedArticle.body.split("\n\n").map((para, _i) => (
                      <p key={para.slice(0, 20)}>{para}</p>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              <div className="flex gap-3 p-4 border-t border-border flex-shrink-0">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl font-semibold"
                  onClick={() => {
                    toast.success("Article link copied! 📰");
                  }}
                  data-ocid="home.article.sheet.button"
                >
                  Share Article
                </Button>
                <Button
                  className="flex-1 rounded-xl font-bold"
                  style={{ background: "oklch(0.41 0.13 145)", color: "white" }}
                  onClick={() => {
                    setSelectedArticle(null);
                    onTabChange("blog");
                  }}
                  data-ocid="home.article.sheet.primary_button"
                >
                  More Articles
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Core Values Sheet ── */}
      <Sheet open={coreValuesOpen} onOpenChange={setCoreValuesOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] rounded-t-3xl p-0 overflow-hidden flex flex-col"
          data-ocid="home.corevalues.sheet"
        >
          <div
            className="flex-shrink-0 p-6 pb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.41 0.13 145))",
            }}
          >
            <SheetHeader>
              <SheetTitle className="text-white font-display text-xl text-left">
                🌾 Our Core Values
              </SheetTitle>
            </SheetHeader>
            <p className="text-white/75 text-sm mt-1">
              The principles that guide every decision we make at AgriLife.
            </p>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-4">
              {CORE_VALUES_EXPANDED.map((val, i) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-5 border border-border"
                  style={{ background: "oklch(0.97 0.02 145)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: "oklch(0.41 0.13 145 / 0.12)" }}
                    >
                      {val.emoji}
                    </div>
                    <div>
                      <p className="font-display font-bold text-base text-foreground">
                        {val.title}
                      </p>
                      <p className="text-xs text-agri-forest font-semibold">
                        {val.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border flex-shrink-0">
            <Button
              className="w-full rounded-xl font-bold py-6"
              style={{ background: "oklch(0.41 0.13 145)", color: "white" }}
              onClick={() => setCoreValuesOpen(false)}
              data-ocid="home.corevalues.sheet.close_button"
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function getBlogImage(category: string) {
  const c = category.toLowerCase();
  if (c.includes("tech") || c.includes("innov"))
    return "/assets/generated/blog-agritech-iot.dim_400x250.jpg";
  if (c.includes("sustain") || c.includes("compost"))
    return "/assets/generated/blog-bokashi-composting.dim_400x250.jpg";
  if (c.includes("market") || c.includes("veggi"))
    return "/assets/generated/blog-local-veggies.dim_400x250.jpg";
  if (c.includes("rain") || c.includes("water"))
    return "/assets/generated/blog-rainwater-harvest.dim_400x250.jpg";
  return "/assets/generated/blog-organic-rice.dim_400x250.jpg";
}

const SAMPLE_CROPS = [
  {
    name: "Rice (Palay)",
    variety: "Dinorado",
    soilMoisture: BigInt(78),
    temperature: BigInt(28),
    expectedHarvest: "Oct 2025",
    health: BigInt(95),
    windShield: "Active",
  },
  {
    name: "Corn (Mais)",
    variety: "Yellow Sweet",
    soilMoisture: BigInt(65),
    temperature: BigInt(30),
    expectedHarvest: "Nov 2025",
    health: BigInt(88),
    windShield: "Moderate",
  },
];

const SAMPLE_ARTICLES = [
  {
    title: "The Future of Organic Rice Farming in Central Luzon",
    category: "Farming Tech",
    summary:
      "Explore how modern agricultural innovations are transforming traditional Palay farming in the Philippines, from smart irrigation to drone monitoring.",
    body: "Central Luzon, known as the 'Rice Granary of the Philippines,' is undergoing a quiet but powerful transformation. Farmers who once relied solely on traditional methods passed down through generations are now embracing sensor-driven irrigation systems, drone-assisted crop monitoring, and soil health analytics powered by mobile technology.\n\nIn municipalities like Nueva Ecija and Pampanga, agricultural cooperatives are partnering with technology startups to install IoT sensors in paddy fields. These sensors transmit real-time data on soil moisture, temperature, and nitrogen levels directly to farmers' smartphones — reducing water usage by up to 30% while improving yield consistency.\n\nThe shift is not without challenges. Many smallholder farmers face barriers including device literacy, connectivity in remote barangays, and the upfront cost of smart devices. Government programs under the Department of Agriculture are rolling out subsidized digital tools to help bridge this gap, ensuring that the future of Filipino organic rice farming is both high-tech and inclusive.",
  },
  {
    title: "Market Trends: Rising Demand for Locally Grown Veggies",
    category: "Market Watch",
    summary:
      "Consumer preference for fresh, locally sourced produce is surging. Learn how small Filipino farmers can capitalize on this trend.",
    body: "Filipino consumers are increasingly prioritizing freshness and traceability when it comes to the vegetables they put on their families' tables. A recent survey by the Philippine Statistics Authority showed a 34% increase in consumer spending on locally sourced produce over the past three years, driven largely by growing awareness of food safety and environmental sustainability.\n\nThis trend has created a significant opportunity for small-scale vegetable farmers in regions like Benguet, Ilocos Norte, and Bukidnon. Farmers who previously sold exclusively through middlemen are now accessing direct-to-consumer channels through community-supported agriculture (CSA) schemes, farmers' markets, and e-commerce platforms dedicated to agri-products.\n\nFor farmers looking to enter this market, the key success factors are consistent supply, proper post-harvest handling, and clear product labeling. Building relationships with local restaurants, school canteens, and direct buyers can provide stable income compared to wholesale trading. AgriLife's community network is designed to make exactly these connections possible — linking growers with buyers who share the same values of quality and sustainability.",
  },
  {
    title: "Composting 101: Bokashi Basics",
    category: "Guides",
    summary:
      "Bokashi is a Japanese fermentation method that turns kitchen waste into powerful soil conditioner in just 2 weeks. Here's how to get started.",
    body: "Bokashi composting is one of the most efficient and farmer-friendly ways to recycle organic waste into nutrient-rich soil amendments. Originating in Japan, the method uses a blend of microorganisms — primarily lactic acid bacteria, yeast, and phototrophic bacteria — to ferment kitchen and farm waste anaerobically in as little as two weeks.\n\nTo start a bokashi system, you need an airtight bucket or bin, bokashi bran (a wheat bran inoculated with effective microorganisms, available at most agricultural supply stores), and your organic waste. Layer waste with sprinkles of bokashi bran, press down to remove air pockets, and keep the lid tightly sealed. After two weeks, the fermented material can be buried directly in garden soil where it rapidly breaks down and enriches the earth.\n\nFor Filipino farmers, bokashi is particularly valuable because it accepts rice stalks, vegetable scraps, fish waste, and even small amounts of meat — materials that traditional composting cannot handle. Combining bokashi with vermicomposting creates a powerful closed-loop system that dramatically reduces input costs and improves soil biodiversity over time.",
  },
  {
    title: "Rainwater Harvesting Systems for Small Farms",
    category: "Guides",
    summary:
      "A simple guide to collecting and using rainwater to reduce irrigation costs and sustain your crops through the dry season.",
    body: "In many parts of the Philippines, the dry season stretches from November to May, placing enormous stress on smallholder farms that depend on consistent water access. Rainwater harvesting — collecting and storing monsoon rainfall for later use — offers a low-cost, practical solution that can dramatically extend a farm's productive season.\n\nA basic rooftop collection system using corrugated iron sheets, gutters, and food-grade storage tanks can capture hundreds of liters per rain event. More advanced setups include first-flush diverters (which discard the initial runoff that carries the most contaminants), multi-tank systems for staged storage, and gravity-fed drip irrigation lines that slowly release water directly to plant roots.\n\nThe upfront investment for a modest 5,000-liter system is approximately ₱8,000 to ₱12,000, which can be recovered within a single season through reduced pump fuel costs. Organizations like the Bureau of Soils and Water Management offer technical assistance and occasional subsidy programs for rainwater collection infrastructure. With proper maintenance and first-flush hygiene practices, harvested rainwater is safe for all vegetable and grain irrigation.",
  },
];

const SAMPLE_POSTS = [
  {
    author: "Joseph Rizal",
    content:
      "Just finished harvesting our first batch of Dinorado rice this season! The weather held up perfectly. Thanks to everyone for the irrigation tips during El Niño. 🌾",
  },
  {
    author: "Mabini Binibini",
    content:
      "We're organizing a free workshop on organic composting this Saturday at the community hall. Open to all local growers! Let's make our soil healthier together. 🌱✨",
  },
];

const SAMPLE_CORE_VALUES = [
  {
    title: "Integrity",
    description: "We uphold honesty and transparency in all we do.",
  },
  {
    title: "Innovation",
    description: "We embrace modern tools to improve farming.",
  },
  {
    title: "Community",
    description: "We empower farmers and communities together.",
  },
];

const CORE_VALUES_EXPANDED = [
  {
    emoji: "🌱",
    title: "Integrity",
    tagline: "Transparency in every harvest",
    description:
      "We believe that trust is the foundation of a thriving agricultural community. AgriLife is committed to honest pricing, transparent supply chains, and fair dealings between farmers, buyers, and partners. Every data point we surface — from soil readings to market prices — is unfiltered and unmanipulated, giving farmers the truth they need to make confident decisions.",
  },
  {
    emoji: "⚡",
    title: "Innovation",
    tagline: "Tradition meets technology",
    description:
      "Filipino farming has centuries of accumulated wisdom, and we honor that heritage by pairing it with the best of modern agricultural technology. From IoT-powered soil sensors and drone crop monitoring to AI-assisted harvest prediction and mobile market access, we build tools that are powerful yet simple enough for every farmer — regardless of technical background — to use confidently in the field.",
  },
  {
    emoji: "🤝",
    title: "Community Empowerment",
    tagline: "Stronger together, rooted in culture",
    description:
      "Agriculture in the Philippines has always been a communal endeavor — from the bayanihan spirit of shared labor to cooperative marketing. AgriLife amplifies this spirit by connecting farmers with each other, with consumers, and with support organizations across the archipelago. We believe that when farmers are informed, connected, and heard, entire communities flourish — from the field to the family table.",
  },
];
