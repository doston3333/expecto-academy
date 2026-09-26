import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

type Mode = "day" | "night";

interface OceanProps {
  mode: Mode;
  /** Horizon height as a fraction of the canvas. */
  horizon?: number;
  /** 0 → 1 as the section scrolls away; the boat sails with it. */
  progress?: MotionValue<number>;
  className?: string;
  boat?: boolean;
  sun?: boolean;
  birds?: boolean;
  lighthouse?: boolean;
  stars?: boolean;
}

interface Line {
  p: number;
  segs: [number, number][];
  phase: number;
  speed: number;
  wl: number;
  amp: number;
}

const PALETTE = {
  day: { bg: "#f4eee2", ink: "22,33,43", gold: "168,118,46", goldSoft: "239,220,176", paper: "#f7f2e8" },
  night: { bg: "#0b131b", ink: "236,228,211", gold: "212,169,94", goldSoft: "239,220,176", paper: "#0b131b" },
} as const;

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildLines(w: number, seaHeight: number): Line[] {
  const rand = mulberry(7);
  const count = Math.max(14, Math.min(30, Math.round(seaHeight / 15)));
  const lines: Line[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.6) / count;
    const p = Math.pow(t, 1.6);
    const segs: [number, number][] = [];
    let x = -40 + rand() * 60;
    while (x < w + 40) {
      const len = (50 + rand() * 260) * (0.35 + p * 1.8);
      const gap = (14 + rand() * 90) * (1.25 - p * 0.75);
      if (rand() > 0.12 + (1 - p) * 0.25) segs.push([x, Math.min(x + len, w + 60)]);
      x += len + gap;
    }
    lines.push({
      p,
      segs,
      phase: rand() * Math.PI * 2,
      speed: 0.45 + rand() * 0.35,
      wl: 110 + p * 460 + rand() * 60,
      amp: 0.6 + p * 11,
    });
  }
  return lines;
}

function waveY(line: Line, x: number, T: number, scale: number) {
  const k1 = (Math.PI * 2) / line.wl;
  const k2 = (Math.PI * 2) / (line.wl * 0.47);
  return (
    line.amp *
    scale *
    (0.62 * Math.sin(k1 * x + T * line.speed + line.phase) + 0.38 * Math.sin(k2 * x - T * line.speed * 0.8 + line.phase * 1.7))
  );
}

