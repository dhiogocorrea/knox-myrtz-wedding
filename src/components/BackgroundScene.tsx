"use client";

import { SakuraTreePetals } from "./SakuraTreePetals";

/**
 * BackgroundScene – fixed full-viewport background layer.
 * Uses a single illustrated bg-1.png (couple under cherry tree) as the entire scene.
 */
export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base paper */}
      <div className="absolute inset-0 bg-paper" />

      {/* ── Full illustration background ──────── */}
      <div className="absolute inset-0">
        <img
          src="/images/bg-1.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center select-none opacity-[0.45]"
          draggable={false}
        />
      </div>

      {/* Couple illustration moved into the HeroSection to appear between
          the titles and the date/countdown (keeps background scene purely
          decorative). */}

      {/* ── Sakura tree petals ──────── */}
      <SakuraTreePetals />

      {/* ── Dark cinematic vignette (subtle) ── */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, var(--color-ink) 100%)",
        }}
      />

      {/* ── Gentle edge fade for readability ── */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, var(--color-paper) 100%)",
        }}
      />

      {/* Subtle sakura warmth at top */}
      <div className="absolute top-0 left-0 w-full h-[25vh] bg-gradient-to-b from-sakura/[0.06] to-transparent" />
    </div>
  );
}
