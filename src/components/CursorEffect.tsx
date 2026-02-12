"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  hue: number;
}

export function CursorEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let particleId = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Create new particles
      const newParticles: Particle[] = [];
      for (let i = 0; i < 2; i++) {
        newParticles.push({
          id: particleId++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          opacity: 1,
          velocityX: (Math.random() - 0.5) * 2,
          velocityY: (Math.random() - 0.5) * 2,
          hue: Math.random() * 20 + 270, // Dark purple hues (270-290)
        });
      }

      setParticles((prev) => [...prev, ...newParticles].slice(-50)); // Keep max 50 particles
    };

    // Animate particles
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            opacity: p.opacity - 0.02,
            size: p.size * 0.98,
          }))
          .filter((p) => p.opacity > 0)
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              background: `hsl(${particle.hue}, 85%, 45%)`,
              boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue}, 85%, 45%)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </>
  );
}
