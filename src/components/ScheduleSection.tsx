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
/* Balloon position variants — cycle per panel index */
const BALLOON_POSITIONS = [
  { pos: "top-3 left-3",                    tail: "manga-balloon-tail-bl" },
  { pos: "top-3 right-3",                   tail: "manga-balloon-tail-br" },
  { pos: "bottom-3 right-3",                tail: "manga-balloon-tail-tr" },
  { pos: "bottom-3 left-3",                 tail: "manga-balloon-tail-tl" },
  { pos: "top-1/2 left-3 -translate-y-1/2", tail: "manga-balloon-tail-r"  },
];

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
    <section ref={sectionRef} className="min-h-[calc(100vh-5rem)] py-1 px-4 relative seigaiha">
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
                  const hasImage = !!panel.item.image;
                  const isWide = panel.span >= 4;
                  const isFull = panel.span === 6;
                  const defaultBalloon = BALLOON_POSITIONS[panel.globalIdx % BALLOON_POSITIONS.length];
                  const itemBalloon = (panel.item as any).balloon;

                  // balloon.type: 'balloon' (default) | 'none' | 'square'
                  const balloonType: "balloon" | "none" | "square" = (itemBalloon?.type as any) ?? (itemBalloon?.hide ? "none" : "balloon");

                  // If explicit top/left/right/bottom provided in style, prefer inline positioning
                  const hasExplicitPositionStyle = Boolean(itemBalloon && (itemBalloon.style?.top || itemBalloon.style?.left || itemBalloon.style?.right || itemBalloon.style?.bottom));
                  const usePosClass = !hasExplicitPositionStyle;
                  const posClass = usePosClass ? (itemBalloon?.pos ?? defaultBalloon.pos) : "";

                  // Tail only applies to normal 'balloon' type
                  const tailClass = balloonType === "balloon" ? (itemBalloon?.tail ?? defaultBalloon.tail) : "";

                  // Support either a Tailwind max-width class (eg. "max-w-[58%]")
                  // or a raw CSS max width value like "40%"/"240px". Raw values are applied inline.
                  const rawMaxWidth = itemBalloon?.maxWidth;
                  let maxWidthClass: string | undefined = undefined;
                  let maxWidthStyle: Record<string, any> | undefined = undefined;
                  if (rawMaxWidth) {
                    if (typeof rawMaxWidth === "string" && (rawMaxWidth.includes("%") || rawMaxWidth.endsWith("px") || rawMaxWidth.endsWith("rem") || rawMaxWidth.endsWith("em"))) {
                      maxWidthStyle = { maxWidth: rawMaxWidth };
                    } else {
                      maxWidthClass = rawMaxWidth as string;
                    }
                  }
                  if (!maxWidthClass && !maxWidthStyle) maxWidthClass = "max-w-[58%]";

                  const balloonInlineStyleRaw = itemBalloon?.style ? (itemBalloon.style as any) : {};
                  const balloonInlineStyle = { fontFamily: "var(--font-manga)", ...(balloonInlineStyleRaw || {}), ...(maxWidthStyle || {}) };
                  const finalBalloonStyle = hasExplicitPositionStyle
                    ? { position: "absolute", zIndex: 10, ...balloonInlineStyle }
                    : balloonInlineStyle;
                  const showLocation = itemBalloon?.showLocation !== false;
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
                          src={panel.item.image!}
                          alt={getLocalizedValue(panel.item.title, locale)}
                          fill
                          sizes={isFull ? "100vw" : isWide ? "66vw" : "33vw"}
                          className="object-cover pointer-events-none manga-panel-img"
                        />
                      )}

                      {/* ── Floating speech balloon / square / none ──────── */}
                      {balloonType === "none" ? (
                        // Just floating text (no box, no border, no shadow, no backdrop)
                        <div
                          className={`${usePosClass ? `absolute z-10 ${posClass}` : ""} ${maxWidthClass ?? ""}`}
                          style={{
                            ...finalBalloonStyle,
                            background: "transparent",
                            boxShadow: "none",
                            border: "none",
                            backdropFilter: "none",
                            WebkitBackdropFilter: "none",
                          }}
                        >
                          <p className="text-[0.68rem] leading-snug text-ink" style={{ fontFamily: "var(--font-manga)" }}>
                            <span className="text-vermillion font-bold">{panel.item.time}</span>
                            {" — "}{getLocalizedValue(panel.item.title, locale)}
                          </p>
                          {showLocation && panel.item.location && (
                            <p className="mt-1 text-[0.62rem] leading-snug text-ink/70" style={{ fontFamily: "var(--font-manga)" }}>
                              <a href={panel.item.location.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 text-vermillion" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4.5 8-11a8 8 0 1 0-16 0c0 6.5 8 11 8 11z" />
                                </svg>
                                {getLocalizedValue(panel.item.location.name, locale)}
                              </a>
                            </p>
                          )}
                        </div>
                      ) : balloonType === "square" ? (
                        // Solid square box with full opacity
                        <div
                          className={`${usePosClass ? `absolute z-10 ${posClass}` : ""} ${maxWidthClass ?? ""} bg-cream p-2 rounded-md shadow-sm`}
                          style={finalBalloonStyle}
                        >
                          <p className="text-[0.68rem] leading-snug text-ink" style={{ fontFamily: "var(--font-manga)" }}>
                            <span className="text-vermillion font-bold">{panel.item.time}</span>
                            {" — "}{getLocalizedValue(panel.item.title, locale)}
                          </p>
                          {showLocation && panel.item.location && (
                            <p className="mt-1 text-[0.62rem] leading-snug text-ink/70" style={{ fontFamily: "var(--font-manga)" }}>
                              <a href={panel.item.location.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 text-vermillion" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4.5 8-11a8 8 0 1 0-16 0c0 6.5 8 11 8 11z" />
                                </svg>
                                {getLocalizedValue(panel.item.location.name, locale)}
                              </a>
                            </p>
                          )}
                          {panel.item.description && (
                            <div className="mt-2 text-[0.62rem] leading-snug text-ink/80" style={{ fontFamily: "var(--font-manga)" }}>
                              {getLocalizedValue(panel.item.description, locale)}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Default: balloon with tail and semi-transparent background
                        <div
                          className={`${["absolute z-10", maxWidthClass, "manga-balloon", posClass, tailClass].filter(Boolean).join(" ")}`}
                          style={finalBalloonStyle}
                        >
                          <p className="text-[0.68rem] leading-snug text-ink" style={{ fontFamily: "var(--font-manga)" }}>
                            <span className="text-vermillion font-bold">{panel.item.time}</span>
                            {" — "}{getLocalizedValue(panel.item.title, locale)}
                          </p>
                          {panel.item.location && (
                            <p className="mt-1 text-[0.62rem] leading-snug text-ink/70" style={{ fontFamily: "var(--font-manga)" }}>
                              <a
                                href={panel.item.location.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 underline"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                  className="w-3 h-3 text-vermillion"
                                  aria-hidden
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4.5 8-11a8 8 0 1 0-16 0c0 6.5 8 11 8 11z" />
                                </svg>
                                {getLocalizedValue(panel.item.location.name, locale)}
                              </a>
                            </p>
                          )}
                          {panel.item.description && (
                            <div
                              className="mt-2 text-[0.62rem] leading-snug text-ink/80 bg-cream/80 p-2 rounded-md shadow-sm max-w-[18rem] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
                              style={{ fontFamily: "var(--font-manga)" }}
                            >
                              {getLocalizedValue(panel.item.description, locale)}
                            </div>
                          )}
                        </div>
                      )}
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
