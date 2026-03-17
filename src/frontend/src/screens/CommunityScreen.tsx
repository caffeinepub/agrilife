import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Share2,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppShell";
import { useAddCommunityPost, useAllPosts } from "../hooks/useQueries";

const SAMPLE_POSTS = [
  {
    author: "Joseph Rizal (Farmer)",
    content:
      "Just finished harvesting our first batch of Dinorado rice this season! The weather held up perfectly. Thanks to everyone for the irrigation tips during El Niño. 🌾",
    timestamp: "2 hours ago",
  },
  {
    author: "Mabini Binibini",
    content:
      "We're organizing a free workshop on organic composting this Saturday at the community hall. Open to all local growers! Let's make our soil healthier together. 🌱✨",
    timestamp: "10 hours ago",
  },
  {
    author: "Luisa Mapalad",
    content:
      "The Bokashi composting method has improved my vegetable garden soil in just 3 weeks. Highly recommend this to fellow farmers in Ilocos Norte! 🥬",
    timestamp: "1 day ago",
  },
  {
    author: "Pedro Cruz",
    content:
      "Anyone else noticing that tomato prices at the market are rising? Maybe it's time to expand our production before the rainy season ends. 📈",
    timestamp: "2 days ago",
  },
];

const INITIAL_LIKES = [8, 14, 5, 11];

interface PostState {
  liked: boolean;
  likeCount: number;
  commentOpen: boolean;
  comment: string;
}

interface CommunityScreenProps {
  userName: string;
}

