"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { Home, CalendarDays, Mail, Plane, Gem, ChevronDown, Shield, LogOut } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { TabId } from "./WeddingApp";

// Flag SVG components
const BrazilFlag = () => (
  <svg viewBox="0 0 36 24" className="w-5 h-3.5 rounded-sm shadow-sm">
    <rect width="36" height="24" fill="#009b3a"/>
    <path d="M18,3.6 L30,12 L18,20.4 L6,12 Z" fill="#fedf00"/>
    <circle cx="18" cy="12" r="4.5" fill="#002776"/>
  </svg>
);

const USFlag = () => (
  <svg viewBox="0 0 36 24" className="w-5 h-3.5 rounded-sm shadow-sm">
    <rect width="36" height="24" fill="#b22234"/>
    <path d="M0,2.77h36M0,5.54h36M0,8.31h36M0,11.08h36M0,13.85h36M0,16.62h36M0,19.39h36" stroke="#fff" strokeWidth="1.85"/>
    <rect width="14.4" height="12.92" fill="#3c3b6e"/>
  </svg>
);

const GreeceFlag = () => (
  <svg viewBox="0 0 36 24" className="w-5 h-3.5 rounded-sm shadow-sm">
    <rect width="36" height="24" fill="#0d5eaf"/>
    <path d="M0,2.67h36M0,5.33h36M0,10.67h36M0,13.33h36M0,18.67h36M0,21.33h36" stroke="#fff" strokeWidth="2.67"/>
    <rect width="12.86" height="13.71" fill="#0d5eaf"/>
    <path d="M6.43,0v13.71M0,6.86h12.86" stroke="#fff" strokeWidth="2.29"/>
  </svg>
);

const localeOptions = [
  { code: "pt", label: "PT", flag: <BrazilFlag /> },
  { code: "en", label: "EN", flag: <USFlag /> },
  { code: "el", label: "EL", flag: <GreeceFlag /> },
] as const;

interface NavigationProps {
  dict: Dictionary;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  locale: string;
  isAdmin?: boolean;
  onLogout: () => void;
}

const baseTabs: { id: TabId; icon: ReactNode }[] = [
  { id: "home", icon: <Home className="w-[18px] h-[18px]" /> },
  { id: "schedule", icon: <CalendarDays className="w-[18px] h-[18px]" /> },
  { id: "weddingInfo", icon: <Gem className="w-[18px] h-[18px]" /> },
  { id: "touristicInfo", icon: <Plane className="w-[18px] h-[18px]" /> },
  { id: "rsvp", icon: <Mail className="w-[18px] h-[18px]" /> },
];

const adminTab: { id: TabId; icon: ReactNode } = {
  id: "admin",
  icon: <Shield className="w-[18px] h-[18px]" />,
};

export function Navigation({
  dict,
  activeTab,
  onTabChange,
  locale,
  isAdmin,
  onLogout,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const tabs = isAdmin ? [...baseTabs, adminTab] : baseTabs;
  const currentLocale = localeOptions.find((l) => l.code === locale) ?? localeOptions[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tabId: TabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-ink/[0.06] shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo / Brand – elegant Japanese */}
            <button
              onClick={() => handleTabClick("home")}
              className="text-2xl text-ink hover:text-vermillion transition-all duration-300 cursor-pointer hover:scale-105 font-bold tracking-wider"
              style={{ fontFamily: "var(--font-dutch)" }}
            >
              G <span className="text-vermillion/70">&</span> M
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2" style={{ fontFamily: "var(--font-dutch)" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 ${
                    tab.id === "rsvp"
                      ? activeTab === tab.id
                        ? "text-white bg-vermillion shadow-lg shadow-vermillion/25 scale-[1.03]"
                        : "text-vermillion border-2 border-vermillion/40 hover:bg-vermillion hover:text-white hover:shadow-lg hover:shadow-vermillion/25 animate-glow-pulse"
                      : activeTab === tab.id
                      ? "text-ink bg-sakura/40"
                      : "text-warm-gray hover:text-ink hover:bg-ink/[0.04]"
                  }`}
                >
                  <span className="mr-2 inline-flex">{tab.icon}</span>
                  {dict.nav[tab.id]}
                  {activeTab === tab.id && tab.id !== "rsvp" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-vermillion to-transparent rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Language Toggle + Logout + Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {/* Logout button */}
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl text-warm-gray hover:text-vermillion hover:bg-vermillion/5 transition-all duration-300 cursor-pointer"
                title={dict.nav.logout}
                aria-label={dict.nav.logout}
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>

              {/* Language selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase border border-ink/10 text-ink/70 hover:border-vermillion/30 hover:text-ink transition-all duration-300 cursor-pointer"
                >
                  <span className="inline-flex">{currentLocale.flag}</span>
                  {currentLocale.label}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white/90 backdrop-blur-xl rounded-xl border border-ink/[0.08] shadow-xl shadow-ink/5 overflow-hidden animate-fade-in z-50">
                    {localeOptions.map((opt) => (
                      <a
                        key={opt.code}
                        href={`/${opt.code}`}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-base transition-colors duration-200 ${
                          locale === opt.code
                            ? "text-ink bg-sakura/30 font-medium"
                            : "text-warm-gray hover:text-ink hover:bg-ink/[0.03]"
                        }`}
                      >
                        <span className="inline-flex">{opt.flag}</span>
                        {opt.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-primary hover:text-primary-dark transition-all duration-300 cursor-pointer hover:scale-110"
                aria-label="Toggle menu"
              >
                <div className="w-5 flex flex-col gap-1">
                  <span
                    className={`block h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-ink/10 backdrop-blur-sm" />
          <div
            className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-ink/[0.06] shadow-lg shadow-ink/5 animate-fade-in"
            style={{ fontFamily: "var(--font-dutch)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer hover:translate-x-1 ${
                    tab.id === "rsvp"
                      ? activeTab === tab.id
                        ? "text-white bg-vermillion shadow-lg shadow-vermillion/20"
                        : "text-vermillion border border-vermillion/30 hover:bg-vermillion hover:text-white"
                      : activeTab === tab.id
                      ? "text-ink bg-sakura/30"
                      : "text-warm-gray hover:text-ink hover:bg-ink/[0.03]"
                  }`}
                >
                  <span className="mr-3 inline-flex">{tab.icon}</span>
                  {dict.nav[tab.id]}
                </button>
              ))}

              <div className="border-t border-ink/[0.06] mt-2 pt-2">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-vermillion hover:bg-vermillion/5 transition-all duration-200 cursor-pointer hover:translate-x-1"
                >
                  <span className="mr-3 inline-flex"><LogOut className="w-4 h-4" /></span>
                  {dict.nav.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
