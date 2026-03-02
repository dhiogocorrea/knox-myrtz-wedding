"use client";

import { useState } from "react";
import type { SiteConfig, GuestGroup } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { Navigation } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { ScheduleSection } from "./ScheduleSection";
import { RsvpSection } from "./RsvpSection";
import { TouristicSection } from "./TouristicSection";
import { WeddingInfoSection } from "./WeddingInfoSection";
import { AdminPanel } from "./AdminPanel";
import { Footer } from "./Footer";
import dynamic from "next/dynamic";

const PetalOverlay = dynamic(() => import("./PetalOverlay").then((mod) => mod.PetalOverlay), { ssr: false });
const CursorEffect = dynamic(() => import("./CursorEffect").then((mod) => mod.CursorEffect), { ssr: false });
const BackgroundScene = dynamic(() => import("./BackgroundScene").then((mod) => mod.BackgroundScene), { ssr: false });

export type TabId = "home" | "schedule" | "rsvp" | "touristicInfo" | "weddingInfo" | "admin";

interface WeddingAppProps {
  locale: string;
  config: SiteConfig;
  dict: Dictionary;
  guestGroup: GuestGroup;
  authPassword: string;
  onLogout: () => void;
}

export function WeddingApp({ locale, config, dict, guestGroup, authPassword, onLogout }: WeddingAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const renderSection = () => {
    switch (activeTab) {
      case "home":
        return <HeroSection config={config} dict={dict} />;
      case "schedule":
        return <ScheduleSection config={config} dict={dict} locale={locale} guestGroup={guestGroup} />;
      case "rsvp":
        return <RsvpSection config={config} dict={dict} authPassword={authPassword} />;
      case "touristicInfo":
        return <TouristicSection config={config} dict={dict} locale={locale} />;
      case "weddingInfo":
        return <WeddingInfoSection config={config} dict={dict} locale={locale} />;
      case "admin":
        return <AdminPanel dict={dict} authPassword={authPassword} />;
    }
  };

  const isAdmin = guestGroup === "admin";

  return (
    <div className="min-h-screen bg-cream relative">
      {/* Fixed background: couple + cherry tree + overlays */}
      <BackgroundScene />
      <CursorEffect />
      <PetalOverlay />
      <Navigation
        dict={dict}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locale={locale}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
      <main className="pt-20 relative z-10">
        {renderSection()}
      </main>
      {/* <Footer config={config} dict={dict} /> */}
    </div>
  );
}
