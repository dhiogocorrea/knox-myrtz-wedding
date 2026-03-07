"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SignalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12c0 1.97.55 3.81 1.5 5.38L1.5 22.5l5.12-1.5C8.19 21.95 10.03 22.5 12 22.5c5.79 0 10.5-4.71 10.5-10.5S17.79 1.5 12 1.5zm0 2c4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5c-1.74 0-3.36-.53-4.71-1.43l-.33-.22-3.46 1.01 1.01-3.46-.22-.33A8.44 8.44 0 013.5 12c0-4.69 3.81-8.5 8.5-8.5z" />
    </svg>
  );
}

interface WeddingInfoSectionProps {
  config: SiteConfig;
  dict: Dictionary;
  locale: string;
}

const ROW_TEMPLATES = [
  [
    { span: 8, tall: false },
    { span: 9, tall: false },
    { span: 3, tall: false },
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

  const items: { title: string; content: string; isContacts?: boolean }[] = [
    { title: dict.weddingInfo.dressCodeTitle, content: getLocalizedValue(config.weddingInfo.dressCode, locale) },
    { title: dict.weddingInfo.contactsTitle, content: "", isContacts: true },
    { title: dict.weddingInfo.giftsTitle, content: getLocalizedValue(config.weddingInfo.gifts, locale) },
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
    <section ref={sectionRef} className="min-h-[calc(100vh-5rem)] py-16 px-4 relative seigaiha" style={{ fontFamily: "var(--font-dutch)" }}>
      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── Header ─────────────────────── */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p
            className="text-xs tracking-[0.5em] uppercase text-vermillion/60 mb-3 font-medium"
            style={{ fontFamily: "var(--font-dutch)" }}
          >
            ── 情報 ──
          </p>
          <h2
            className="text-3xl md:text-4xl text-ink mb-4 font-bold"
            style={{ fontFamily: "var(--font-dutch)" }}
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
                      <div className="relative z-10 h-full w-full flex flex-col justify-end">
                        <div className="manga-time-badge">
                          {panel.item.title}
                        </div>
                        <div className="manga-narration w-full">
                          {panel.item.isContacts ? (
                            <div className="text-sm md:text-base text-warm-gray leading-relaxed flex gap-4">
                              <div className="flex-1">
                                <p className="font-semibold text-ink/80 mb-1">Gui</p>
                                <div className="flex items-center gap-1.5">
                                  <WhatsAppIcon className="w-3.5 h-3.5 text-vermillion/70 shrink-0" />
                                  <span>+31 6 3329 6522</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-vermillion/70 shrink-0" />
                                  <span>+31 6 3329 6522</span>
                                </div>
                              </div>
                              <div className="w-px bg-ink/15 self-stretch" />
                              <div className="flex-1">
                                <p className="font-semibold text-ink/80 mb-1">Mirto</p>
                                <div className="flex items-center gap-1.5">
                                  <SignalIcon className="w-3.5 h-3.5 text-vermillion/70 shrink-0" />
                                  <span>+30 xxxxx</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-vermillion/70 shrink-0" />
                                  <span>+30 xxxxxx</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm md:text-base text-warm-gray leading-relaxed">
                              {panel.item.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-right mt-2 pr-2">
            <span className="text-xs text-ink/30 tracking-wider" style={{ fontFamily: "var(--font-dutch)" }}>
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
              style={{ fontFamily: "var(--font-dutch)" }}
            >
              {config.wedding.hashtag}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