export function CommunityScreen({ userName }: CommunityScreenProps) {
  const { data: posts, isLoading } = useAllPosts();
  const { mutate: addPost, isPending } = useAddCommunityPost();
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const displayPosts = posts && posts.length > 0 ? posts : SAMPLE_POSTS;

  const [postStates, setPostStates] = useState<Record<number, PostState>>(() =>
    Object.fromEntries(
      INITIAL_LIKES.map((likes, i) => [
        i,
        {
          liked: false,
          likeCount: likes,
          commentOpen: false,
          comment: "",
        },
      ]),
    ),
  );

  const getState = (i: number): PostState =>
    postStates[i] ?? {
      liked: false,
      likeCount: 7,
      commentOpen: false,
      comment: "",
    };

  const updateState = (i: number, patch: Partial<PostState>) =>
    setPostStates((prev) => ({
      ...prev,
      [i]: { ...getState(i), ...patch },
    }));

  const toggleLike = (i: number) => {
    const s = getState(i);
    updateState(i, {
      liked: !s.liked,
      likeCount: s.liked ? s.likeCount - 1 : s.likeCount + 1,
    });
  };

  const toggleComment = (i: number) =>
    updateState(i, { commentOpen: !getState(i).commentOpen });

  const sendComment = (i: number) => {
    const s = getState(i);
    if (!s.comment.trim()) return;
    toast.success("Comment posted! 💬");
    updateState(i, { comment: "", commentOpen: false });
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("Please write something first");
      return;
    }
    addPost(content, {
      onSuccess: () => {
        toast.success("Post shared with the community! 🌾");
        setContent("");
        setShowForm(false);
      },
      onError: () => toast.error("Failed to post. Please try again."),
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName={userName} subtitle="AgriCommunity" />

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
          {/* Banner */}
          <div
            className="rounded-2xl p-4 mb-5 text-white flex items-center gap-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.52 0.14 145))",
            }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex-shrink-0 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">
                Stay Connected with Agri-Life
              </h2>
              <p className="text-white/75 text-xs mt-0.5">
                Join our community and nourish your passion for agriculture!
              </p>
            </div>
          </div>

          {/* Create Post */}
          <div className="mb-5">
            <AnimatePresence>
              {showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-card rounded-2xl p-4 shadow-card"
                  data-ocid="community.dialog"
                >
                  <Textarea
                    data-ocid="community.textarea"
                    placeholder="Share something with the community... 🌾"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="rounded-xl resize-none mb-3 min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl text-sm"
                      onClick={() => setShowForm(false)}
                      data-ocid="community.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      data-ocid="community.submit_button"
                      className="flex-1 rounded-xl font-bold text-sm gap-1.5"
                      style={{
                        background: "oklch(0.41 0.13 145)",
                        color: "white",
                      }}
                      onClick={handleSubmit}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="trigger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowForm(true)}
                  data-ocid="community.open_modal_button"
                  className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 text-left cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.52 0.14 145))",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    Share something with the community...
                  </span>
                  <Plus className="w-5 h-5 text-agri-forest ml-auto" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Posts feed */}
          {isLoading ? (
            <div
              className="flex justify-center py-10"
              data-ocid="community.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-agri-forest" />
            </div>
          ) : (
            <div className="space-y-3">
              {displayPosts.map((post, i) => {
                const s = getState(i);
                return (
                  <motion.div
                    key={post.author + String(i)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-ocid={`community.post.item.${i + 1}`}
                    className="bg-card rounded-2xl p-4 shadow-card"
                  >
                    {/* Author row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
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
                          {(post as any).timestamp ?? "Recently"}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-foreground leading-relaxed mb-3">
                      {post.content}
                    </p>

                    {/* Action bar */}
                    <div className="flex items-center gap-1 pt-2 border-t border-border/40">
                      {/* Like */}
                      <motion.button
                        type="button"
                        onClick={() => toggleLike(i)}
                        whileTap={{ scale: 1.4 }}
                        data-ocid={`community.post.toggle.${i + 1}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Heart
                          className="w-4 h-4 transition-colors"
                          style={{
                            color: s.liked
                              ? "oklch(0.55 0.22 20)"
                              : "oklch(0.60 0.05 145)",
                            fill: s.liked
                              ? "oklch(0.55 0.22 20)"
                              : "transparent",
                          }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: s.liked
                              ? "oklch(0.55 0.22 20)"
                              : "oklch(0.50 0.05 145)",
                          }}
                        >
                          {s.likeCount}
                        </span>
                      </motion.button>

                      {/* Comment */}
                      <button
                        type="button"
                        onClick={() => toggleComment(i)}
                        data-ocid={`community.post.secondary_button.${i + 1}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <MessageCircle
                          className="w-4 h-4"
                          style={{
                            color: s.commentOpen
                              ? "oklch(0.41 0.13 145)"
                              : "oklch(0.60 0.05 145)",
                          }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "oklch(0.50 0.05 145)" }}
                        >
                          Comment
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() =>
                          toast.success("Link copied to clipboard! 🔗")
                        }
                        data-ocid={`community.post.button.${i + 1}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors ml-auto"
                      >
                        <Share2
                          className="w-4 h-4"
                          style={{ color: "oklch(0.60 0.05 145)" }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "oklch(0.50 0.05 145)" }}
                        >
                          Share
                        </span>
                      </button>
                    </div>

                    {/* Inline comment box */}
                    <AnimatePresence>
                      {s.commentOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 flex gap-2">
                            <Textarea
                              placeholder="Write a comment..."
                              value={s.comment}
                              onChange={(e) =>
                                updateState(i, { comment: e.target.value })
                              }
                              className="rounded-xl resize-none flex-1 min-h-[72px] text-sm"
                              data-ocid={`community.post.textarea.${i + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => sendComment(i)}
                              data-ocid={`community.post.submit_button.${i + 1}`}
                              className="self-end w-9 h-9 rounded-xl flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                              style={{ background: "oklch(0.41 0.13 145)" }}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {displayPosts.length === 0 && !isLoading && (
            <div
              className="flex flex-col items-center py-12 text-center"
              data-ocid="community.empty_state"
            >
              <div className="text-5xl mb-3">👥</div>
              <p className="font-bold text-foreground mb-1">No posts yet</p>
              <p className="text-sm text-muted-foreground">
                Be the first to share something!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
