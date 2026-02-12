"use client";

import type { SiteConfig, GuestGroup } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/utils";
import { ScheduleIcon } from "./icons/ScheduleIcon";

interface ScheduleSectionProps {
  config: SiteConfig;
  dict: Dictionary;
  locale: string;
  guestGroup: GuestGroup;
}

export function ScheduleSection({ config, dict, locale, guestGroup }: ScheduleSectionProps) {
  // Filter schedule items based on guest group
  const filteredSchedule = config.schedule.filter(item => {
    if (!item.visibleTo || item.visibleTo.length === 0) {
      // No restrictions - visible to all
      return true;
    }
    // Show only if user's group matches one of the allowed groups
    return guestGroup && item.visibleTo.includes(guestGroup);
  });

  return (
    <section className="min-h-[calc(100vh-5rem)] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="text-4xl md:text-5xl text-primary mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {dict.schedule.title}
          </h2>
          <div className="mb-4">
            <div className="greek-divider mx-auto max-w-xs" />
          </div>
          <p className="text-warm-gray">{dict.schedule.subtitle}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold/30 to-gold/0 md:-translate-x-px" />

          {filteredSchedule.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className="relative mb-12 last:mb-0 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "forwards",
                  opacity: 0,
                }}
              >
                {/* Desktop layout */}
                <div className="hidden md:flex items-center">
                  {/* Left content */}
                  <div className={`w-1/2 ${isEven ? "pr-12 text-right" : "pr-12 text-right opacity-0"}`}>
                    {isEven && (
                      <div className="glass-card rounded-2xl p-6 inline-block text-left ml-auto shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 group">
                        <div className="flex items-center gap-3 mb-2">
                          <ScheduleIcon name={item.icon} className="w-6 h-6 text-gold group-hover:animate-float" strokeWidth={1.5} />
                          <div>
                            <h3
                              className="text-lg text-primary-dark font-semibold"
                              style={{ fontFamily: "var(--font-playfair)" }}
                            >
                              {getLocalizedValue(item.title, locale)}
                            </h3>
                            <p className="text-xs text-gold tracking-wider font-medium">{item.time}</p>
                          </div>
                        </div>
                        <p className="text-warm-gray text-sm leading-relaxed">
                          {getLocalizedValue(item.description, locale)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-gold border-4 border-cream shadow-md shadow-gold/20 -mx-2" />

                  {/* Right content */}
                  <div className={`w-1/2 ${!isEven ? "pl-12" : "pl-12 opacity-0"}`}>
                    {!isEven && (
                      <div className="glass-card rounded-2xl p-6 inline-block shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 group">
                        <div className="flex items-center gap-3 mb-2">
                          <ScheduleIcon name={item.icon} className="w-6 h-6 text-gold group-hover:animate-float" strokeWidth={1.5} />
                          <div>
                            <h3
                              className="text-lg text-primary-dark font-semibold"
                              style={{ fontFamily: "var(--font-playfair)" }}
                            >
                              {getLocalizedValue(item.title, locale)}
                            </h3>
                            <p className="text-xs text-gold tracking-wider font-medium">{item.time}</p>
                          </div>
                        </div>
                        <p className="text-warm-gray text-sm leading-relaxed">
                          {getLocalizedValue(item.description, locale)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden flex items-start gap-4 ml-2">
                  <div className="relative z-10 mt-2 w-3 h-3 rounded-full bg-gold border-3 border-cream shadow-sm shadow-gold/20 flex-shrink-0" />
                  <div className="glass-card rounded-2xl p-5 shadow-lg shadow-primary/5 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ScheduleIcon name={item.icon} className="w-6 h-6 text-gold" strokeWidth={1.5} />
                      <div>
                        <h3
                          className="text-base text-primary-dark font-semibold"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {getLocalizedValue(item.title, locale)}
                        </h3>
                        <p className="text-xs text-gold tracking-wider font-medium">{item.time}</p>
                      </div>
                    </div>
                    <p className="text-warm-gray text-sm leading-relaxed">
                      {getLocalizedValue(item.description, locale)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
