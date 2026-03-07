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
 

  // Intro text handling: replace first occurrence of "here" (any case) with the linked anchor
  const rawIntro: string | undefined = ((dict as any).touristicInfo || {}).introText;
  const introMatch = rawIntro ? rawIntro.match(/\bhere\b/i) : null;
  const introIndex = introMatch?.index ?? -1;
  const introMatchText = introMatch?.[0] ?? "";
  return (
    <section ref={sectionRef} className="min-h-[calc(100vh-5rem)] py-16 px-4 relative seigaiha" style={{ fontFamily: "var(--font-dutch)" }}>
      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── Header ─────────────────────── */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p
            className="text-xs tracking-[0.5em] uppercase text-vermillion/60 mb-3 font-medium"
            style={{ fontFamily: "var(--font-dutch)" }}
          >
            ── 観光 ──
          </p>
          <h2
            className="text-3xl md:text-4xl text-ink mb-4 font-bold"
            style={{ fontFamily: "var(--font-dutch)" }}
          >
            {dict.touristicInfo.title}
          </h2>
          {/* Intro sentence (red, smaller and subtle like the header subtitle) */}
          {rawIntro && (
            <p className="text-vermillion text-sm tracking-wide mb-4" style={{ fontFamily: "var(--font-dutch)" }}>
              {introIndex >= 0 ? (
                <>
                  {rawIntro.slice(0, introIndex)}
                  <a href="https://maps.app.goo.gl/a1tywE4SUAQVyE4N8" target="_blank" rel="noreferrer" className="underline font-medium">{introMatchText}</a>
                  {rawIntro.slice(introIndex + introMatchText.length)}
                </>
              ) : (
                <>{rawIntro}{' '}<a href="https://maps.app.goo.gl/a1tywE4SUAQVyE4N8" target="_blank" rel="noreferrer" className="underline font-medium">here</a></>
              )}
            </p>
          )}
        </div>

        {/* ── Touristic grid (titles as black hyperlink blocks; descriptions in white boxes) ─────────────────── */}
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.touristicInfo?.map((item, idx) => {
              const title = getLocalizedValue(item.title, locale) || '';
              const content = getLocalizedValue(item.content, locale) || '';
              const url = (item as any).url ?? null;
              return (
                <div key={idx} className="mb-4">
                  <div className="inline-block bg-black text-white px-3 py-1 text-base" style={{ fontFamily: "var(--font-dutch-1756)" }}>
                    <a href={url ?? '#'} target="_blank" rel="noreferrer" className="font-semibold">{title}</a>
                  </div>

                  <div className="mt-3 bg-white rounded-none shadow-sm p-5 text-ink">
                    <p className="text-base leading-relaxed">{content}</p>
                    {url && (
                      <p className="mt-3 text-base">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-vermillion underline inline-flex items-center">
                          <MapPin className="mr-2" size={14} />
                          <span>maps</span>
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Static map (placed below content) ─────────────────── */}
        <div className="mt-8 flex justify-center animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
          <div className="w-full max-w-xl mx-auto">
            <Image
              src="/images/travel_tips/map.png"
              alt="Local map"
              width={900}
              height={600}
              className="w-full h-auto object-cover rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* ── Map link ───────────────────── */}
        

      </div>
    </section>
  );
}
