"use client";

import { useState } from "react";
import { Flower2, Leaf, Heart } from "lucide-react";
import type { SiteConfig } from "@/lib/schema";
import type { Dictionary } from "@/lib/i18n";

interface LoginScreenProps {
  dict: Dictionary;
  config: SiteConfig;
  onLogin: (password: string) => boolean;
}

export function LoginScreen({ dict, config, onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cream">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <Flower2 className="absolute top-10 left-10 w-16 h-16 text-purple-700/10 animate-float" strokeWidth={1} />
        <Leaf className="absolute top-32 right-20 w-14 h-14 text-violet-400/10 animate-float" style={{ animationDelay: "1s" }} strokeWidth={1} />
        <Flower2 className="absolute bottom-20 left-1/4 w-20 h-20 text-purple-600/10 animate-float" style={{ animationDelay: "2s" }} strokeWidth={1} />
        <Heart className="absolute bottom-40 right-1/3 w-12 h-12 text-primary/10 animate-float" style={{ animationDelay: "0.5s" }} strokeWidth={1} />
        <Leaf className="absolute top-1/2 left-5 w-10 h-10 text-violet-300/10 animate-float" style={{ animationDelay: "1.5s" }} strokeWidth={1} />

        {/* Soft gradient orbs - purple */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card rounded-3xl p-10 shadow-2xl">
          {/* Couple puppet illustration */}
          <div className="flex justify-center mb-4 animate-fade-in-up">
            <img
              src="/images/couple-login.svg"
              alt="Gui and Myrto"
              className="w-40 h-40 opacity-90"
            />
          </div>

          {/* Couple Names */}
          <div className="text-center mb-8 animate-fade-in-up">
            <p className="text-sm tracking-[0.3em] uppercase text-warm-gray mb-4">
              The Wedding of
            </p>
            <h1
              className="text-5xl md:text-6xl text-primary mb-2"
              style={{ fontFamily: "var(--font-great-vibes)" }}
            >
              {config.couple.partner1.shortName}
            </h1>
            <p className="text-2xl text-gold my-2">&</p>
            <h1
              className="text-5xl md:text-6xl text-primary"
              style={{ fontFamily: "var(--font-great-vibes)" }}
            >
              {config.couple.partner2.shortName}
            </h1>
          </div>

          {/* Greek olive branch divider */}
          <div className="mb-8 animate-fade-in-up stagger-2">
            <div className="greek-divider mx-auto max-w-[200px]" />
          </div>

          {/* Login text */}
          <div className="text-center mb-6 animate-fade-in-up stagger-3">
            <h2
              className="text-2xl text-primary-dark mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
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
                className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 bg-white/80 text-charcoal placeholder:text-warm-gray/50 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                  error
                    ? "border-rose shake"
                    : "border-accent focus:border-gold"
                }`}
              />
              {error && (
                <p className="text-rose text-sm mt-2 text-center animate-fade-in">
                  {dict.login.error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-gold/50"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {dict.login.button}
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
