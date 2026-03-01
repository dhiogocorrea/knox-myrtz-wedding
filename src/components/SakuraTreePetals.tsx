"use client";

import { useEffect, useState } from "react";

/* Purple / lilac palette for tree petals */
const purpleColors = [
  "#9b59b6",  // amethyst
  "#8e44ad",  // deep purple
  "#c39bd3",  // soft lilac
  "#af7ac5",  // medium purple
  "#d2b4de",  // pale lavender
  "#7d3c98",  // rich violet
];

interface TreePetal {
  id: number;
  color: string;
  left: number;   // % within the tree container
  top: number;    // starting top % (canopy area)
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  variant: number;
  opacity: number;
}

/* Three petal shape variants */
function PurplePetalSVG({ variant, color }: { variant: number; color: string }) {
  switch (variant) {
    case 1:
      return (
        <svg viewBox="0 0 24 24" fill={color}>
          <path d="M12 2C12 2 6 8 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 8 12 2 12 2Z" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 24 24" fill={color}>
          <path d="M12 3C12 3 8 7 7 11C6 15 8 18 12 19C16 18 18 15 17 11C16 7 12 3 12 3Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill={color}>
          <path d="M12 2C12 2 7 7 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 7 12 2 12 2Z" />
        </svg>
      );
  }
}

export function SakuraTreePetals() {
  const [petals, setPetals] = useState<TreePetal[]>([]);

  useEffect(() => {
    let id = 0;

    const spawn = () => {
      const count = Math.random() > 0.6 ? 2 : 1;
      const newPetals: TreePetal[] = [];

      for (let i = 0; i < count; i++) {
        newPetals.push({
          id: id++,
          color: purpleColors[Math.floor(Math.random() * purpleColors.length)],
          // Spawn across the upper portion of the tree container (canopy area)
          left: 30 + Math.random() * 65,   // 30-95% of container width (where branches are)
          top: 5 + Math.random() * 20,      // 5-25% from top (canopy zone)
          delay: Math.random() * 0.8,
          duration: 8 + Math.random() * 10,
          size: 8 + Math.random() * 12,
          rotation: Math.random() * 360,
          variant: Math.floor(Math.random() * 3),
          opacity: 0.4 + Math.random() * 0.4,
        });
      }

      setPetals((prev) => {
        const now = Date.now();
        const filtered = prev.filter(
          (p) => now - p.id < (p.duration + p.delay) * 1000 + 2000
        );
        return [...filtered, ...newPetals].slice(-18);
      });
    };

    // Initial burst of a few petals
    for (let i = 0; i < 4; i++) {
      setTimeout(spawn, i * 400);
    }

    const interval = setInterval(spawn, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="tree-petal"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        >
          <PurplePetalSVG variant={petal.variant} color={petal.color} />
        </div>
      ))}
    </div>
  );
}
