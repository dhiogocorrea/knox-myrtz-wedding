"use client";

import { useState } from "react";
import { Heart, Mail, Check, X, Loader2 } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";

interface RsvpSectionProps {
  config: SiteConfig;
  dict: Dictionary;
}

type SubmitState = "idle" | "sending" | "success" | "error";

export function RsvpSection({ config, dict }: RsvpSectionProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendance: "Yes",
    guests: "1",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");

    try {
      const form = new FormData();
      form.append("_googleFormUrl", config.rsvp.googleFormUrl);
      form.append(config.rsvp.fields.name, formData.name);
      form.append(config.rsvp.fields.email, formData.email);
      form.append(config.rsvp.fields.attendance, formData.attendance);
      form.append(config.rsvp.fields.guests, formData.guests);
      form.append(config.rsvp.fields.phone, formData.phone);
      form.append(config.rsvp.fields.message, formData.message);

      // Google Forms session fields
      form.append("fvv", "1");
      form.append("pageHistory", "0");

      const response = await fetch("/api/rsvp", {
        method: "POST",
        body: form,
      });

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

  if (state === "success") {
    return (
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4">
        <div className="max-w-md mx-auto text-center animate-scale-in">
          <div className="glass-card rounded-3xl p-10 shadow-2xl">
            <div className="flex justify-center mb-6">
              <Heart className="w-16 h-16 text-rose fill-rose/20" strokeWidth={1.5} />
            </div>
            <h2
              className="text-3xl text-primary mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {dict.rsvp.successTitle}
            </h2>
            <p className="text-warm-gray leading-relaxed mb-8">
              {dict.rsvp.successMessage}
            </p>
            <button
              onClick={() => {
                setState("idle");
                setFormData({
                  name: "",
                  email: "",
                  attendance: "Yes",
                  guests: "1",
                  phone: "",
                  message: "",
                });
              }}
              className="text-sm text-gold hover:text-primary-dark transition-colors underline underline-offset-4 decoration-gold/30"
            >
              {dict.rsvp.sendAnother}
            </button>
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
          <h2
            className="text-4xl md:text-5xl text-primary mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {dict.rsvp.title}
          </h2>
          <div className="mb-4">
            <div className="greek-divider mx-auto max-w-xs" />
          </div>
          <p className="text-warm-gray">{dict.rsvp.subtitle}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl shadow-primary/5 animate-fade-in-up stagger-2"
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
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-gold/50"
            style={{ fontFamily: "var(--font-playfair)" }}
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
