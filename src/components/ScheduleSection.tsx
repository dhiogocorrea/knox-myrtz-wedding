"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { SiteConfig, GuestGroup } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/utils";

interface ScheduleSectionProps {
  config: SiteConfig;
  dict: Dictionary;
  locale: string;
  guestGroup: GuestGroup;
}

/* ── Panel layout templates ──────────────────
   Each "row" defines how panels are arranged.
   - span: column-span (out of 6 cols)
   - tall: whether it gets extra row height
   We cycle through row templates for any number of items.
*/
// Balloons removed — no balloon position variants needed

// Default row templates (fallback)
const ROW_TEMPLATES = [
  // narrow left + wide right
  [
    { span: 2, tall: false },
    { span: 4, tall: false },
  ],
  // three equal panels
  [
    { span: 2, tall: false },
    { span: 2, tall: false },
    { span: 2, tall: false },
  ],
  // wide panoramic + small aside
  [
    { span: 4, tall: true },
    { span: 2, tall: true },
  ],
  // single full-width cinematic panel
  [
    { span: 6, tall: false },
  ],
];

// Fixed templates for 5-panel (family)
const FAMILY_TEMPLATES = [
  // 1 short | 1 semi-long
  [
    { span: 2, tall: false },
    { span: 4, tall: false },
  ],
  // 1 long
  [
    { span: 6, tall: true },
  ],
  // 1 short | 1 semi-long
  [
    { span: 2, tall: false },
    { span: 4, tall: false },
  ],
];

// Fixed templates for 4-panel (friends)
const FRIENDS_TEMPLATES = [
  // 1 long
  [
    { span: 6, tall: true },
  ],
  // 1 long
  [
    { span: 6, tall: true },
  ],
  // 1 short | 1 semi-long
  [
    { span: 2, tall: false },
    { span: 4, tall: false },
  ],
];

export function ScheduleSection({ config, dict, locale, guestGroup }: ScheduleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visiblePanels, setVisiblePanels] = useState<Set<number>>(new Set());

  const filteredSchedule = config.schedule.filter(item => {
    if (!item.visibleTo || item.visibleTo.length === 0) return true;
    // Admins should see everything regardless of per-item visibility
    if (guestGroup === "admin") return true;
    return guestGroup && (item.visibleTo as string[]).includes(guestGroup);
  });

  /* Stagger-reveal panels on scroll */
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Number(entry.target.getAttribute("data-panel-index"));
        if (!isNaN(idx)) {
          setVisiblePanels(prev => new Set(prev).add(idx));
        }
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    });
    const panels = sectionRef.current?.querySelectorAll("[data-panel-index]");
    panels?.forEach(p => observer.observe(p));
    return () => observer.disconnect();
  }, [handleIntersection, filteredSchedule]);

  /* Distribute schedule items into rows using the templates */
  const rows: { item: (typeof filteredSchedule)[number]; span: number; tall: boolean; globalIdx: number }[][] = [];
  let itemIdx = 0;
  let templateIdx = 0;

  // Choose templates deterministically based on number of panels
  let templatesToUse = ROW_TEMPLATES;
  if (filteredSchedule.length === 5) templatesToUse = FAMILY_TEMPLATES;
  else if (filteredSchedule.length === 4) templatesToUse = FRIENDS_TEMPLATES;

  while (itemIdx < filteredSchedule.length) {
    const template = templatesToUse[templateIdx % templatesToUse.length];
    const row: typeof rows[number] = [];

    for (const slot of template) {
      if (itemIdx >= filteredSchedule.length) break;
      const item = filteredSchedule[itemIdx] as any;
      const itemSpan = item.panel?.span ?? slot.span;
      const itemTall = item.panel?.tall ?? slot.tall;
      row.push({
        item: item,
        span: itemSpan,
        tall: itemTall,
        globalIdx: itemIdx,
      });
      itemIdx++;
    }

    rows.push(row);
    templateIdx++;
  }

  return (
    <section id="schedule" ref={sectionRef} className="min-h-[calc(100vh-5rem)] py-1 px-4 relative seigaiha">
      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── Manga page header ─────────────── */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p
            className="text-xs tracking-[0.5em] uppercase text-vermillion/60 mb-3 font-medium"
            style={{ fontFamily: "var(--font-manga)" }}
          >
            ── 予定 ──
          </p>
          <h2
            className="text-3xl md:text-4xl text-ink mb-4 font-bold"
            style={{ fontFamily: "var(--font-manga)" }}
          >
            {dict.schedule.title}
          </h2>
        </div>

        {/* ── Manga page container ──────────── */}
        <div className="manga-page">
          <div className="manga-page-inner">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="manga-row"
                style={{
                  gridTemplateColumns: row.map(p => `${p.span}fr`).join(" "),
                }}
              >
                {row.map((panel) => {
                  const isVisible = visiblePanels.has(panel.globalIdx);

                  // Special-case: localized images for certain panels (dinner, going merry)
                  const isDinnerPanel = (panel.item as any).time === "04-06-26 @ 18:00";
                  const isGoingMerryPanel = (panel.item as any).image && (panel.item as any).image.includes("going_merry");
                  const isHimmelPanel = (panel.item as any).image && (panel.item as any).image.includes("himmel_cutie");
                  const isManga1Panel = (panel.item as any).image && (panel.item as any).image.includes("manga1");
                  const LOCALE_MAP: Record<string, string> = { en: "EN", pt: "PT", el: "GR" };
                  let imageSrc: string | undefined = (panel.item as any).image;
                  if (isDinnerPanel) {
                    const suf = LOCALE_MAP[locale] ?? "EN";
                    imageSrc = `/images/schedule/panel_1_${suf}.png`;
                  } else if (isGoingMerryPanel) {
                    const suf = LOCALE_MAP[locale] ?? "EN";
                    imageSrc = `/images/schedule/goingmerry_${suf}.png`;
                  } else if (isHimmelPanel) {
                    const suf = LOCALE_MAP[locale] ?? "EN";
                    imageSrc = `/images/schedule/panel_3_${suf}.png`;
                  } else if (isManga1Panel) {
                    const suf = LOCALE_MAP[locale] ?? "EN";
                    imageSrc = `/images/schedule/brunch_${suf}.png`;
                  }
                  const hasImage = !!imageSrc;
                  const isWide = panel.span >= 4;
                  const isFull = panel.span === 6;
                  const panelInlineStyle = (panel.item as any).panel?.style ? ((panel.item as any).panel.style as any) : undefined;

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
                      style={panelInlineStyle}
                    >
                      {/* ── Background image ──────────── */}
                      {hasImage && (
                        <Image
                          src={imageSrc!}
                          alt={getLocalizedValue(panel.item.title, locale)}
                          fill
                          sizes={isFull ? "100vw" : isWide ? "66vw" : "33vw"}
                          className={`${isDinnerPanel ? "object-left" : (isHimmelPanel || isManga1Panel) ? "object-center" : "object-cover"} pointer-events-none manga-panel-img`}
                        />
                      )}

                      {/* Balloons removed — images only */}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Page number */}
          <div className="text-right mt-2 pr-2">
            <span className="text-xs text-ink/30 tracking-wider" style={{ fontFamily: "var(--font-manga)" }}>
              — {filteredSchedule.length} —
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
