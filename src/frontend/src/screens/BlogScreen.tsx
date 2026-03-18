import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  BookMarked,
  Bookmark,
  Cpu,
  Leaf,
  Loader2,
  Share2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppShell";
import { useArticlesByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  { id: "All", label: "All", Icon: BookMarked },
  { id: "Farming Tech", label: "Farming Tech", Icon: Cpu },
  { id: "Market Watch", label: "Market Watch", Icon: TrendingUp },
  { id: "Guides", label: "Guides", Icon: Leaf },
  { id: "Community", label: "Community", Icon: Users },
];

const BLOG_IMAGES: Record<string, string> = {
  "Farming Tech": "/assets/generated/blog-agritech-iot.dim_400x250.jpg",
  "Market Watch": "/assets/generated/blog-local-veggies.dim_400x250.jpg",
  Guides: "/assets/generated/blog-bokashi-composting.dim_400x250.jpg",
  Community: "/assets/generated/blog-organic-rice.dim_400x250.jpg",
  All: "/assets/generated/blog-organic-rice.dim_400x250.jpg",
};

type ArticleItem = {
  title: string;
  category: string;
  summary: string;
  body: string;
};

const SAMPLE_ARTICLES: ArticleItem[] = [
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
    body: "Filipino consumers are increasingly prioritizing freshness and traceability when it comes to the vegetables they put on their families' tables. A recent survey by the Philippine Statistics Authority showed a 34% increase in consumer spending on locally sourced produce over the past three years, driven largely by growing awareness of food safety and environmental sustainability.\n\nThis trend has created a significant opportunity for small-scale vegetable farmers in regions like Benguet, Ilocos Norte, and Bukidnon. Farmers who previously sold exclusively through middlemen are now accessing direct-to-consumer channels through community-supported agriculture (CSA) schemes, farmers' markets, and e-commerce platforms dedicated to agri-products.\n\nFor farmers looking to enter this market, the key success factors are consistent supply, proper post-harvest handling, and clear product labeling. Building relationships with local restaurants, school canteens, and direct buyers can provide stable income compared to wholesale trading. AgriLife's community network is designed to make exactly these connections possible.",
  },
  {
    title: "Composting 101: Bokashi Basics",
    category: "Guides",
    summary:
      "Bokashi is a Japanese fermentation method that turns kitchen waste into powerful soil conditioner in just 2 weeks. Here's how to get started.",
    body: "Bokashi composting is one of the most efficient and farmer-friendly ways to recycle organic waste into nutrient-rich soil amendments. Originating in Japan, the method uses a blend of microorganisms — primarily lactic acid bacteria, yeast, and phototrophic bacteria — to ferment kitchen and farm waste anaerobically in as little as two weeks.\n\nTo start a bokashi system, you need an airtight bucket or bin, bokashi bran (inoculated with effective microorganisms, available at most agricultural supply stores), and your organic waste. Layer waste with sprinkles of bokashi bran, press down to remove air pockets, and keep the lid tightly sealed. After two weeks, bury the fermented material directly in garden soil where it rapidly enriches the earth.\n\nFor Filipino farmers, bokashi is particularly valuable because it accepts rice stalks, vegetable scraps, fish waste, and even small amounts of meat — materials that traditional composting cannot handle. Combining bokashi with vermicomposting creates a powerful closed-loop system that reduces input costs and improves soil biodiversity over time.",
  },
  {
    title: "Rainwater Harvesting Systems for Small Farms",
    category: "Guides",
    summary:
      "A simple guide to collecting and using rainwater to reduce irrigation costs and sustain your crops through the dry season.",
    body: "In many parts of the Philippines, the dry season stretches from November to May, placing enormous stress on smallholder farms that depend on consistent water access. Rainwater harvesting — collecting and storing monsoon rainfall for later use — offers a low-cost, practical solution that can dramatically extend a farm's productive season.\n\nA basic rooftop collection system using corrugated iron sheets, gutters, and food-grade storage tanks can capture hundreds of liters per rain event. More advanced setups include first-flush diverters, multi-tank systems for staged storage, and gravity-fed drip irrigation lines that slowly release water directly to plant roots.\n\nThe upfront investment for a modest 5,000-liter system is approximately ₱8,000 to ₱12,000, recoverable within a single season through reduced pump fuel costs. Organizations like the Bureau of Soils and Water Management offer technical assistance and occasional subsidy programs for rainwater collection infrastructure.",
  },
  {
    title: "How to Keep Your Crops Healthy During the Dry Season",
    category: "Farming Tech",
    summary:
      "Practical strategies including mulching, drip irrigation, and shade netting that every Filipino farmer should know.",
    body: "The Philippine dry season poses one of the greatest annual challenges to smallholder farmers. Without adequate irrigation planning, crops can wilt, soil can crack, and an entire season's investment can be lost in weeks. Fortunately, a combination of low-cost protective techniques can significantly improve crop survival rates.\n\nMulching is the simplest and most accessible intervention. Spreading dried rice straw, banana leaves, or coconut husks around the base of plants reduces soil moisture evaporation by up to 50%, keeps roots cool, and gradually adds organic matter as the mulch decomposes. Drip irrigation — even a basic gravity-fed setup using repurposed bottles — delivers water directly to roots with minimal waste.\n\nFor leafy vegetables and seedlings, shade netting (30–50% shade factor) can reduce heat stress significantly during peak afternoon hours. Shade nets also protect crops from strong winds and reduce insect pressure. Combined with early morning watering schedules and proper crop spacing for airflow, these techniques form a comprehensive dry-season management toolkit accessible to every Filipino farmer.",
  },
  {
    title: "Community Spotlight: Cooperative Success in Ilocos Norte",
    category: "Community",
    summary:
      "How a small farmers' cooperative in Laoag City increased their yield by 40% through shared equipment and collective bargaining.",
    body: "The Ilocos Norte Upland Farmers Cooperative, based in Brgy. 15 of Laoag City, has become a model of community-led agricultural success. What began as an informal group of twelve vegetable growers sharing a single hand tractor has grown into a 68-member cooperative with shared cold storage, a collective market stall at the Laoag public market, and negotiating power with regional buyers.\n\nThe cooperative's breakthrough came when members agreed to standardize their planting schedules, allowing them to offer consistent bulk supply to institutional buyers including school canteens and a regional hotel chain. This shift from irregular spot sales to reliable supply contracts increased average member income by 40% in two seasons.\n\nCentral to their success is a shared digital record-keeping practice facilitated through AgriLife — members log their planting dates, yields, and expenses, giving the cooperative treasurer accurate data for financial planning and the ability to demonstrate production capacity to potential buyers. For any group of farmers considering cooperative formation, the Laoag model shows that data transparency and shared infrastructure are the two pillars that matter most.",
  },
];

