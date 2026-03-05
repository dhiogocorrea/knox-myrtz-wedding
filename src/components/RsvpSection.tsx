"use client";

import { useState, useEffect } from "react";
import { Heart, Mail, Check, X, Loader2 } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";

interface RsvpSectionProps {
  config: SiteConfig;
  dict: Dictionary;
  authPassword: string;
}

type SubmitState = "idle" | "loading" | "sending" | "success" | "error" | "already-submitted";

export function RsvpSection({ config, dict, authPassword }: RsvpSectionProps) {
  const [state, setState] = useState<SubmitState>("loading");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendance: "Yes",
    guests: "1",
    kids: "0",
    phone: "",
    message: "",
    rentCar: "No",
    dietary: "",
    eventDates: [] as string[],
  });

  const [guestGroup, setGuestGroup] = useState<"friends" | "family" | null>(null);

  // Check RSVP status from Supabase on mount
  useEffect(() => {
    if (!authPassword) {
      setState("idle");
      return;
    }

    fetch("/api/rsvp/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: authPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        setState(data.submitted ? "already-submitted" : "idle");
        if (data.guestGroup) setGuestGroup(data.guestGroup as any);
      })
      .catch(() => {
        setState("idle"); // On error, allow them to try
      });
  }, [authPassword]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    // checkbox multi-select for event dates
    if (target.type === "checkbox" && target.name === "eventDates") {
      const val = target.value;
      setFormData((prev) => {
        const existing = Array.isArray(prev.eventDates) ? prev.eventDates.slice() : [];
        if (target.checked) {
          if (!existing.includes(val)) existing.push(val);
        } else {
          const idx = existing.indexOf(val);
          if (idx !== -1) existing.splice(idx, 1);
        }
        return { ...prev, eventDates: existing };
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: authPassword,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          attendance: formData.attendance.toLowerCase(),
          guests: formData.guests,
          kids: formData.kids,
          message: formData.message,
          rentCar: formData.rentCar,
          dietary: formData.dietary,
          eventDates: formData.eventDates,
        }),
      });

      if (response.status === 409) {
        setState("already-submitted");
        return;
      }

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setState("success");
    } catch {
      setState("error");
    }
  };

  const deadlineDate = new Date(config.rsvp.deadline + "T00:00:00");
  const deadlineFormatted = deadlineDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (state === "loading") {
    return (
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4">
        <Heart className="w-10 h-10 text-rose animate-pulse" strokeWidth={1.5} />
      </section>
    );
  }

  if (state === "success" || state === "already-submitted") {
    const isAlready = state === "already-submitted";
    return (
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4">
        <div className="max-w-md mx-auto text-center animate-scale-in">
          <div className="glass-card p-10">
            <div className="flex justify-center mb-6">
              {isAlready ? (
                <Mail className="w-16 h-16 text-gold" strokeWidth={1.5} />
              ) : (
                <Heart className="w-16 h-16 text-vermillion fill-vermillion/20" strokeWidth={1.5} />
              )}
            </div>
            <h2
              className="text-3xl text-ink mb-4"
              style={{ fontFamily: "var(--font-manga)" }}
            >
              {isAlready ? dict.rsvp.alreadySubmittedTitle : dict.rsvp.successTitle}
            </h2>
            <p className="text-warm-gray leading-relaxed">
              {isAlready ? dict.rsvp.alreadySubmittedMessage : dict.rsvp.successMessage}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-xs tracking-[0.5em] uppercase text-vermillion/60 mb-3 font-medium"
             style={{ fontFamily: "var(--font-manga)" }}>
            ── 返信 ──
          </p>
          <h2
            className="text-4xl md:text-5xl text-ink mb-4 font-bold"
            style={{ fontFamily: "var(--font-manga)" }}
          >
            {dict.rsvp.title}
          </h2>
          <div className="mb-4">
            <div className="katana-divider mx-auto max-w-xs">
              <span className="text-vermillion/40 text-sm">❁</span>
            </div>
          </div>
          <p className="text-warm-gray">{dict.rsvp.subtitle}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-10 animate-fade-in-up stagger-2"
        >
          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary-dark mb-2">
              {dict.rsvp.nameLabel} <span className="text-rose">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={dict.rsvp.namePlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal placeholder:text-warm-gray/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary-dark mb-2">
              {dict.rsvp.emailLabel} <span className="text-rose">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={dict.rsvp.emailPlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal placeholder:text-warm-gray/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          {/* Attendance */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary-dark mb-3">
              {dict.rsvp.attendanceLabel} <span className="text-rose">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.attendance === "Yes"
                    ? "border-sage bg-sage/10 text-sage-dark"
                    : "border-accent hover:border-sage/40 text-warm-gray"
                }`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="Yes"
                  checked={formData.attendance === "Yes"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-xl"><Check className="w-5 h-5" /></span>
                <span className="text-sm font-medium">{dict.rsvp.attendanceYes}</span>
              </label>
              <label
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.attendance === "No"
                    ? "border-rose bg-rose/10 text-rose"
                    : "border-accent hover:border-rose/40 text-warm-gray"
                }`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="No"
                  checked={formData.attendance === "No"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-xl"><X className="w-5 h-5" /></span>
                <span className="text-sm font-medium">{dict.rsvp.attendanceNo}</span>
              </label>
            </div>
          </div>

          {/* Number of Guests */}
          {formData.attendance === "Yes" && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-primary-dark mb-2">
                {dict.rsvp.guestsLabel}
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Number of Children */}
          {formData.attendance === "Yes" && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-primary-dark mb-2">
                {dict.rsvp.kidsLabel}
              </label>
              <select
                name="kids"
                value={formData.kids}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Event date multi-select (after children, before rent car) */}
          {formData.attendance === "Yes" && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-primary-dark mb-2">
                {dict.rsvp.eventDatesLabel}{' '}
                <a href="/#schedule" className="underline text-ink">{dict.rsvp.scheduleLinkText}</a>
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(
                  (guestGroup === 'family')
                    ? [4, 5, 6, 7, 8]
                    : [5, 6, 7, 8]
                ).map((d) => {
                  const value = `2026-06-${String(d).padStart(2, '0')}`;
                  const options = (dict.rsvp as any).eventOptions as Record<string, string> | undefined;
                  const labelHtml = options?.[value] ?? `${d} June`;
                  return (
                    <label key={value} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="eventDates"
                        value={value}
                        checked={formData.eventDates.includes(value)}
                        onChange={handleChange}
                        className="w-4 h-4 mt-1"
                      />
                      <span className="text-sm leading-tight" dangerouslySetInnerHTML={{ __html: labelHtml }} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rent a Car */}
          {formData.attendance === "Yes" && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-primary-dark mb-3">
                {dict.rsvp.rentCarLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    formData.rentCar === "Yes"
                      ? "border-sage bg-sage/10 text-sage-dark"
                      : "border-accent hover:border-sage/40 text-warm-gray"
                  }`}
                >
                  <input
                    type="radio"
                    name="rentCar"
                    value="Yes"
                    checked={formData.rentCar === "Yes"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-xl"><Check className="w-5 h-5" /></span>
                  <span className="text-sm font-medium">{dict.rsvp.rentCarYes}</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    formData.rentCar === "No"
                      ? "border-rose bg-rose/10 text-rose"
                      : "border-accent hover:border-rose/40 text-warm-gray"
                  }`}
                >
                  <input
                    type="radio"
                    name="rentCar"
                    value="No"
                    checked={formData.rentCar === "No"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-xl"><X className="w-5 h-5" /></span>
                  <span className="text-sm font-medium">{dict.rsvp.rentCarNo}</span>
                </label>
              </div>
            </div>
          )}

          {/* Dietary restrictions */}
          {formData.attendance === "Yes" && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-primary-dark mb-2">
                {dict.rsvp.dietaryLabel}
              </label>
              <textarea
                name="dietary"
                rows={2}
                value={formData.dietary}
                onChange={handleChange}
                placeholder={dict.rsvp.dietaryPlaceholder}
                className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal placeholder:text-warm-gray/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
              />
            </div>
          )}

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary-dark mb-2">
              {dict.rsvp.phoneLabel} <span className="text-rose">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder={dict.rsvp.phonePlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal placeholder:text-warm-gray/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-primary-dark mb-2">
              {dict.rsvp.messageLabel}
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder={dict.rsvp.messagePlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal placeholder:text-warm-gray/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
            />
          </div>

          {/* Error message */}
          {state === "error" && (
            <div className="mb-6 p-4 rounded-xl bg-rose/10 border border-rose/20 text-rose text-sm text-center animate-fade-in">
              {dict.rsvp.errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full py-4 bg-gradient-to-r from-ink to-indigo text-white rounded-xl font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-ink/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-vermillion/30"
            style={{ fontFamily: "var(--font-manga)" }}
          >
            {state === "sending" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {dict.rsvp.sending}
              </span>
            ) : (
              dict.rsvp.submit
            )}
          </button>

          {/* Deadline note */}
          <p className="text-center text-warm-gray/60 text-xs mt-4 tracking-wide">
            {dict.rsvp.deadline} {deadlineFormatted}
          </p>
        </form>
      </div>
    </section>
  );
}
