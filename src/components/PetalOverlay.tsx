"use client";

import { useEffect, useState } from "react";

const petalColors = [
  "text-sakura/60",
  "text-vermillion/20",
  "text-sakura/45",
  "text-sakura/35",
  "text-gold/15",
];

interface Petal {
  id: number;
  color: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  variant: number;
}

/* Three petal shape variants for visual variety */
function PetalSVG({ variant, className }: { variant: number; className?: string }) {
  switch (variant) {
    case 1:
      // Classic teardrop petal
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C12 2 6 8 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 8 12 2 12 2Z" />
        </svg>
      );
    case 2:
      // Rounded sakura petal
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 3C12 3 8 7 7 11C6 15 8 18 12 19C16 18 18 15 17 11C16 7 12 3 12 3Z" />
        </svg>
      );
    default:
      // Elongated petal
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C12 2 7 7 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 7 12 2 12 2Z" />
        </svg>
      );
  }
}

export function PetalOverlay() {
  const [activePetals, setActivePetals] = useState<Petal[]>([]);

  useEffect(() => {
    let id = 0;
    // Spawn petals more frequently for a lush cherry blossom feel
    const interval = setInterval(() => {
      const count = Math.random() > 0.5 ? 2 : 1; // Sometimes spawn 2 at once
      const newPetals: Petal[] = [];
      for (let i = 0; i < count; i++) {
        newPetals.push({
          id: id++,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 7 + Math.random() * 8,
          size: 10 + Math.random() * 16,
          rotation: Math.random() * 360,
          variant: Math.floor(Math.random() * 3),
        });
      }

      setActivePetals((prev) => {
        const filtered = prev.filter(
          (p) => Date.now() - p.id < (p.duration + p.delay) * 1000 + 2000
        );
        return [...filtered, ...newPetals].slice(-14);
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {activePetals.map((petal) => (
        <div
          key={petal.id}
          className={`petal ${petal.color}`}
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        >
          <PetalSVG variant={petal.variant} />
        </div>
      ))}
    </div>
  );
}
