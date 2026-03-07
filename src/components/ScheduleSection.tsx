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
    <section id="schedule" ref={sectionRef} className="min-h-[calc(100vh-5rem)] py-1 px-4 relative seigaiha" style={{ fontFamily: "var(--font-dutch)" }}>
      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── Manga page header ─────────────── */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p
            className="text-xs tracking-[0.5em] uppercase text-vermillion/60 mb-3 font-medium"
            style={{ fontFamily: "var(--font-dutch)" }}
          >
            ── 予定 ──
          </p>
          <h2
            className="text-3xl md:text-4xl text-ink mb-4 font-bold"
            style={{ fontFamily: "var(--font-dutch)" }}
          >
            {dict.schedule.title}
          </h2>
        </div>

        {/* ── Manga page container ──────────── */}
        <div className="manga-page">
          <div className="manga-page-inner">
            <div className="flex flex-col w-full overflow-hidden">
              <Image
                src="/images/schedule/manga-top-EN.png"
                alt={dict.schedule.title + " — top"}
                width={1200}
                height={800}
                className="w-full block object-cover"
              />
              <Image
                src="/images/schedule/manga-bottom-EN.png"
                alt={dict.schedule.title + " — bottom"}
                width={1200}
                height={800}
                className="w-full block object-cover"
              />
            </div>
          </div>
          {/* ── Narrative days block ───────── */}
          <div className="mt-8 max-w-3xl mx-auto">
            {(((dict.schedule as any).days || []) as any[]).slice(1).map((d: any, idx: number) => {
              // idx is 0 for the original second item (05-06-26)
              const dayNum = idx + 1; // new day numbering starts at 1

              // build localized title: remove original leading 'Day N:' and re-prefix
              const rawTitle: string = d.title || "";
              const colonIdx = rawTitle.indexOf(":");
              const remainder = colonIdx !== -1 ? rawTitle.slice(colonIdx + 1).trim() : rawTitle;
              const dayLabel = (dict.schedule as any).dayLabel ?? "Day";
              const newTitle = `${dayLabel} ${dayNum}: ${remainder}`;

              // compute date string (original days start at 4 June)
              const dateDay = 5 + idx; // 05 for idx=0, 06 for idx=1, etc.
              const dateStr = `${String(dateDay).padStart(2, "0")}-06-26`;

              // render date; optionally highlight '6' in red for the Ultimate Quest day only
              const renderDate = (s: string, highlightSix: boolean) => (
                <span className="ml-3 text-base" style={{ fontFamily: "var(--font-dutch-1756)" }}>
                  {Array.from(s).map((ch, i) => (
                    ch === "6" && highlightSix ? (
                      <span key={i} className="text-rose">{ch}</span>
                    ) : (
                      <span key={i}>{ch}</span>
                    )
                  ))}
                </span>
              );

              // remove any leading 'Panel' translations from panelTitle
              const panelTitle = (d.panelTitle || "").replace(/^\s*(Panel|Painel|Πίνακας)\s*:\s*/i, "");

              return (
                <div key={idx} className="mb-6">
                  <div className="inline-block bg-black text-white px-3 py-1 text-base" style={{ fontFamily: "var(--font-dutch-1756)" }}>
                    <span>{newTitle}</span>
                    {renderDate(dateStr, idx === 1)}
                  </div>
                  <div className="mt-3 bg-white rounded-none shadow-sm p-5 text-ink">
                    <p className="font-semibold mb-2">{panelTitle}</p>
                    <p className="text-base leading-relaxed">{d.panelText}</p>
                    {d.locationName && d.locationUrl && (
                      <p className="mt-3 text-base">
                        <a href={d.locationUrl} target="_blank" rel="noopener noreferrer" className="text-vermillion underline">
                          📍 {d.locationName}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page number */}
          <div className="text-right mt-2 pr-2">
            <span className="text-xs text-ink/30 tracking-wider" style={{ fontFamily: "var(--font-dutch)" }}>
              — {filteredSchedule.length} —
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
