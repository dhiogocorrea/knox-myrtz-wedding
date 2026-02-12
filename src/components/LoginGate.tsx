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
    
    if (storedPassword) {
      // Check if password is still valid
      const isGuestPassword = config.auth.guestPasswords.some(g => g.password === storedPassword);
      const isGroupPassword = storedPassword === config.auth.passwords.friends || 
                              storedPassword === config.auth.passwords.family;
      const isGeneralPassword = storedPassword === config.auth.password;
      
      if (isGuestPassword || isGroupPassword || isGeneralPassword) {
        setAuthenticated(true);
        setGuestGroup(storedGroup);
      } else {
        // Clear invalid auth
        localStorage.removeItem("knox-wedding-auth");
        localStorage.removeItem("knox-wedding-group");
      }
    }
    setChecking(false);
  }, [config.auth.password, config.auth.passwords.friends, config.auth.passwords.family, config.auth.guestPasswords]);

  const handleLogin = (password: string): boolean => {
    let group: GuestGroup = null;
    
    // Check individual guest passwords first
    const guestEntry = config.auth.guestPasswords.find(g => g.password === password);
    if (guestEntry) {
      group = guestEntry.group;
      localStorage.setItem("knox-wedding-auth", password);
      localStorage.setItem("knox-wedding-group", group);
      setAuthenticated(true);
      setGuestGroup(group);
      return true;
    }
    
    // Check group passwords
    if (password === config.auth.passwords.friends) {
      group = "friends";
    } else if (password === config.auth.passwords.family) {
      group = "family";
    } else if (password !== config.auth.password) {
      return false;
    }

    localStorage.setItem("knox-wedding-auth", password);
    if (group) {
      localStorage.setItem("knox-wedding-group", group);
    }
    setAuthenticated(true);
    setGuestGroup(group);
    return true;
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

  return (
    <WeddingApp locale={locale} config={config} dict={dict} guestGroup={guestGroup} />
  );
}