export function Ocean({
  mode,
  horizon = 0.62,
  progress,
  className,
  boat,
  sun,
  birds,
  lighthouse,
  stars,
}: OceanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const colors = PALETTE[mode];

    let w = 0;
    let h = 0;
    let dpr = 1;
    let lines: Line[] = [];
    let raf = 0;
    let running = false;
    let visible = false;
    const start = performance.now();
    const starField = Array.from({ length: 46 }, (_, i) => {
      const r = mulberry(100 + i);
      return { x: r(), y: r(), s: 0.5 + r() * 1.1, ph: r() * 6.28 };
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      lines = buildLines(w, h * (1 - horizon));
      if (!running) draw(reduced ? 6000 : performance.now() - start);
    };

    const sketchCircle = (cx: number, cy: number, r: number, frame: number, loops = 2) => {
      for (let l = 0; l < loops; l++) {
        const rr = mulberry(frame * 31 + l * 7);
        ctx.beginPath();
        const a0 = rr() * Math.PI * 2;
        const span = Math.PI * 2 * (1.02 + rr() * 0.08);
        for (let s = 0; s <= 64; s++) {
          const a = a0 + (span * s) / 64;
          const wob = 1 + Math.sin(a * 3 + rr() * 6) * 0.012 + (l - 0.5) * 0.03;
          const x = cx + Math.cos(a) * r * wob;
          const y = cy + Math.sin(a) * r * wob;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const draw = (ms: number) => {
      const T = ms / 1000;
      const frame = Math.floor(T * 8);
      const scale = Math.min(1.25, Math.max(0.6, h / 820));
      const H0 = h * horizon;
      const prog = progress?.get() ?? 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      /* Sky ------------------------------------------------------------ */
      if (stars) {
        for (const s of starField) {
          const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(T * 1.3 + s.ph));
          ctx.fillStyle = `rgba(${colors.ink},${a * 0.7})`;
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * H0 * 0.92, s.s, 0, Math.PI * 2);
          ctx.fill();
        }
        // crescent moon
        const mx = w * 0.16;
        const my = H0 * 0.3;
        const mr = Math.max(14, Math.min(w, h) * 0.028);
        ctx.fillStyle = `rgba(${colors.goldSoft},0.92)`;
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colors.bg;
        ctx.beginPath();
        ctx.arc(mx + mr * 0.42, my - mr * 0.18, mr * 0.92, 0, Math.PI * 2);
        ctx.fill();
      }

      if (sun) {
        const sx = w * (w < 768 ? 0.74 : 0.7);
        const sr = Math.max(34, Math.min(w, h) * 0.085);
        const sy = H0 - sr * 0.38 - prog * sr * 0.9;
        const glow = ctx.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr * 3.2);
        glow.addColorStop(0, `rgba(${colors.goldSoft},0.55)`);
        glow.addColorStop(1, `rgba(${colors.goldSoft},0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(sx - sr * 3.2, sy - sr * 3.2, sr * 6.4, sr * 6.4);
        ctx.fillStyle = `rgba(${colors.goldSoft},0.9)`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${colors.gold},0.75)`;
        ctx.lineWidth = 1.2;
        sketchCircle(sx, sy, sr, frame);
      }

      if (birds && w >= 768) {
        const left = w * 0.52;
        for (let b = 0; b < 3; b++) {
          const speed = 9 + b * 4;
          const span = w - left + 120;
          const bx = left + ((w * (0.08 + b * 0.13) + T * speed) % span) - 40;
          const by = H0 - 150 * scale - b * 22 * scale + Math.sin(T * 0.7 + b) * 5;
          const f = 0.35 + 0.65 * Math.abs(Math.sin(T * (2.6 + b * 0.4) + b));
          const s = (6 + b * 1.6) * scale;
          ctx.strokeStyle = `rgba(${colors.ink},0.62)`;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(bx - s, by);
          ctx.quadraticCurveTo(bx - s * 0.5, by - s * 0.7 * f, bx, by);
          ctx.quadraticCurveTo(bx + s * 0.5, by - s * 0.7 * f, bx + s, by);
          ctx.stroke();
        }
      }

      /* Sea hides everything under the horizon ------------------------- */
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, H0, w, h - H0);

      // horizon
      ctx.strokeStyle = `rgba(${colors.ink},0.34)`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = H0 + Math.sin(x * 0.013 + frame * 1.7) * 0.35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      /* Lighthouse --------------------------------------------------- */
      let lampX = 0;
      let lampY = 0;
      if (lighthouse) {
        const lx = w * (w < 768 ? 0.76 : 0.8);
        const baseY = H0 + (h - H0) * 0.1;
        const ht = Math.min(h * 0.3, 280) * (w < 768 ? 0.78 : 1);
        const bw = ht * 0.17;
        const tw = ht * 0.11;
        lampX = lx;
        lampY = baseY - ht - ht * 0.07;
        const beamAngle = T * 0.55;
        const facing = Math.max(0, Math.cos(beamAngle));
        const side = Math.sin(beamAngle);
        const len = w * 0.95 * Math.abs(side);
        const dir = Math.sign(side) || 1;

        const beam = ctx.createLinearGradient(lampX, lampY, lampX + dir * len, lampY);
        beam.addColorStop(0, `rgba(${colors.gold},${0.42 + facing * 0.2})`);
        beam.addColorStop(1, `rgba(${colors.gold},0)`);
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(lampX, lampY - 3);
        ctx.lineTo(lampX + dir * len, lampY - len * 0.1);
        ctx.lineTo(lampX + dir * len, lampY + len * 0.07);
        ctx.lineTo(lampX, lampY + 3);
        ctx.closePath();
        ctx.fill();

        const halo = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, 60 + facing * 90);
        halo.addColorStop(0, `rgba(${colors.goldSoft},${0.55 + facing * 0.4})`);
        halo.addColorStop(1, `rgba(${colors.gold},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(lampX, lampY, 60 + facing * 90, 0, Math.PI * 2);
        ctx.fill();

        // rock
        const jr = mulberry(frame + 3);
        ctx.fillStyle = colors.bg;
        ctx.strokeStyle = `rgba(${colors.ink},0.7)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(lx - bw * 2.6, baseY + 16);
        ctx.quadraticCurveTo(lx - bw * 2, baseY - 4 + jr(), lx - bw * 0.9, baseY + jr());
        ctx.lineTo(lx + bw * 1.1, baseY - 1 + jr());
        ctx.quadraticCurveTo(lx + bw * 2.2, baseY + 2, lx + bw * 3, baseY + 16);
        ctx.fill();
        ctx.stroke();

        // tower
        ctx.beginPath();
        ctx.moveTo(lx - bw / 2, baseY);
        ctx.lineTo(lx - tw / 2, baseY - ht);
        ctx.lineTo(lx + tw / 2, baseY - ht);
        ctx.lineTo(lx + bw / 2, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // bands, hatched
        ctx.save();
        ctx.clip();
        ctx.strokeStyle = `rgba(${colors.ink},0.28)`;
        ctx.lineWidth = 0.8;
        for (const band of [0.18, 0.55]) {
          const y0 = baseY - ht * band;
          const y1 = y0 - ht * 0.14;
          for (let k = -bw; k < bw * 1.4; k += 4) {
            ctx.beginPath();
            ctx.moveTo(lx - bw + k, y0);
            ctx.lineTo(lx - bw + k + ht * 0.14 * 0.6, y1);
            ctx.stroke();
          }
        }
        ctx.restore();
        // gallery + lamp room + roof
        ctx.strokeStyle = `rgba(${colors.ink},0.8)`;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(lx - tw * 0.85, baseY - ht - 3, tw * 1.7, 3);
        ctx.fillStyle = `rgba(${colors.goldSoft},${0.75 + facing * 0.25})`;
        ctx.fillRect(lx - tw * 0.4, lampY - ht * 0.04, tw * 0.8, ht * 0.075);
        ctx.strokeRect(lx - tw * 0.4, lampY - ht * 0.04, tw * 0.8, ht * 0.075);
        ctx.beginPath();
        ctx.moveTo(lx - tw * 0.6, lampY - ht * 0.04);
        ctx.lineTo(lx, lampY - ht * 0.12);
        ctx.lineTo(lx + tw * 0.6, lampY - ht * 0.04);
        ctx.closePath();
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.stroke();
      }

      /* Sun / lamp reflections ---------------------------------------- */
      const reflect = (cx: number, width: number, alpha: number) => {
        const rr = mulberry(frame * 13 + Math.round(cx));
        for (let k = 0; k < 22; k++) {
          const d = k / 22;
          const y = H0 + 5 + Math.pow(d, 1.25) * (h - H0) * 0.9;
          const half = width * (0.35 + d * 0.9) * (0.4 + rr() * 0.6);
          const off = (rr() - 0.5) * width * 0.5;
          ctx.strokeStyle = `rgba(${colors.gold},${alpha * (1 - d * 0.75)})`;
          ctx.lineWidth = 1 + d * 1.4;
          ctx.beginPath();
          ctx.moveTo(cx + off - half, y);
          ctx.lineTo(cx + off + half, y);
          ctx.stroke();
        }
      };
      if (sun) reflect(w * (w < 768 ? 0.74 : 0.7), Math.max(34, Math.min(w, h) * 0.085) * 0.9, 0.55);
      if (lighthouse) reflect(lampX, 26, 0.5);

      /* Waves ------------------------------------------------------- */
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const y0 = H0 + 6 + line.p * (h - H0 - 6) * 1.02;
        const jit = mulberry(frame * 97 + i * 13)();
        const jAmp = 0.35 + line.p * 0.9;
        const alpha = mode === "day" ? 0.16 + line.p * 0.62 : 0.1 + line.p * 0.5;
        ctx.strokeStyle = `rgba(${colors.ink},${alpha})`;
        ctx.lineWidth = (0.55 + line.p * 1.35) * (w < 768 ? 0.85 : 1);
        for (const [x0, x1] of line.segs) {
          const drift = T * (6 + line.p * 18);
          ctx.beginPath();
          for (let x = x0; x <= x1; x += 5) {
            const xs = x;
            const y = y0 + waveY(line, xs + drift, T, scale) + Math.sin(xs * 0.021 + jit * 12) * jAmp;
            if (x === x0) ctx.moveTo(xs, y);
            else ctx.lineTo(xs, y);
          }
          ctx.stroke();
        }
      }

      /* Paper boat ---------------------------------------------------- */
      if (boat) {
        const bs = Math.min(1.25, Math.max(0.72, w / 1300));
        const bx = w * (w < 768 ? 0.2 : 0.17) + Math.sin(T * 0.25) * 10 + prog * w * 0.3;
        const ref: Line = { p: 0.42, segs: [], phase: 1.3, speed: 0.6, wl: 360, amp: 7 };
        const by = H0 + 6 + 0.42 * (h - H0) + waveY(ref, bx, T, scale);
        const slope = (waveY(ref, bx + 6, T, scale) - waveY(ref, bx - 6, T, scale)) / 12;
        ctx.save();
        ctx.translate(bx, by - 4 * bs);
        ctx.rotate(Math.atan(slope) * 0.9);
        ctx.scale(bs, bs);
        const j = (mulberry(frame + 51)() - 0.5) * 0.6;

        // wake
        ctx.strokeStyle = `rgba(${colors.ink},0.45)`;
        ctx.lineWidth = 1;
        for (let k = 1; k <= 3; k++) {
          ctx.beginPath();
          ctx.moveTo(-30 - k * 12, 11 + k * 1.5);
          ctx.lineTo(-22 - k * 12 + 8, 11 + k * 1.5);
          ctx.stroke();
        }
        ctx.fillStyle = colors.paper;
        ctx.strokeStyle = `rgba(${colors.ink},0.92)`;
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        ctx.moveTo(-30, -2 + j);
        ctx.lineTo(-18, 10);
        ctx.lineTo(18, 10 + j);
        ctx.lineTo(30, -2);
        ctx.lineTo(9, -2);
        ctx.lineTo(0, -24 + j);
        ctx.lineTo(-9, -2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -24 + j);
        ctx.lineTo(0, -2);
        ctx.moveTo(-9, -2);
        ctx.lineTo(-18, 10);
        ctx.moveTo(9, -2);
        ctx.lineTo(18, 10);
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // mast + gold pennant
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(0, -38);
        ctx.stroke();
        const flap = Math.sin(T * 4) * 1.5;
        ctx.fillStyle = `rgba(${colors.gold},0.95)`;
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(13, -34.5 + flap);
        ctx.lineTo(0, -31);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    };

    const loop = (now: number) => {
      draw(now - start);
      raf = requestAnimationFrame(loop);
    };

    const setRunning = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setRunning(visible && !reduced && !document.hidden);
    });
    io.observe(canvas);
    const onVisibility = () => setRunning(visible && !reduced && !document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    return () => {
      setRunning(false);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mode, horizon, progress, reduced, boat, sun, birds, lighthouse, stars]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none block size-full", className)} />;
}
