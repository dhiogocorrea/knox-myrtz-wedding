"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/utils";

interface WeddingInfoSectionProps {
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
    { span: 4, tall: true },
    { span: 2, tall: true },
  ],
  [
    { span: 6, tall: false },
  ],
];

export function WeddingInfoSection({ config, dict, locale }: WeddingInfoSectionProps) {
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

  const items = [
    { title: dict.weddingInfo.dressCodeTitle, content: getLocalizedValue(config.weddingInfo.dressCode, locale) },
    { title: dict.weddingInfo.giftsTitle,     content: getLocalizedValue(config.weddingInfo.gifts, locale) },
    { title: dict.weddingInfo.accommodationTitle, content: getLocalizedValue(config.weddingInfo.accommodation, locale) },
  ];

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
            ── 情報 ──
          </p>
          <h2
            className="text-3xl md:text-4xl text-ink mb-4 font-bold"
            style={{ fontFamily: "var(--font-manga)" }}
          >
            {dict.weddingInfo.title}
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
                  const isFull = panel.span === 6;

                  return (
                    <div
                      key={panel.globalIdx}
                      data-panel-index={panel.globalIdx}
                      className={`
                        manga-panel group
                        ${panel.tall ? "manga-panel-tall" : ""}
                        ${isFull ? "manga-panel-cinematic" : ""}
                        ${isVisible ? "manga-panel-visible" : "manga-panel-hidden"}
                      `}
                    >
                      <div className="relative z-10 h-full flex flex-col justify-end">
                        <div className="manga-time-badge">
                          {panel.item.title}
                        </div>
                        <div className="manga-narration">
                          <p className="text-xs md:text-sm text-warm-gray leading-relaxed">
                            {panel.item.content}
                          </p>
                        </div>
                      </div>
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

        {/* ── Hashtag ────────────────────── */}
        <div
          className="mt-8 text-center animate-fade-in-up"
          style={{ animationDelay: "400ms", animationFillMode: "forwards", opacity: 0 }}
        >
          <div className="glass-card inline-block px-10 py-6">
            <p className="text-xs text-warm-gray tracking-[0.3em] uppercase mb-2">
              Share your moments
            </p>
            <p
              className="text-2xl text-gold tracking-wide"
              style={{ fontFamily: "var(--font-manga)" }}
            >
              {config.wedding.hashtag}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
