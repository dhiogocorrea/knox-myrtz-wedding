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
    <footer className="py-12 px-4 border-t border-accent/30">
      <div className="max-w-4xl mx-auto text-center">
        {/* Olive branch divider */}
        <div className="greek-divider mb-6 mx-auto max-w-xs" />

        {/* Couple names */}
        <p
          className="text-3xl text-primary/60 mb-3"
          style={{ fontFamily: "var(--font-great-vibes)" }}
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
          <Heart className="w-3 h-3 text-rose/40 fill-rose/40" />
        </p>

        {/* Developer credit */}
        <p className="text-warm-gray/20 text-[10px] mt-4 italic">
          Made with love by Orimaz 💜
        </p>
      </div>
    </footer>
  );
}
