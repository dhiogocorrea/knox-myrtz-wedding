"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";

interface LoginScreenProps {
  dict: Dictionary;
  config: SiteConfig;
  onLogin: (password: string) => Promise<boolean>;
}

export function LoginScreen({ dict, config, onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onLogin(password);
    setLoading(false);
    if (!success) {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cream">
      {/* Background illustration */}
      <div className="absolute inset-0">
        <img
          src="/images/bg-1.png"
          alt=""
          className="select-none opacity-[0.40]"
          draggable={false}
        />

        {/* Gentle edge vignette */}
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(ellipse at center, transparent 50%, var(--color-paper) 100%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card p-10">
          {/* Couple puppet illustration */}
          <div className="flex justify-center mb-4 animate-fade-in-up">
            <img
              src="/images/couple-login.svg"
              alt="Gui and Mirto"
              className="w-40 h-40 opacity-90"
            />
          </div>

          {/* Couple Names */}
          <div className="text-center mb-8 animate-fade-in-up">
            <p className="text-xs tracking-[0.5em] uppercase text-warm-gray mb-4">
              The Wedding of
            </p>
            <h1
              className="text-5xl md:text-6xl text-ink mb-2 font-bold"
              style={{ fontFamily: "var(--font-manga)" }}
            >
              {config.couple.partner1.shortName}
            </h1>
            <p className="text-2xl text-vermillion/60 my-2">&</p>
            <h1
              className="text-5xl md:text-6xl text-ink font-bold"
              style={{ fontFamily: "var(--font-manga)" }}
            >
              {config.couple.partner2.shortName}
            </h1>
          </div>

          {/* Katana divider */}
          <div className="mb-8 animate-fade-in-up stagger-2">
            <div className="katana-divider mx-auto max-w-[200px]">
              <span className="text-vermillion/40 text-sm">❁</span>
            </div>
          </div>

          {/* Login text */}
          <div className="text-center mb-6 animate-fade-in-up stagger-3">
            <h2
              className="text-2xl text-ink mb-2 font-semibold"
              style={{ fontFamily: "var(--font-manga)" }}
            >
              {dict.login.title}
            </h2>
            <p className="text-warm-gray text-sm leading-relaxed">
              {dict.login.subtitle}
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="animate-fade-in-up stagger-4">
            <div className={`mb-4 transition-transform ${shaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
              style={{
                animation: shaking ? "shake 0.5s ease-in-out" : undefined,
              }}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder={dict.login.placeholder}
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 bg-white/80 text-charcoal placeholder:text-warm-gray/50 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-vermillion/20 ${
                  error
                    ? "border-vermillion shake"
                    : "border-ink/10 focus:border-vermillion/40"
                }`}
              />
              {error && (
                <p className="text-vermillion text-sm mt-2 text-center animate-fade-in">
                  {dict.login.error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-ink to-indigo text-white rounded-xl font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-ink/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-vermillion/30 flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-manga)" }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.login.button}
            </button>
          </form>

          {/* Date hint */}
          <p className="text-center text-warm-gray/60 text-xs mt-6 tracking-wider animate-fade-in-up stagger-5">
            {config.wedding.date} · {config.wedding.venue.name}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}
