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
          {/* Simplified intro + Google Maps list link */}
          <div className="mt-4">
            <div className="prose prose-lg mx-auto text-center">
              <p className="text-base text-ink/90 leading-relaxed">
                Below we have listed some of our favourite attractions of the area, for those who are looking to explore the region further.
              </p>

              <p className="mt-4">
                <a
                  href={config.wedding?.venue?.mapUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vermillion font-semibold underline"
                >
                  Google Maps list
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Grid replaced by simplified content above; map remains below */}

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
