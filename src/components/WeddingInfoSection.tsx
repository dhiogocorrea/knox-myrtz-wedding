"use client";

import { type ReactNode } from "react";
import { Shirt, Gift, Hotel, Gem } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/utils";

interface WeddingInfoSectionProps {
  config: SiteConfig;
  dict: Dictionary;
  locale: string;
}

export function WeddingInfoSection({ config, dict, locale }: WeddingInfoSectionProps) {
  const infoCards: { icon: ReactNode; title: string; content: string }[] = [
    {
      icon: <Shirt className="w-7 h-7 text-primary" strokeWidth={1.5} />,
      title: dict.weddingInfo.dressCodeTitle,
      content: getLocalizedValue(config.weddingInfo.dressCode, locale),
    },
    {
      icon: <Gift className="w-7 h-7 text-primary" strokeWidth={1.5} />,
      title: dict.weddingInfo.giftsTitle,
      content: getLocalizedValue(config.weddingInfo.gifts, locale),
    },
    {
      icon: <Hotel className="w-7 h-7 text-primary" strokeWidth={1.5} />,
      title: dict.weddingInfo.accommodationTitle,
      content: getLocalizedValue(config.weddingInfo.accommodation, locale),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-5rem)] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="text-4xl md:text-5xl text-primary mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {dict.weddingInfo.title}
          </h2>
          <div className="mb-4">
            <div className="greek-divider mx-auto max-w-xs" />
          </div>
          <p className="text-warm-gray">{dict.weddingInfo.subtitle}</p>
        </div>

        {/* Info Cards */}
        <div className="space-y-8">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 md:p-10 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 group animate-fade-in-up"
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: "forwards",
                opacity: 0,
              }}
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-accent/40 flex items-center justify-center group-hover:animate-float">
                  {card.icon}
                </div>
                <div>
                  <h3
                    className="text-2xl text-primary-dark font-semibold mb-4"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    {card.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hashtag */}
        <div
          className="mt-16 text-center animate-fade-in-up"
          style={{ animationDelay: "600ms", animationFillMode: "forwards", opacity: 0 }}
        >
          <div className="glass-card inline-block rounded-2xl px-10 py-6 shadow-lg">
            <p className="text-xs text-warm-gray tracking-[0.3em] uppercase mb-2">
              Share your moments
            </p>
            <p
              className="text-2xl text-gold tracking-wide"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {config.wedding.hashtag}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
