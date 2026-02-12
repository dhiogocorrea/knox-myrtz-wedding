"use client";

import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/utils";
import { ScheduleIcon } from "./icons/ScheduleIcon";
import { MapPin, ArrowRight, Plane } from "lucide-react";

interface TouristicSectionProps {
  config: SiteConfig;
  dict: Dictionary;
  locale: string;
}

export function TouristicSection({ config, dict, locale }: TouristicSectionProps) {
  return (
    <section className="min-h-[calc(100vh-5rem)] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="text-4xl md:text-5xl text-primary mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {dict.touristicInfo.title}
          </h2>
          <div className="mb-4">
            <div className="greek-divider mx-auto max-w-xs" />
          </div>
          <p className="text-warm-gray">{dict.touristicInfo.subtitle}</p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {config.touristicInfo.map((info, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 group animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: "forwards",
                opacity: 0,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/40 flex items-center justify-center group-hover:animate-float">
                  <ScheduleIcon name={info.icon} className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    className="text-xl text-primary-dark font-semibold mb-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {getLocalizedValue(info.title, locale)}
                  </h3>
                  <p className="text-warm-gray text-sm leading-relaxed">
                    {getLocalizedValue(info.content, locale)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map link */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: "600ms", animationFillMode: "forwards", opacity: 0 }}>
          <a
            href={config.wedding.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 glass-card rounded-2xl text-primary hover:text-primary-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
          >
            <MapPin className="w-6 h-6 text-gold" strokeWidth={1.5} />
            <div className="text-left">
              <p className="font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
                {config.wedding.venue.name}
              </p>
              <p className="text-xs text-warm-gray">{config.wedding.venue.address}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
