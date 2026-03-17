import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginScreenProps {
  onShowSignup: () => void;
}

const DEMO_ACCOUNTS = [
  { name: "Hisham", email: "hishamsabur@gmail.com" },
  { name: "Vogne Ramirez", email: "ramirezvogne@gmail.com" },
];

export function LoginScreen({ onShowSignup }: LoginScreenProps) {
  const { login, isLoggingIn } = useInternetIdentity();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.33 0.11 145) 0%, oklch(0.41 0.13 145) 50%, oklch(0.52 0.14 145) 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/agrilife-hero-bg.dim_430x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 shadow-float">
            <img
              src="/assets/uploads/AgriLearn-countrysid-1.png"
              alt="AgriLife logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-white font-display font-bold text-4xl tracking-tight">
            AgriLife
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Empowering Farmers, Sustaining Communities
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-float p-6">
          <h2 className="font-display font-bold text-xl text-foreground mb-1">
            Mag-login
          </h2>
          <p className="text-muted-foreground text-sm mb-5">
            Enter your email to log in for this app
          </p>

          {/* Demo accounts */}
          <div className="flex gap-2 mb-5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                type="button"
                key={acc.email}
                onClick={() => setEmail(acc.email)}
                data-ocid={`login.${acc.name.split(" ")[0].toLowerCase()}.button`}
                className="flex-1 text-xs py-2 px-2 rounded-xl border-2 border-agri-pale bg-agri-pale text-agri-forest font-semibold text-center transition-all hover:bg-primary/10"
              >
                Sign in as {acc.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  data-ocid="login.input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  data-ocid="login.password.input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <Button
            data-ocid="login.submit_button"
            className="w-full mt-5 h-12 rounded-xl font-bold text-base"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.41 0.13 145))",
              color: "white",
            }}
            onClick={() => login()}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Continue"
            )}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 rounded-xl font-semibold"
            onClick={() => login()}
          >
            <Leaf className="w-4 h-4 mr-2 text-agri-forest" />
            Continue with Internet Identity
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onShowSignup}
              data-ocid="login.signup.link"
              className="text-agri-forest font-semibold hover:underline"
            >
              Create account
            </button>
          </p>
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            By clicking continue, you agree to our{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
