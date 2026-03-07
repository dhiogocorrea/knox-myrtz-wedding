"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, ArrowUpRight } from "lucide-react";
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
    <section className="relative flex flex-col items-center px-4 overflow-visible min-h-[calc(100vh-5rem)] pb-[30vh] sm:pb-[36vh] md:pb-[40vh]">
      {/* Couple photo as background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/images/PORTRAIT.jpg"
          alt=""
          className="w-auto max-w-[min(620px,90vw)] h-auto max-h-[80vh] object-contain select-none opacity-50"
          draggable={false}
        />
      </div>

      {/* ── Main title block (absolute top and bottom blocks) ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="animate-fade-in-up opacity-0 relative" style={{ animationFillMode: "forwards" }}>
          {/* Names – absolute near the top so they remain over the portrait */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[6vh] flex flex-col items-center text-center px-4">
            <p className="text-xs sm:text-sm tracking-[0.5em] uppercase text-vermillion/80 mb-4 font-semibold"
              style={{ fontFamily: "var(--font-dutch)" }}>
              {dict.home.saveTheDate}
            </p>

            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-ink font-black leading-[0.85] drop-shadow-[0_2px_4px_rgba(26,26,46,0.15)]"
              style={{ fontFamily: "var(--font-brush)" }}
            >
              {config.couple.partner1.shortName}
              <span className="text-vermillion mx-3 text-4xl sm:text-5xl md:text-6xl align-middle">&amp;</span>
              {config.couple.partner2.shortName}
            </h1>
          </div>

          {/* Bottom block – absolute below the portrait so it never overlaps the names */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[78vh] sm:top-[82vh] md:top-[86vh] w-full flex flex-col items-center text-center px-4">
            <div className="max-w-2xl w-full">
              <p className="text-xs sm:text-sm text-vermillion/80 tracking-[0.3em] mt-0 font-bold text-center" style={{ fontFamily: "var(--font-dutch)" }}>
                {dict.home.weAreGettingMarried}
              </p>

              <div className="flex items-center justify-center gap-4 my-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-vermillion/50" />
                <span className="text-vermillion/50 text-sm" style={{ fontFamily: "var(--font-dutch)" }}>❁</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-vermillion/50" />
              </div>

              {/* Date · Time · Venue – second visual priority */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink/90 font-medium" style={{ fontFamily: "var(--font-dutch)" }}>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-vermillion/80" />
                  {dateFormatted}
                </span>
                <span className="text-vermillion/40 text-lg">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-vermillion/80" />
                  {config.wedding.time}
                </span>
                <span className="text-vermillion/40 text-lg">·</span>
                <a
                  href={config.wedding.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-vermillion transition-colors"
                >
                  <MapPin className="w-4 h-4 text-vermillion/80" />
                  {config.wedding.venue.name}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                </a>
              </div>

              {/* ── Countdown – horizontal, directly below info ── */}
              <div className="mt-8 animate-fade-in-up opacity-0 stagger-2" style={{ animationFillMode: "forwards" }}>
                <div className="inline-flex items-center gap-1.5 sm:gap-3 py-3 px-5 sm:px-8 rounded-2xl bg-ink/[0.06] backdrop-blur-sm border border-ink/[0.08]">
                  <span className="text-[10px] text-vermillion/50 mr-1 hidden sm:inline" style={{ fontFamily: "var(--font-dutch)" }}>残</span>

                  {[
                    { value: timeLeft.days, kanji: "日", label: "days" },
                    { value: timeLeft.hours, kanji: "時", label: "hrs" },
                    { value: timeLeft.minutes, kanji: "分", label: "min" },
                    { value: timeLeft.seconds, kanji: "秒", label: "sec" },
                  ].map((item, i) => (
                    <div key={item.kanji} className="flex items-center">
                      {i > 0 && <span className="text-ink/20 mx-1 sm:mx-2 text-lg font-light">:</span>}
                      <div className="flex flex-col items-center min-w-[2.5rem] sm:min-w-[3.2rem]">
                        <span className="text-2xl sm:text-3xl font-black text-ink tabular-nums leading-none" style={{ fontFamily: "var(--font-dutch)" }}>
                          {String(item.value).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-vermillion/70 mt-1 font-medium tracking-wider uppercase" style={{ fontFamily: "var(--font-dutch)" }}>
                          {item.kanji}
                        </span>
                      </div>
                    </div>
                  ))}

                  <span className="text-[10px] text-vermillion/50 ml-1 hidden sm:inline" style={{ fontFamily: "var(--font-dutch)" }}>迄</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}