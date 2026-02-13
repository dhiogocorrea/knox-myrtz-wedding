"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import type { SiteConfig, GuestGroup } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { LoginScreen } from "./LoginScreen";
import { WeddingApp } from "./WeddingApp";

interface LoginGateProps {
  locale: string;
  config: SiteConfig;
  dict: Dictionary;
}

export function LoginGate({ locale, config, dict }: LoginGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [guestGroup, setGuestGroup] = useState<GuestGroup>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedPassword = localStorage.getItem("knox-wedding-auth");
    const storedGroup = localStorage.getItem("knox-wedding-group") as GuestGroup;

    if (storedPassword && storedGroup) {
      // Verify stored password is still valid via API
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: storedPassword }),
      })
        .then((res) => {
          if (res.ok) {
            setAuthenticated(true);
            setGuestGroup(storedGroup);
          } else {
            localStorage.removeItem("knox-wedding-auth");
            localStorage.removeItem("knox-wedding-group");
          }
        })
        .catch(() => {
          // Network error – trust local cache to avoid blocking
          setAuthenticated(true);
          setGuestGroup(storedGroup);
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const group = data.guestGroup as GuestGroup;

      localStorage.setItem("knox-wedding-auth", password);
      if (group) {
        localStorage.setItem("knox-wedding-group", group);
      }
      setAuthenticated(true);
      setGuestGroup(group);
      return true;
    } catch {
      return false;
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Heart className="w-10 h-10 text-rose animate-pulse" strokeWidth={1.5} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <LoginScreen
        dict={dict}
        config={config}
        onLogin={handleLogin}
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("knox-wedding-auth");
    localStorage.removeItem("knox-wedding-group");
    setAuthenticated(false);
    setGuestGroup(null);
  };

  const authPassword = localStorage.getItem("knox-wedding-auth") || "";

  return (
    <WeddingApp locale={locale} config={config} dict={dict} guestGroup={guestGroup} authPassword={authPassword} onLogout={handleLogout} />
  );
}
