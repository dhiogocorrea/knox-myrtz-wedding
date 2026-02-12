"use client";

import { useEffect, useState } from "react";

const petalColors = [
  "text-purple-400/40",
  "text-violet-300/50",
  "text-primary-light/30",
  "text-purple-500/30",
  "text-gold/25",
];

interface Petal {
  id: number;
  color: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

function PetalSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C12 2 7 7 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 7 12 2 12 2Z" />
    </svg>
  );
}

export function PetalOverlay() {
  const [activePetals, setActivePetals] = useState<Petal[]>([]);

  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      const newPetal: Petal = {
        id: id++,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        left: Math.random() * 100,
        delay: 0,
        duration: 8 + Math.random() * 6,
        size: 12 + Math.random() * 12,
        rotation: Math.random() * 360,
      };

      setActivePetals((prev) => {
        const filtered = prev.filter(
          (p) => Date.now() - p.id < (p.duration + p.delay) * 1000 + 2000
        );
        return [...filtered, newPetal].slice(-8);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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
          <PetalSVG />
        </div>
      ))}
    </div>
  );
}
