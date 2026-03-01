"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/utils";

interface TouristicSectionProps {
  config: SiteConfig;
  dict: Dictionary;
  locale: string;
}

const ROW_TEMPLATES = [
  [
    { span: 2, tall: false },
    { span: 4, tall: false },
  ],
  [
    { span: 2, tall: false },
    { span: 2, tall: false },
    { span: 2, tall: false },
  ],
  [
    { span: 4, tall: true },
    { span: 2, tall: true },
  ],
  [
    { span: 6, tall: false },
  ],
];

export function TouristicSection({ config, dict, locale }: TouristicSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visiblePanels, setVisiblePanels] = useState<Set<number>>(new Set());

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Number(entry.target.getAttribute("data-panel-index"));
        if (!isNaN(idx)) setVisiblePanels(prev => new Set(prev).add(idx));
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    });
    sectionRef.current?.querySelectorAll("[data-panel-index]").forEach(p => observer.observe(p));
    return () => observer.disconnect();
  }, [handleIntersection]);

  const items = config.touristicInfo;
  const rows: { item: (typeof items)[number]; span: number; tall: boolean; globalIdx: number }[][] = [];
  let itemIdx = 0;
  let templateIdx = 0;

  while (itemIdx < items.length) {
    const template = ROW_TEMPLATES[templateIdx % ROW_TEMPLATES.length];
    const row: typeof rows[number] = [];
    for (const slot of template) {
      if (itemIdx >= items.length) break;
      row.push({ item: items[itemIdx], span: slot.span, tall: slot.tall, globalIdx: itemIdx });
      itemIdx++;
    }
    rows.push(row);
    templateIdx++;
  }

  return (
    <section ref={sectionRef} className="min-h-[calc(100vh-5rem)] py-16 px-4 relative seigaiha">
      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── Header ─────────────────────── */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p
            className="text-xs tracking-[0.5em] uppercase text-vermillion/60 mb-3 font-medium"
            style={{ fontFamily: "var(--font-manga)" }}
          >
            ── 観光 ──
          </p>
          <h2
            className="text-3xl md:text-4xl text-ink mb-4 font-bold"
            style={{ fontFamily: "var(--font-manga)" }}
          >
            {dict.touristicInfo.title}
          </h2>
        </div>

        {/* ── Manga page ─────────────────── */}
        <div className="manga-page">
          <div className="manga-page-inner">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="manga-row"
                style={{ gridTemplateColumns: row.map(p => `${p.span}fr`).join(" ") }}
              >
                {row.map((panel) => {
                  const isVisible = visiblePanels.has(panel.globalIdx);
                  const hasImage = !!panel.item.image;
                  const isWide = panel.span >= 4;
                  const isFull = panel.span === 6;

                  return (
                    <div
                      key={panel.globalIdx}
                      data-panel-index={panel.globalIdx}
                      className={`
                        manga-panel group
                        ${panel.tall ? "manga-panel-tall" : ""}
                        ${isFull ? "manga-panel-cinematic" : ""}
                        ${hasImage ? "manga-panel-with-image" : ""}
                        ${isVisible ? "manga-panel-visible" : "manga-panel-hidden"}
                      `}
                    >
                      {hasImage ? (
                        <Image
                          src={panel.item.image!}
                          alt={getLocalizedValue(panel.item.title, locale)}
                          fill
                          sizes={isFull ? "100vw" : isWide ? "66vw" : "33vw"}
                          className="object-cover pointer-events-none manga-panel-img"
                        />
                      ) : (
                        <div className="relative z-10 h-full flex flex-col justify-end">
                          <div className="manga-time-badge">
                            {getLocalizedValue(panel.item.title, locale)}
                          </div>
                          <div className="manga-narration">
                            <p className="text-xs md:text-sm text-warm-gray leading-relaxed">
                              {getLocalizedValue(panel.item.content, locale)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-right mt-2 pr-2">
            <span className="text-xs text-ink/30 tracking-wider" style={{ fontFamily: "var(--font-manga)" }}>
              — {items.length} —
            </span>
          </div>
        </div>

        {/* ── Map link ───────────────────── */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "forwards", opacity: 0 }}>
          <a
            href={config.wedding.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 glass-card text-ink hover:text-vermillion transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
          >
            <MapPin className="w-6 h-6 text-vermillion/70" strokeWidth={1.5} />
            <div className="text-left">
              <p className="font-semibold" style={{ fontFamily: "var(--font-manga)" }}>
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
