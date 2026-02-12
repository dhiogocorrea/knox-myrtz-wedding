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
import { Footer } from "./Footer";
import { PetalOverlay } from "./PetalOverlay";
import { CursorEffect } from "./CursorEffect";

export type TabId = "home" | "schedule" | "rsvp" | "touristicInfo" | "weddingInfo";

interface WeddingAppProps {
  locale: string;
  config: SiteConfig;
  dict: Dictionary;
  guestGroup: GuestGroup;
}

export function WeddingApp({ locale, config, dict, guestGroup }: WeddingAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const renderSection = () => {
    switch (activeTab) {
      case "home":
        return <HeroSection config={config} dict={dict} />;
      case "schedule":
        return <ScheduleSection config={config} dict={dict} locale={locale} guestGroup={guestGroup} />;
      case "rsvp":
        return <RsvpSection config={config} dict={dict} />;
      case "touristicInfo":
        return <TouristicSection config={config} dict={dict} locale={locale} />;
      case "weddingInfo":
        return <WeddingInfoSection config={config} dict={dict} locale={locale} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <CursorEffect />
      <PetalOverlay />
      <Navigation
        dict={dict}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locale={locale}
        otherLocale={locale === "en" ? "pt" : "en"}
      />
      <main className="pt-20">
        {renderSection()}
      </main>
      <Footer config={config} dict={dict} />
    </div>
  );
}
