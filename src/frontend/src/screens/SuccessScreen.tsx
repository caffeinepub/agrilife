import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect } from "react";

interface SuccessScreenProps {
  onContinue: () => void;
  userName?: string;
}

export function SuccessScreen({ onContinue, userName }: SuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onContinue, 3000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.33 0.11 145) 0%, oklch(0.41 0.13 145) 50%, oklch(0.52 0.14 145) 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="flex flex-col items-center"
        data-ocid="success.modal"
      >
        <img
          src="/assets/uploads/AgriLearn-countrysid-2-1.png"
          alt="AgriLife Logo"
          className="h-20 object-contain mb-6 drop-shadow-lg"
        />
        <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-float">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-white font-display font-bold text-3xl text-center mb-2">
          SUCCESSFULLY LOGGED-IN!
        </h2>
        {userName && (
          <p className="text-white/80 text-lg text-center mb-2">
            Welcome, {userName}! 🌾
          </p>
        )}
        <p className="text-white/65 text-sm text-center mb-8 max-w-xs">
          "Where tradition, culture, and innovation grow together."
        </p>
        <Button
          data-ocid="success.continue_button"
          onClick={onContinue}
          className="px-10 h-12 rounded-2xl font-bold text-base bg-white text-agri-forest hover:bg-white/90"
        >
          Go to Main Page
        </Button>
        <p className="text-white/50 text-xs mt-4">
          Redirecting automatically...
        </p>
      </motion.div>
    </div>
  );
}
