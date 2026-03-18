import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile } from "../hooks/useQueries";

interface SignupScreenProps {
  onBack: () => void;
}

export function SignupScreen({ onBack }: SignupScreenProps) {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { mutate: saveProfile, isPending } = useSaveUserProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.farmer);
  const [step, setStep] = useState<"credentials" | "profile">("credentials");

  const handleLogin = async () => {
    await login();
    if (identity) {
      setStep("profile");
    }
  };

  const handleSaveProfile = () => {
    saveProfile({ name: name || email.split("@")[0], role });
  };

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
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 shadow-float">
            <img
              src="/assets/uploads/AgriLearn-countrysid-2-1.png"
              alt="AgriLife logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-white font-display font-bold text-4xl tracking-tight">
            AgriLife
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Join the farming community
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-float p-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
            data-ocid="signup.back.button"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </button>

          <h2 className="font-display font-bold text-xl text-foreground mb-1">
            Gumawa ng Account
          </h2>
          <p className="text-muted-foreground text-sm mb-5">
            Enter your email to sign up for this app
          </p>

          {step === "credentials" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-email" className="text-sm font-semibold">
                  Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    data-ocid="signup.input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="signup-password"
                  className="text-sm font-semibold"
                >
                  Create Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    data-ocid="signup.password.input"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button
                data-ocid="signup.submit_button"
                className="w-full h-12 rounded-xl font-bold text-base"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.41 0.13 145))",
                  color: "white",
                }}
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    data-ocid="signup.name.input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">I am a...</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as UserRole)}
                >
                  <SelectTrigger
                    data-ocid="signup.role.select"
                    className="mt-1"
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.farmer}>
                      🌾 Farmer (Magsasaka)
                    </SelectItem>
                    <SelectItem value={UserRole.consumer}>
                      🛒 Consumer (Mamimili)
                    </SelectItem>
                    <SelectItem value={UserRole.ngo}>
                      🤝 NGO / Organization
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                data-ocid="signup.complete_button"
                className="w-full h-12 rounded-xl font-bold text-base"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.41 0.13 145))",
                  color: "white",
                }}
                onClick={handleSaveProfile}
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          )}

          <p className="text-center text-[11px] text-muted-foreground mt-4">
            By clicking continue, you agree to our{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
