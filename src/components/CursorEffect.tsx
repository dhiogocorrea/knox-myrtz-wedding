"use client";

import { useEffect, useRef, useCallback } from "react";

// Gentle One Piece-inspired cursor — soft Haki wisps + warm sparkles

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "wisp" | "sparkle";
  angle: number;
  rotation: number;
  color: string;
}

const WISP_COLORS = [
  "rgba(80, 10, 30, 0.3)",
  "rgba(60, 5, 25, 0.25)",
  "rgba(100, 15, 40, 0.2)",
];

const SPARKLE_COLORS = [
  "#e8a0b0",
  "#f0c0c8",
  "#d4808f",
  "#f2d0c8",
  "#c8707e",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const frameRef = useRef<number>(0);

  const createParticles = useCallback((x: number, y: number, dx: number, dy: number) => {
    const speed = Math.sqrt(dx * dx + dy * dy);
    const particles = particlesRef.current;

    // Soft dark wisps — gentle Haki threads, only on movement
    if (speed > 4 && Math.random() < 0.25) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * Math.PI * 0.6;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * 0.3,
        vy: Math.sin(angle) * 0.3,
        life: 1,
        maxLife: 1,
        size: Math.random() * 10 + 8,
        type: "wisp",
        angle,
        rotation: Math.random() * Math.PI * 2,
        color: randomFrom(WISP_COLORS),
      });
    }

    // Warm sparkles — like gentle love-love beam particles
    if (speed > 2 && Math.random() < 0.3) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 1 + 0.4;
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.3,
        life: 1,
        maxLife: 1,
        size: Math.random() * 2.5 + 1,
        type: "sparkle",
        angle: 0,
        rotation: Math.random() * Math.PI * 2,
        color: randomFrom(SPARKLE_COLORS),
      });
    }

    // Cap particles
    if (particles.length > 35) {
      particlesRef.current = particles.slice(-35);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const prev = mouseRef.current;
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      createParticles(e.clientX, e.clientY, dx, dy);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const drawWisp = (
      ctx: CanvasRenderingContext2D,
      p: Particle,
      alpha: number
    ) => {
      // Soft curved wisp — like a tiny smoke tendril
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = alpha * 0.5;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      const cp1x = p.size * 0.4;
      const cp1y = -p.size * 0.3;
      const cp2x = p.size * 0.8;
      const cp2y = p.size * 0.2;
      const endX = p.size;
      const endY = 0;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5 * alpha;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const drawSparkle = (
      ctx: CanvasRenderingContext2D,
      p: Particle,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;

      // Tiny 4-point star
      const s = p.size * alpha;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.2, -s * 0.2);
      ctx.lineTo(s, 0);
      ctx.lineTo(s * 0.2, s * 0.2);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.2, s * 0.2);
      ctx.lineTo(-s, 0);
      ctx.lineTo(-s * 0.2, -s * 0.2);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();

      // Soft glow
      ctx.globalAlpha = alpha * 0.3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.type === "wisp" ? 0.015 : 0.02;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.rotation += 0.01;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;

        if (p.type === "wisp") {
          drawWisp(ctx, p, alpha);
        } else {
          drawSparkle(ctx, p, alpha);
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
