import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { BottomNav, type TabId } from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import { BlogScreen } from "./screens/BlogScreen";
import { CommunityScreen } from "./screens/CommunityScreen";
import { CropsScreen } from "./screens/CropsScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { SignupScreen } from "./screens/SignupScreen";
import { SuccessScreen } from "./screens/SuccessScreen";

const queryClient = new QueryClient();

type AuthScreen = "login" | "signup" | "success";

function AppContent() {
  const { identity, isInitializing, loginStatus } = useInternetIdentity();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showSuccess, setShowSuccess] = useState(false);

  const isLoggedIn = !!identity;

  // Show success screen after login
  useEffect(() => {
    if (loginStatus === "success") {
      setShowSuccess(true);
    }
  }, [loginStatus]);

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.33 0.11 145), oklch(0.52 0.14 145))",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🌾</span>
          </div>
          <div className="w-8 h-8 border-3 border-white/40 border-t-white rounded-full animate-spin" />
          <p className="text-white/80 font-semibold">Loading AgriLife...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    if (authScreen === "signup") {
      return <SignupScreen onBack={() => setAuthScreen("login")} />;
    }
    return <LoginScreen onShowSignup={() => setAuthScreen("signup")} />;
  }

  // Success screen after login
  if (showSuccess) {
    return (
      <SuccessScreen
        onContinue={() => setShowSuccess(false)}
        userName={identity?.getPrincipal().toString().slice(0, 8) ?? "Farmer"}
      />
    );
  }

  return <MainApp activeTab={activeTab} onTabChange={setActiveTab} />;
}

function MainApp({
  activeTab,
  onTabChange,
}: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  const { data: profile } = useUserProfile();
  const { identity } = useInternetIdentity();
  const userName =
    profile?.name ??
    identity?.getPrincipal().toString().slice(0, 8) ??
    "Farmer";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.33 0.11 145) 0%, oklch(0.52 0.14 145) 100%)",
      }}
    >
      {/* Mobile container */}
      <div className="mx-auto max-w-[430px] min-h-screen relative bg-background">
        {activeTab === "home" && (
          <HomeScreen userName={userName} onTabChange={onTabChange} />
        )}
        {activeTab === "crops" && <CropsScreen userName={userName} />}
        {activeTab === "community" && <CommunityScreen userName={userName} />}
        {activeTab === "blog" && <BlogScreen userName={userName} />}
        {activeTab === "profile" && <ProfileScreen userName={userName} />}
        <BottomNav active={activeTab} onChange={onTabChange} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