interface BlogScreenProps {
  userName: string;
}

export function BlogScreen({ userName }: BlogScreenProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: articles, isLoading } = useArticlesByCategory(activeCategory);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(
    null,
  );

  const displayArticles =
    articles && articles.length > 0
      ? articles
      : SAMPLE_ARTICLES.filter(
          (a) => activeCategory === "All" || a.category === activeCategory,
        );

  const toggleBookmark = (i: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
        toast.success("Bookmark removed");
      } else {
        next.add(i);
        toast.success("Article bookmarked! 🔖");
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName={userName} subtitle="Fresh Perspectives" />

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
          {/* Eco Guides Banner */}
          <div
            className="rounded-2xl p-4 mb-5 text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.52 0.14 145))",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                Eco-Guides
              </span>
            </div>
            <h2 className="font-display font-bold text-xl mb-1">
              Start Your Eco Journey
            </h2>
            <p className="text-white/75 text-sm">
              Learn sustainable practices to improve your soil health and
              protect the local ecosystem.
            </p>
          </div>

          {/* Category tabs */}
          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORIES.map(({ id, label, Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => setActiveCategory(id)}
                data-ocid={`blog.${id.toLowerCase().replace(" ", "_")}.tab`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer"
                style={{
                  background:
                    activeCategory === id
                      ? "oklch(0.41 0.13 145)"
                      : "oklch(0.93 0.04 145)",
                  color:
                    activeCategory === id ? "white" : "oklch(0.41 0.13 145)",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Articles */}
          {isLoading ? (
            <div
              className="flex justify-center py-10"
              data-ocid="blog.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-agri-forest" />
            </div>
          ) : (
            <div className="space-y-4">
              {displayArticles.map((article, i) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  data-ocid={`blog.article.item.${i + 1}`}
                  className="bg-card rounded-2xl overflow-hidden shadow-card"
                >
                  <div className="relative">
                    <img
                      src={BLOG_IMAGES[article.category] ?? BLOG_IMAGES.All}
                      alt={article.title}
                      className="w-full h-44 object-cover"
                    />
                    {/* Bookmark button on image */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggleBookmark(i)}
                      data-ocid={`blog.article.toggle.${i + 1}`}
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                      aria-label="Bookmark article"
                    >
                      <Bookmark
                        className="w-4 h-4 transition-colors"
                        style={{
                          color: bookmarked.has(i) ? "#fbbf24" : "white",
                          fill: bookmarked.has(i) ? "#fbbf24" : "transparent",
                        }}
                      />
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{
                          background: "oklch(0.93 0.04 145)",
                          color: "oklch(0.33 0.11 145)",
                        }}
                      >
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-foreground mt-2 mb-1 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-sm font-bold text-agri-forest cursor-pointer hover:opacity-75 transition-opacity"
                        data-ocid={`blog.discover.${i + 1}.button`}
                        onClick={() =>
                          setSelectedArticle(article as ArticleItem)
                        }
                      >
                        Discover More <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success("Article link copied! 📰")}
                        data-ocid={`blog.article.button.${i + 1}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors px-2 py-1.5 rounded-xl hover:bg-muted/50"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {displayArticles.length === 0 && !isLoading && (
            <div
              className="flex flex-col items-center py-12 text-center"
              data-ocid="blog.empty_state"
            >
              <div className="text-5xl mb-3">📰</div>
              <p className="font-bold text-foreground mb-1">No articles yet</p>
              <p className="text-sm text-muted-foreground">
                Articles will appear here once published.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Article Reader Dialog (centered popup panel) ── */}
      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      >
        <DialogContent
          className="p-0 overflow-hidden flex flex-col max-w-[420px] rounded-3xl border-0 shadow-2xl"
          style={{ maxHeight: "85vh" }}
          data-ocid="blog.article.dialog"
          showCloseButton={false}
        >
          {selectedArticle && (
            <>
              {/* Hero image with overlays */}
              <div className="relative flex-shrink-0">
                <img
                  src={BLOG_IMAGES[selectedArticle.category] ?? BLOG_IMAGES.All}
                  alt={selectedArticle.title}
                  className="w-full h-52 object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.10 0.04 145 / 0.90) 0%, transparent 55%)",
                  }}
                />
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                  data-ocid="blog.article.dialog.close_button"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                {/* Category + Title overlay */}
                <div className="absolute bottom-4 left-5 right-5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: "oklch(0.41 0.13 145)",
                      color: "white",
                    }}
                  >
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-white font-display font-bold text-lg mt-2 leading-tight">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable body */}
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-4">
                  <p
                    className="text-sm font-semibold leading-relaxed"
                    style={{ color: "oklch(0.41 0.13 145)" }}
                  >
                    {selectedArticle.summary}
                  </p>
                  <div
                    className="w-12 h-1 rounded-full"
                    style={{ background: "oklch(0.41 0.13 145 / 0.3)" }}
                  />
                  <div className="text-sm text-foreground leading-relaxed space-y-4">
                    {selectedArticle.body.split("\n\n").map((para) => (
                      <p key={para.slice(0, 20)}>{para}</p>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              {/* Action buttons */}
              <div className="flex gap-3 p-4 border-t border-border flex-shrink-0">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl font-semibold"
                  onClick={() => toast.success("Article link copied! 📰")}
                  data-ocid="blog.article.dialog.button"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button
                  className="flex-1 rounded-xl font-bold"
                  style={{ background: "oklch(0.41 0.13 145)", color: "white" }}
                  onClick={() => {
                    toggleBookmark(
                      SAMPLE_ARTICLES.findIndex(
                        (a) => a.title === selectedArticle.title,
                      ),
                    );
                  }}
                  data-ocid="blog.article.dialog.primary_button"
                >
                  <Bookmark className="w-4 h-4 mr-2" /> Save Article
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
