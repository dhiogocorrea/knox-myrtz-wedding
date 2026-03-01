"use client";

import { Heart } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";

interface FooterProps {
  config: SiteConfig;
  dict: Dictionary;
}

export function Footer({ config, dict }: FooterProps) {
  return (
    <footer className="py-12 px-4 border-t border-ink/[0.06]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Katana divider */}
        <div className="katana-divider mb-6 mx-auto max-w-xs">
          <span className="text-vermillion/30 text-sm">❁</span>
        </div>

        {/* Couple names */}
        <p
          className="text-3xl text-ink/40 mb-3 font-bold"
          style={{ fontFamily: "var(--font-manga)" }}
        >
          {config.couple.partner1.shortName} & {config.couple.partner2.shortName}
        </p>

        {/* Date */}
        <p className="text-warm-gray/50 text-xs tracking-[0.3em] uppercase mb-4">
          {config.wedding.date}
        </p>

        {/* Made with love */}
        <p className="text-warm-gray/30 text-xs flex items-center justify-center gap-1">
          {dict.footer.madeWithLove} {config.couple.partner1.shortName} & {config.couple.partner2.shortName}
          <Heart className="w-3 h-3 text-vermillion/40 fill-vermillion/40" />
        </p>
      </div>
    </footer>
  );
}
