"use client";

import { useState, useEffect } from "react";
import { Flower2, Leaf, Heart, CalendarDays, Clock, MapPin, ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";

interface HeroSectionProps {
  config: SiteConfig;
  dict: Dictionary;
}

function calculateTimeLeft(targetDate: string) {
  const difference = new Date(targetDate + "T00:00:00").getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function HeroSection({ config, dict }: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(config.wedding.date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(config.wedding.date));
    }, 1000);
    return () => clearInterval(timer);
  }, [config.wedding.date]);

  const weddingDate = new Date(config.wedding.date + "T00:00:00");
  const dateFormatted = weddingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Venue background image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/venue-bg.svg"
          alt=""
          className="absolute bottom-0 left-0 w-full h-auto opacity-40 object-cover"
        />
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Flower2 className="absolute top-[10%] left-[5%] w-24 h-24 text-purple-400/[0.08] animate-float select-none" strokeWidth={1} />
        <Leaf className="absolute top-[20%] right-[10%] w-20 h-20 text-violet-400/[0.08] animate-float select-none" style={{ animationDelay: "1s" }} strokeWidth={1} />
        <Heart className="absolute bottom-[15%] left-[15%] w-28 h-28 text-primary/[0.06] animate-float select-none" strokeWidth={1} />
        <Flower2 className="absolute bottom-[25%] right-[8%] w-16 h-16 text-purple-300/[0.08] animate-float select-none" style={{ animationDelay: "0.5s" }} strokeWidth={1} />
        <Leaf className="absolute top-[60%] left-[50%] w-20 h-20 text-violet-300/[0.05] animate-float select-none" style={{ animationDelay: "1.5s" }} strokeWidth={1} />

        {/* Gradient orbs - purple theme */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-200 rounded-full opacity-20 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-violet-200 rounded-full opacity-15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100 rounded-full opacity-10 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Save the date */}
        <div className="animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
          <p className="text-sm tracking-[0.4em] uppercase text-warm-gray mb-6">
            {dict.home.saveTheDate}
          </p>
        </div>

        {/* Couple Names */}
        <div className="animate-fade-in-up opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary leading-tight"
            style={{ fontFamily: "var(--font-great-vibes)" }}
          >
            {config.couple.partner1.shortName}
          </h1>
          <div className="flex items-center justify-center gap-4 my-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400/60" />
            <span className="text-3xl text-gold animate-float">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400/60" />
          </div>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary leading-tight"
            style={{ fontFamily: "var(--font-great-vibes)" }}
          >
            {config.couple.partner2.shortName}
          </h1>
        </div>

        {/* We're Getting Married */}
        <div className="animate-fade-in-up opacity-0 stagger-3 mt-8" style={{ animationFillMode: "forwards" }}>
          <p
            className="text-xl md:text-2xl text-primary-light tracking-wide"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {dict.home.weAreGettingMarried}
          </p>
        </div>

        {/* Olive branch divider */}
        <div className="my-8 animate-fade-in-up opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
          <div className="greek-divider mx-auto max-w-xs" />
        </div>

        {/* Couple puppet illustration */}
        <div className="my-6 animate-fade-in-up opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
          <img
            src="/images/couple-hero.svg"
            alt="Gui and Myrto"
            className="mx-auto w-64 sm:w-80 md:w-96 h-auto opacity-80 hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        {/* Date & Venue */}
        <div className="animate-fade-in-up opacity-0 stagger-5 space-y-3" style={{ animationFillMode: "forwards" }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-warm-gray">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gold" />
              <span className="text-sm tracking-wide">{dateFormatted}</span>
            </div>
            <span className="hidden sm:inline text-gold/40">|</span>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              <span className="text-sm tracking-wide">{config.wedding.time}</span>
            </div>
          </div>
          <a
            href={config.wedding.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors group"
          >
            <MapPin className="w-5 h-5 text-gold" />
            <span className="group-hover:underline decoration-gold/50 underline-offset-4">
              {config.wedding.venue.name}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-warm-gray/50 group-hover:text-gold transition-colors" />
          </a>
        </div>

        {/* Countdown */}
        <div className="mt-12 animate-fade-in-up opacity-0 stagger-6" style={{ animationFillMode: "forwards" }}>
          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
            {[
              { value: timeLeft.days, label: dict.home.days },
              { value: timeLeft.hours, label: dict.home.hours },
              { value: timeLeft.minutes, label: dict.home.minutes },
              { value: timeLeft.seconds, label: dict.home.seconds },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-3 sm:p-5">
                <div
                  className="text-3xl sm:text-5xl font-bold text-primary tabular-nums"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs text-warm-gray uppercase tracking-[0.2em] mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join us message */}
        <div className="mt-12 animate-fade-in-up opacity-0 stagger-7" style={{ animationFillMode: "forwards" }}>
          <p className="text-warm-gray italic text-sm">
            {dict.home.joinUs}
          </p>
          <p className="text-gold/60 text-xs mt-3 tracking-widest">
            {config.wedding.hashtag}
          </p>
        </div>
      </div>
    </section>
  );
}
