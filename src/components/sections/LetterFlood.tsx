import envAirmail from "@/assets/letters/airmail.jpg";
import envAmericus from "@/assets/letters/americus.jpg";
import envCensored from "@/assets/letters/censored.jpg";
import envClare from "@/assets/letters/clare.jpg";
import envLeningrad from "@/assets/letters/leningrad.jpg";
import envMulready from "@/assets/letters/mulready.jpg";
import envPenn from "@/assets/letters/penn.jpg";
import envQuertant from "@/assets/letters/quertant.jpg";
import envReverse from "@/assets/letters/reverse.jpg";
import envTraylor from "@/assets/letters/traylor.jpg";
import envUs1925 from "@/assets/letters/us1925.jpg";
import envZeppelin from "@/assets/letters/zeppelin.jpg";
import stormSkyImg from "@/assets/storm-sky.jpg";
import { OwlPost } from "@/components/ui/OwlPost";
import { Stars } from "@/components/ui/Stars";
import { WaxStamp } from "@/components/ui/WaxStamp";
import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TESTIMONIALS } from "@/lib/content";
import { getHouse, type House } from "@/lib/houses";
import { easeCinematic } from "@/lib/motion";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Story = (typeof TESTIMONIALS)[number];
type THREE = typeof import("three");
const REAL = TESTIMONIALS.length;
const D2R = Math.PI / 180;

/* The swarm is one WebGL draw call — instanced letter planes textured
   from a canvas-painted atlas (mipmaps give far paper its softness),
   driven by a coherent wind field: a storm gyre + travelling density
   wave + gusts from scroll and lightning. DOM only keeps four invisible
   hit buttons, carrying the crisp HTML peek slips, and the catch overlay. */

function prand(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

type Face = "sealed" | "back" | "backTwine" | "front" | "sheet" | "far";

interface LetterConfig {
  sealed: boolean;
  story: number;
  face: Face;
  tumbler: boolean;
  lane: number;
  spd: number;
  steer: number;
  agil: number;
  rock: number;
  windK: number;
  zB: number;
  zA: number;
  zF: number;
  zP: number;
  scale: number;
  tint: number;
  dw: number;
  dh: number;
  seed: number;
  phase: number;
  freq: number;
}

interface SimLetter extends LetterConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  boost: number;
}

const SEALED_LANE = [0.63, 1.0, 1.27, 0.85] as const;
const FACE_SIZE: Record<Face, [number, number]> = {
  sealed: [132, 91],
  back: [110, 76],
  backTwine: [110, 76],
  front: [110, 76],
  sheet: [100, 139],
  far: [104, 72],
};

function buildLetters(compact: boolean): LetterConfig[] {
  const decoys = compact ? 40 : 78;
  const out: LetterConfig[] = [];
  TESTIMONIALS.forEach((_, i) => {
    const r = prand(4100 + i * 31);
    const [dw, dh] = FACE_SIZE.sealed;
    out.push({
      sealed: true,
      story: i,
      face: "sealed",
      tumbler: false,
      lane: SEALED_LANE[i % SEALED_LANE.length],
      spd: 0.8 + r * 0.22,
      steer: 0.14,
      agil: 1,
      rock: 6,
      windK: 0.5 + r * 0.3,
      zB: 120 + r * 50,
      zA: 30,
      zF: 0.21 + r * 0.12,
      zP: r * 6.28,
      scale: 1.05 + r * 0.07,
      tint: 1.02,
      dw,
      dh,
      seed: 900 + i * 7,
      phase: r * Math.PI * 2,
      freq: 0.7 + r * 0.4,
    });
  });
  for (let i = 0; i < decoys; i++) {
    const idx = REAL + i;
    const r1 = prand(idx * 7 + 3);
    const r2 = prand(idx * 13 + 11);
    const r3 = prand(idx * 29 + 5);
    const r4 = prand(idx * 41 + 17);
    const zB = -560 + r1 * 620;
    const depthT = (zB + 560) / 620;
    const face: Face =
      zB < -230
        ? "far"
        : r2 < 0.4
          ? "back"
          : r2 < 0.58
            ? "backTwine"
            : r2 < 0.82
              ? "front"
              : "sheet";
    const [dw, dh] = FACE_SIZE[face];
    out.push({
      sealed: false,
      story: -1,
      face,
      tumbler: face !== "far" && r3 > 0.88,
      lane: 0.3 + r2 * 1.0,
      spd: 0.65 + r3 * 1.15,
      steer: 0.11 + r3 * 0.05,
      agil: 0.6 + r2 * 0.8,
      rock: 8 + r3 * 12,
      windK: 0.7 + r2 * 0.9,
      zB,
      zA: 26 + r2 * 55,
      zF: 0.16 + r3 * 0.2,
      zP: r4 * 6.28,
      scale: 0.55 + r2 * 0.55,
      tint: 0.74 + depthT * 0.3,
      dw,
      dh,
      seed: idx,
      phase: r2 * Math.PI * 2,
      freq: 0.7 + r2 * 0.9,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* The atlas — real postal scans composited into one 2048² texture.     */
/* Covers are public-domain scans (Wikimedia Commons): 1840s–1930s      */
/* registered mail, airmail, hotel post — genuine paper, ink, wax era.  */
/* ------------------------------------------------------------------ */

const ATLAS = 2048;
const CELL_W = 512;
const CELL_H = 352;
const SHEET_W = 250;
const SHEET_H = 348;

const SEALED_IMGS = [envAirmail, envZeppelin, envCensored, envQuertant];
const FRONT_IMGS = [
  envAmericus,
  envPenn,
  envTraylor,
  envUs1925,
  envClare,
  envMulready,
  envLeningrad,
];

/* cell origins */
const CELLS = {
  sealed: [0, 512, 1024, 1536].map((x) => ({ x, y: 0 })),
  cracked: [0, 512, 1024, 1536].map((x) => ({ x, y: 352 })),
  back: { x: 0, y: 704 },
  backTwine: { x: 512, y: 704 },
  fronts: [
    { x: 1024, y: 704 },
    { x: 1536, y: 704 },
    { x: 0, y: 1056 },
    { x: 512, y: 1056 },
    { x: 1024, y: 1056 },
    { x: 1536, y: 1056 },
    { x: 0, y: 1408 },
  ],
  far: { x: 512, y: 1408 },
  sheet: { x: 1024, y: 1408 },
  sheet2: { x: 1536, y: 1408 },
} as const;

const loadImg = (u: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = u;
  });

async function paintAtlas(): Promise<HTMLCanvasElement> {
  const [sealedImgs, frontImgs, reverseImg] = await Promise.all([
    Promise.all(SEALED_IMGS.map(loadImg)),
    Promise.all(FRONT_IMGS.map(loadImg)),
    loadImg(envReverse),
  ]);
  const c = document.createElement("canvas");
  c.width = ATLAS;
  c.height = ATLAS;
  const g = c.getContext("2d")!;

  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  };

  /* warm paper mottle — soft age blotches (for painted sheets) */
  const mottle = (x: number, y: number, w: number, h: number, seed: number) => {
    for (let i = 0; i < 6; i++) {
      const px = x + prand(seed + i * 7) * w;
      const py = y + prand(seed + i * 13) * h;
      const r = 14 + prand(seed + i * 29) * 30;
      const gr = g.createRadialGradient(px, py, 0, px, py, r);
      gr.addColorStop(0, `rgba(140,118,70,${(0.04 + prand(seed + i * 41) * 0.05).toFixed(3)})`);
      gr.addColorStop(1, "rgba(140,118,70,0)");
      g.fillStyle = gr;
      g.beginPath();
      g.arc(px, py, r, 0, 7);
      g.fill();
    }
  };

  /* a real cover composited into a cell — cut-paper rim so the quad
     edge reads as physical paper */
  const photoCell = (img: HTMLImageElement, cell: { x: number; y: number }, flip = false) => {
    g.save();
    g.translate(cell.x, cell.y);
    if (flip) {
      g.translate(CELL_W, 0);
      g.scale(-1, 1);
    }
    g.drawImage(img, 0, 0, CELL_W, CELL_H);
    g.strokeStyle = "rgba(15,10,5,0.45)";
    g.lineWidth = 4;
    g.strokeRect(2, 2, CELL_W - 4, CELL_H - 4);
    g.strokeStyle = "rgba(255,250,235,0.16)";
    g.lineWidth = 2;
    g.strokeRect(5, 5, CELL_W - 10, CELL_H - 10);
    g.restore();
  };

  const twine = (x: number, y: number, w: number, h: number) => {
    g.fillStyle = "rgba(96,68,38,0.5)";
    g.fillRect(x, y + h * 0.52, w, 9);
    g.fillRect(x + w * 0.485, y + h * 0.52, 9, h * 0.48);
    g.fillStyle = "rgba(255,235,200,0.22)";
    g.fillRect(x, y + h * 0.52, w, 2.4);
    g.fillRect(x + w * 0.485, y + h * 0.52, 2.4, h * 0.48);
  };

  /* the wax blob — irregular edge, lit from the moon's side */
  const waxBlob = (sx: number, sy: number, house: House, seed: number) => {
    const R = 50;
    const blob = () => {
      g.beginPath();
      for (let k = 0; k <= 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        const r = R * (0.9 + 0.13 * Math.sin(k * 2.9 + seed) + 0.05 * prand(seed * 7 + k));
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (k) g.lineTo(px, py);
        else g.moveTo(px, py);
      }
      g.closePath();
    };
    g.save();
    g.translate(sx + 5, sy + 9);
    blob();
    g.fillStyle = "rgba(3,6,15,0.35)";
    g.fill();
    g.restore();
    g.save();
    g.translate(sx, sy);
    blob();
    const sg = g.createRadialGradient(-13, -15, 4, 0, 0, R * 1.25);
    sg.addColorStop(0, "rgba(255,255,255,0.55)");
    sg.addColorStop(0.28, house.hex);
    sg.addColorStop(1, house.ink);
    g.fillStyle = sg;
    g.fill();
    g.strokeStyle = "rgba(0,0,0,0.3)";
    g.lineWidth = 3;
    g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.32)";
    g.lineWidth = 3.4;
    g.beginPath();
    g.arc(0, 0, R * 0.66, 0, 7);
    g.stroke();
    g.font = "600 37px Georgia, serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "rgba(255,255,255,0.5)";
    g.fillText("E", 0, 2);
    g.restore();
  };

  /* the same wax, split along a jagged line — for letters already read */
  const waxCracked = (sx: number, sy: number, house: House, seed: number) => {
    const jag = (side: -1 | 1) => {
      g.beginPath();
      g.moveTo(0, -55);
      g.lineTo(6 * side, -21);
      g.lineTo(-8 * side, 0);
      g.lineTo(8 * side, 25);
      g.lineTo(0, 55);
      g.lineTo(60 * side, 55);
      g.lineTo(60 * side, -55);
      g.closePath();
    };
    g.save();
    g.translate(sx, sy);
    for (const side of [-1, 1] as const) {
      g.save();
      jag(side);
      g.clip();
      g.translate(side * 7, 3.4);
      g.rotate(side * 0.09);
      const R = 50;
      g.beginPath();
      for (let k = 0; k <= 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        const r = R * (0.9 + 0.13 * Math.sin(k * 2.9 + seed) + 0.05 * prand(seed * 7 + k));
        if (k) g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        else g.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      g.closePath();
      const sg = g.createRadialGradient(-13, -15, 4, 0, 0, R * 1.25);
      sg.addColorStop(0, "rgba(255,255,255,0.5)");
      sg.addColorStop(0.28, house.hex);
      sg.addColorStop(1, house.ink);
      g.fillStyle = sg;
      g.fill();
      g.strokeStyle = "rgba(255,255,255,0.28)";
      g.lineWidth = 3.4;
      g.beginPath();
      g.arc(0, 0, R * 0.66, 0, 7);
      g.stroke();
      g.restore();
    }
    /* the crack itself */
    g.strokeStyle = "rgba(10,6,4,0.5)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(0, -52);
    g.lineTo(6, -21);
    g.lineTo(-8, 0);
    g.lineTo(8, 25);
    g.lineTo(0, 52);
    g.stroke();
    g.restore();
  };

  /* --- paint the cells ------------------------------------------------ */
  const SEAL_X = CELL_W * 0.5;
  const SEAL_Y = CELL_H * 0.58;

  TESTIMONIALS.forEach((story, i) => {
    const house = getHouse(story.houseId);
    photoCell(sealedImgs[i], CELLS.sealed[i]);
    g.save();
    g.translate(CELLS.sealed[i].x, CELLS.sealed[i].y);
    twine(0, 0, CELL_W, CELL_H);
    waxBlob(SEAL_X, SEAL_Y, house, 900 + i);
    g.restore();

    photoCell(sealedImgs[i], CELLS.cracked[i]);
    g.save();
    g.translate(CELLS.cracked[i].x, CELLS.cracked[i].y);
    twine(0, 0, CELL_W, CELL_H);
    waxCracked(SEAL_X, SEAL_Y, house, 900 + i);
    g.restore();
  });

  /* the reverse scan is dark — lift it toward the warm paper range */
  g.save();
  g.filter = "brightness(1.28) sepia(0.12)";
  photoCell(reverseImg, CELLS.back);
  photoCell(reverseImg, CELLS.backTwine, true);
  g.restore();
  g.save();
  g.translate(CELLS.backTwine.x, CELLS.backTwine.y);
  twine(0, 0, CELL_W, CELL_H);
  g.restore();

  frontImgs.forEach((img, i) => photoCell(img, CELLS.fronts[i]));

  /* far silhouette — a cover blurred + dimmed into the dark */
  g.save();
  g.translate(CELLS.far.x, CELLS.far.y);
  g.filter = "blur(3px)";
  g.drawImage(frontImgs[4], 0, 0, CELL_W, CELL_H);
  g.filter = "none";
  g.fillStyle = "rgba(10,19,34,0.22)";
  g.fillRect(0, 0, CELL_W, CELL_H);
  g.restore();

  /* loose ruled sheets — painted paper (they live inside envelopes) */
  const paintSheet = (cx: number, cy: number, seed: number) => {
    g.save();
    g.translate(cx, cy);
    g.scale(SHEET_W / 184, SHEET_H / 256);
    g.fillStyle = "rgba(3,6,15,0.4)";
    rr(12, 14, 168, 240, 6);
    g.fill();
    const sg = g.createLinearGradient(8, 8, 96, 248);
    sg.addColorStop(0, "#f8f1de");
    sg.addColorStop(1, "#ecdfb8");
    rr(8, 8, 168, 240, 6);
    g.fillStyle = sg;
    g.fill();
    g.strokeStyle = "rgba(42,33,19,0.18)";
    g.lineWidth = 1.2;
    g.stroke();
    mottle(8, 8, 168, 240, seed);
    g.strokeStyle = "rgba(28,74,54,0.2)";
    g.lineWidth = 1.4;
    for (let ry = 34; ry < 232; ry += 15) {
      g.beginPath();
      g.moveTo(28, ry);
      g.lineTo(160, ry);
      g.stroke();
    }
    g.strokeStyle = "rgba(179,56,40,0.35)";
    g.beginPath();
    g.moveTo(28, 12);
    g.lineTo(28, 244);
    g.stroke();
    /* a signature scrawled at the foot */
    g.strokeStyle = "rgba(57,70,107,0.55)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(96, 224);
    g.quadraticCurveTo(112, 214, 124, 224);
    g.quadraticCurveTo(136, 232, 152, 220);
    g.stroke();
    /* dog-ear */
    g.fillStyle = "#dcc99a";
    g.beginPath();
    g.moveTo(152, 8);
    g.lineTo(176, 8);
    g.lineTo(176, 32);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(42,33,19,0.2)";
    g.beginPath();
    g.moveTo(152, 8);
    g.lineTo(176, 32);
    g.stroke();
    g.restore();
  };
  paintSheet(CELLS.sheet.x, CELLS.sheet.y, 41);
  paintSheet(CELLS.sheet2.x, CELLS.sheet2.y, 83);

  return c;
}

/* uv rect (v flipped for canvas-space rows) */
function uvRect(x: number, y: number, w: number, h: number): [number, number, number, number] {
  return [x / ATLAS, 1 - (y + h) / ATLAS, w / ATLAS, h / ATLAS];
}

function cellFor(cfg: LetterConfig, cracked: boolean): [number, number, number, number] {
  switch (cfg.face) {
    case "sealed": {
      const cell = (cracked ? CELLS.cracked : CELLS.sealed)[cfg.story];
      return uvRect(cell.x, cell.y, CELL_W, CELL_H);
    }
    case "back":
      return uvRect(CELLS.back.x, CELLS.back.y, CELL_W, CELL_H);
    case "backTwine":
      return uvRect(CELLS.backTwine.x, CELLS.backTwine.y, CELL_W, CELL_H);
    case "front": {
      const cell = CELLS.fronts[cfg.seed % CELLS.fronts.length];
      return uvRect(cell.x, cell.y, CELL_W, CELL_H);
    }
    case "sheet": {
      const cell = cfg.seed % 2 ? CELLS.sheet : CELLS.sheet2;
      return uvRect(cell.x, cell.y, SHEET_W, SHEET_H);
    }
    case "far":
      return uvRect(CELLS.far.x, CELLS.far.y, CELL_W, CELL_H);
  }
}

/* ------------------------------------------------------------------ */
/* The sky — storm night over the school's towers: moon, cloud banks,    */
/* rain, lightning. The swarm flies in this weather.                     */
/* ------------------------------------------------------------------ */

function boltPolyline(): string {
  const pts: string[] = [];
  let x = 50;
  let y = -4;
  const segs = 6 + Math.floor(Math.random() * 3);
  for (let i = 0; i <= segs; i++) {
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    y += 68 / segs;
    x += (Math.random() - 0.5) * 42;
  }
  return pts.join(" ");
}

function Towers() {
  const cren = (x: number, y: number, w: number) =>
    [0, 1, 2, 3].map((i) => (
      <rect key={i} x={x + i * (w / 3.2)} y={y} width={w / 6} height={7} />
    ));
  return (
    <svg
      className="xc-flood-towers"
      viewBox="0 0 1440 170"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <g fill="#040814">
        <rect x="0" y="138" width="1440" height="32" />
        <rect x="88" y="88" width="58" height="58" />
        <polygon points="84,88 117,36 150,88" />
        <rect x="113" y="26" width="8" height="14" />
        <rect x="270" y="104" width="64" height="42" />
        {cren(270, 97, 64)}
        <rect x="392" y="118" width="42" height="28" />
        {cren(392, 112, 42)}
        <rect x="600" y="66" width="124" height="80" />
        <polygon points="592,66 662,4 732,66" />
        <rect x="658" y="0" width="8" height="10" />
        {cren(600, 60, 124)}
        <rect x="884" y="98" width="118" height="48" />
        <path d="M884 98 Q943 40 1002 98 Z" />
        <rect x="939" y="34" width="8" height="12" />
        <rect x="1120" y="94" width="52" height="52" />
        <polygon points="1116,94 1146,50 1176,94" />
        <rect x="1250" y="112" width="46" height="34" />
        {cren(1250, 106, 46)}
        <rect x="1360" y="120" width="40" height="26" />
      </g>
      <g fill="#ffcf7d">
        <rect x="104" y="104" width="5" height="8" rx="1" opacity="0.85" />
        <rect x="126" y="104" width="5" height="8" rx="1" opacity="0.45" />
        <rect x="640" y="88" width="6" height="9" rx="1" opacity="0.9" />
        <rect x="674" y="106" width="6" height="9" rx="1" opacity="0.55" />
        <rect x="920" y="116" width="5" height="8" rx="1" opacity="0.7" />
        <rect x="1140" y="110" width="5" height="8" rx="1" opacity="0.8" />
      </g>
    </svg>
  );
}

interface Bolt {
  k: number;
  x: number;
  pts: string;
}

function Sky({ bolt }: { bolt: Bolt | null }) {
  return (
    <>
      <img src={stormSkyImg} className="xc-flood-skyimg" alt="" aria-hidden="true" />
      <div className="xc-flood-sky" aria-hidden="true" />
      <Stars count={22} />
      <span className="xc-flood-rain" aria-hidden="true" />
      <span className="xc-flood-rain r2" aria-hidden="true" />
      <Towers />
      {bolt && (
        <div key={bolt.k} aria-hidden="true">
          <span className="xc-flood-flash" />
          <svg
            className="xc-flood-bolt"
            style={{ left: `${bolt.x}%` }}
            viewBox="0 0 100 64"
            preserveAspectRatio="none"
          >
            <polyline
              points={bolt.pts}
              fill="none"
              stroke="#c9b8ff"
              strokeOpacity="0.55"
              strokeWidth="6"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <polyline
              points={bolt.pts}
              fill="none"
              stroke="#f4f0ff"
              strokeWidth="2.2"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared defs + drawn envelope for the caught (DOM) letter             */
/* ------------------------------------------------------------------ */

function EnvDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        {(["aurelion", "veridian", "noctis", "amberfell"] as const).map((id) => {
          const h = getHouse(id);
          return (
            <radialGradient key={id} id={`seal-${id}`} cx="0.38" cy="0.34" r="0.9">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="0.25" stopColor={h.hex} />
              <stop offset="1" stopColor={h.ink} />
            </radialGradient>
          );
        })}
        <clipPath id="sealL">
          <path d="M60 26 L56 33 L63 40 L55 47 L60 54 L44 54 L44 26 Z" />
        </clipPath>
        <clipPath id="sealR">
          <path d="M60 26 L56 33 L63 40 L55 47 L60 54 L76 54 L76 26 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function SealWax({ house }: { house: House }) {
  const half = (clip: string) => (
    <g clipPath={`url(#${clip})`}>
      <path
        d="M60 30 c6.5 -1.8 12.4 2.4 12 9 c0.6 6.8 -4.4 12 -11.4 11.6 c-7 0.6 -12.8 -4 -12.4 -10.8 c-0.6 -6.4 5 -10.6 11.8 -9.8 Z"
        fill={`url(#seal-${house.id})`}
      />
      <path
        d="M60 30 c6.5 -1.8 12.4 2.4 12 9 c0.6 6.8 -4.4 12 -11.4 11.6 c-7 0.6 -12.8 -4 -12.4 -10.8 c-0.6 -6.4 5 -10.6 11.8 -9.8 Z"
        fill="none"
        stroke="#000"
        strokeOpacity="0.28"
      />
      <circle cx="60" cy="40.4" r="7.4" fill="none" stroke="#fff" strokeOpacity="0.3" />
    </g>
  );
  return (
    <g className="xc-seal-g">
      <g className="xc-seal-l">{half("sealL")}</g>
      <g className="xc-seal-r">{half("sealR")}</g>
      <text
        x="60"
        y="44.2"
        textAnchor="middle"
        fontSize="9.5"
        fill="#fff"
        fillOpacity="0.5"
        fontFamily="Georgia, serif"
      >
        E
      </text>
    </g>
  );
}

/* The caught envelope — the same real cover, hero size, twine + wax on top. */
function BigEnvelope({ img, house }: { img: string; house: House }) {
  return (
    <div className="xc-bigenv-img">
      <img src={img} alt="" draggable={false} />
      <svg viewBox="0 0 120 78" className="xc-bigenv-ov" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="40" width="120" height="2.4" fill="#6d4f2c" opacity="0.48" />
        <rect x="58.2" y="40" width="2.4" height="38" fill="#6d4f2c" opacity="0.48" />
        <rect x="0" y="40.4" width="120" height="0.7" fill="#ffedc8" opacity="0.22" />
        <g transform="translate(0 6)">
          <SealWax house={house} />
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The letter sheet — shared by the opened overlay and the static page  */
/* ------------------------------------------------------------------ */

function LetterSheet({
  story,
  animate,
  className = "",
}: {
  story: Story;
  animate: boolean;
  className?: string;
}) {
  const house = getHouse(story.houseId);
  const ease = easeCinematic;
  return (
    <article className={`xc-flood-sheet window-lift px-6 py-6 sm:px-9 sm:py-8 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[0.62rem] font-medium tracking-[0.14em] text-moss uppercase">
          Expecto · Owl post
        </p>
        <span
          aria-hidden="true"
          className="grid size-11 -rotate-12 place-items-center rounded-full border border-dashed text-center text-[0.42rem] leading-[1.15] font-semibold tracking-[0.1em] uppercase"
          style={{ borderColor: house.ink, color: house.ink }}
        >
          Owl
          <br />
          post
        </span>
      </div>
      <motion.blockquote
        initial={animate ? { opacity: 0, y: 22 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease }}
        className="font-display mt-5 text-[1.45rem] leading-[1.22] font-medium tracking-[-0.01em] text-forest-deep sm:text-[1.9rem]"
      >
        <span style={{ color: house.hex }}>“</span>
        {story.quote}”
      </motion.blockquote>
      <motion.div
        initial={animate ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5, ease }}
        className="mt-7"
      >
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted line-through tabular-nums">{story.before}</span>
          <span className="text-3xl font-semibold text-forest-deep tabular-nums sm:text-4xl">
            {story.after}
          </span>
        </div>
        <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-forest/10">
          <motion.span
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
            style={{ backgroundColor: house.hex }}
            initial={animate ? { scaleX: story.before / 1600 } : false}
            animate={{ scaleX: story.after / 1600 }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.66rem] tracking-[0.08em] text-muted uppercase">
          <span>Diagnostic</span>
          <span>Official score</span>
        </div>
      </motion.div>
      <motion.div
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mt-6 flex items-end justify-between gap-4"
      >
        <p className="text-[0.78rem] text-muted">
          <span className="font-medium text-forest-deep">{story.name}</span> · {story.city} ·{" "}
          {story.school} — <span className="font-medium text-forest-deep">{story.award}</span>
        </p>
        <WaxStamp house={house} className="size-12 shrink-0 -rotate-6 drop-shadow-md" />
      </motion.div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Opened letter — caught envelope flies to center, opens, unfolds      */
/* ------------------------------------------------------------------ */

interface OpenedState {
  story: number;
  img: string;
  ox: number;
  oy: number;
  orot: number;
  oscale: number;
  tx: number;
  ty: number;
}

function OpenedLetter({ opened, onClose }: { opened: OpenedState; onClose: () => void }) {
  const story = TESTIMONIALS[opened.story];
  const house = getHouse(story.houseId);
  const [phase, setPhase] = useState<"fly" | "open">("fly");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (phase === "open") closeRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Letter from ${story.name}`}
      className="pointer-events-none absolute inset-0 z-[80]"
    >
      <motion.span
        className="xc-flood-bleed"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "open" ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className={`xc-flood-env is-sealed xc-flood-bigenv absolute top-0 left-0 ${phase === "open" ? "is-open" : ""}`}
        initial={{ x: opened.ox, y: opened.oy, rotate: opened.orot, scale: opened.oscale }}
        animate={
          phase === "fly"
            ? { x: opened.tx, y: opened.ty, rotate: -3, scale: 2.6 }
            : { x: opened.tx + 52, y: opened.ty + 210, rotate: 9, scale: 2, opacity: 0 }
        }
        transition={
          phase === "fly"
            ? { type: "spring", stiffness: 120, damping: 17 }
            : { duration: 0.55, ease: easeCinematic, delay: 0.3 }
        }
        onAnimationComplete={() => {
          if (phase === "fly") setPhase("open");
        }}
        aria-hidden="true"
      >
        <BigEnvelope img={opened.img} house={house} />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 grid place-items-center px-4"
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="pointer-events-auto w-[min(560px,92vw)]"
          initial={{ opacity: 0, scale: 0.4, y: 70, rotateY: -22, rotate: -2 }}
          animate={
            phase === "open" ? { opacity: 1, scale: 1, y: 0, rotateY: 0, rotate: -0.6 } : {}
          }
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{
            type: "spring",
            stiffness: 130,
            damping: 18,
            delay: phase === "open" ? 0.3 : 0,
          }}
        >
          <LetterSheet story={story} animate />
        </motion.div>
      </div>

      <motion.button
        ref={closeRef}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "open" ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto absolute top-20 right-5 grid size-10 place-items-center rounded-full border border-cream/25 bg-cream/10 text-cream backdrop-blur-sm transition-colors hover:bg-cream/20 md:top-24 md:right-8"
        aria-label="Put the letter back"
      >
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
          <path
            d="M3 3 L13 13 M13 3 L3 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The flood                                                           */
/* ------------------------------------------------------------------ */

function quotePeek(story: Story): string {
  return story.quote.split(" ").slice(0, 5).join(" ") + "…";
}

function Flood() {
  const compact = useCompactLayout();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configs = useMemo(() => buildLetters(compact), [compact]);
  const hitRef = useRef<Array<HTMLButtonElement | null>>([]);
  const simsRef = useRef<SimLetter[]>([]);
  const heldRef = useRef(-1);
  const burstRef = useRef<{ x: number; y: number } | null>(null);
  const gustRef = useRef({ x: 0, y: 0 });
  const boltRef = useRef<Bolt | null>(null);
  const crackRef = useRef<ReadonlySet<number>>(new Set());
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const lastBtnRef = useRef<HTMLElement | null>(null);
  const [opened, setOpened] = useState<OpenedState | null>(null);
  const [found, setFound] = useState<ReadonlySet<number>>(new Set());
  const [bolt, setBolt] = useState<Bolt | null>(null);
  const [glFailed, setGlFailed] = useState(false);
  useEffect(() => {
    boltRef.current = bolt;
  }, [bolt]);
  useEffect(() => {
    crackRef.current = found;
  }, [found]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.94) setOpened(null);
  });

  /* Lightning — strikes every 6–15s; each bolt kicks the wind. */
  useEffect(() => {
    let alive = true;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const strike = () => {
      if (!alive) return;
      setBolt({ k: Date.now(), x: 10 + Math.random() * 76, pts: boltPolyline() });
      gustRef.current.x += (Math.random() - 0.35) * 4.2;
      gustRef.current.y += 1.2 + Math.random() * 3;
      t2 = setTimeout(() => {
        if (alive) setBolt(null);
      }, 800);
      t1 = setTimeout(strike, 6000 + Math.random() * 9000);
    };
    t1 = setTimeout(strike, 3200);
    return () => {
      alive = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* The WebGL swarm — three.js loads with the section, the sim owns
     matrices; the four DOM hit buttons ride the sealed letters. */
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!stage || !canvas || !section) return;
    let disposed = false;
    let teardown: (() => void) | undefined;

    (async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* font fallback still paints */
      }
      const THREE = await import("three");
      if (disposed) return;
      try {
        teardown = await startStorm(THREE);
      } catch {
        if (!disposed) setGlFailed(true);
      }
    })();

    async function startStorm(T: THREE) {
      const atlas = await paintAtlas();
      if (disposed) return;
      const renderer = new T.WebGLRenderer({
        canvas: canvas!,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      if (!renderer.getContext()) throw new Error("no webgl");
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(50, 1, 10, 4000);

      const tex = new T.CanvasTexture(atlas);
      tex.colorSpace = T.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.minFilter = T.LinearMipmapLinearFilter;
      tex.magFilter = T.LinearFilter;
      tex.generateMipmaps = true;

      const N = configs.length;
      const geo = new T.PlaneGeometry(1, 1);
      const uvArr = new Float32Array(N * 4);
      const tintArr = new Float32Array(N);
      const phaseArr = new Float32Array(N);
      configs.forEach((cfg, i) => {
        const [u, v, w, h] = cellFor(cfg, crackRef.current.has(cfg.story));
        uvArr.set([u, v, w, h], i * 4);
        tintArr[i] = cfg.tint;
        phaseArr[i] = cfg.phase * 7;
      });
      const uvAttr = new T.InstancedBufferAttribute(uvArr, 4);
      uvAttr.setUsage(T.DynamicDrawUsage);
      geo.setAttribute("aUV", uvAttr);
      geo.setAttribute("aTint", new T.InstancedBufferAttribute(tintArr, 1));
      geo.setAttribute("aPhase", new T.InstancedBufferAttribute(phaseArr, 1));

      const mat = new T.ShaderMaterial({
        uniforms: {
          uMap: { value: tex },
          uFog: { value: new T.Color("#0a1322") },
          uFlash: { value: 0 },
          uTime: { value: 0 },
          uFogNear: { value: 1000 },
          uFogFar: { value: 1560 },
        },
        vertexShader: /* glsl */ `
          attribute vec4 aUV;
          attribute float aTint;
          attribute float aPhase;
          uniform float uTime;
          uniform float uFogNear;
          uniform float uFogFar;
          varying vec2 vUv;
          varying float vLight;
          varying float vFog;
          void main() {
            vUv = vec2(aUV.x + uv.x * aUV.z, aUV.y + uv.y * aUV.w);
            vLight = aTint * (1.0 + 0.05 * sin(uTime * 1.9 + aPhase));
            vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
            vFog = smoothstep(uFogNear, uFogFar, -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D uMap;
          uniform vec3 uFog;
          uniform float uFlash;
          varying vec2 vUv;
          varying float vLight;
          varying float vFog;
          void main() {
            vec4 c = texture2D(uMap, vUv);
            if (c.a < 0.45) discard;
            c.rgb *= vLight;
            c.rgb = mix(c.rgb, c.rgb * 1.38 + vec3(0.07, 0.08, 0.14), uFlash);
            c.rgb = mix(c.rgb, uFog, vFog * 0.68);
            gl_FragColor = vec4(c.rgb, 1.0);
          }
        `,
        side: T.DoubleSide,
      });

      const mesh = new T.InstancedMesh(geo, mat, N);
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
      mesh.frustumCulled = false;
      scene.add(mesh);

      /* --- sim state -------------------------------------------------- */
      const sims: SimLetter[] = configs.map((c) => ({
        ...c,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rot: (prand(Math.round(c.phase * 1000)) - 0.5) * 40,
        spin: (prand(c.seed * 3 + 1) - 0.5) * 5,
        boost: 1,
      }));
      simsRef.current = sims;
      let W = stage!.clientWidth;
      let H = stage!.clientHeight;
      const cy0 = H * 0.46;
      sims.forEach((s, i) => {
        const bandY = cy0 + (s.lane - 0.78) * H * 0.55;
        if (s.sealed) {
          s.x = W * (0.12 + i * 0.22);
          s.y = bandY - s.dh / 2;
          return;
        }
        /* staggered upwind entry — the post streams in from the west */
        s.x = -160 - prand(i * 91) * 2200;
        s.y = bandY + (prand(i * 57) - 0.5) * 90 - s.dh / 2;
        s.vx = 3 + prand(i * 33) * 3;
        s.vy = (prand(i * 17) - 0.5) * 4;
      });

      const m4 = new T.Matrix4();
      const pos = new T.Vector3();
      const scl = new T.Vector3();
      const qH = new T.Quaternion();
      const qX = new T.Quaternion();
      const qY = new T.Quaternion();
      const XA = new T.Vector3(1, 0, 0);
      const YA = new T.Vector3(0, 1, 0);
      const ZA = new T.Vector3(0, 0, 1);
      const HID = new T.Matrix4().makeScale(0, 0, 0);

      let raf = 0;
      let running = false;
      let last = performance.now();
      let lastScroll = window.scrollY;
      let swayX = 0;
      let swayRot = 0;
      let nextGust = 4;
      let lastFound = -1;

      const paint = (now: number) => {
        if (!running) return;
        raf = requestAnimationFrame(paint);
        const dt = Math.min(2.4, Math.max(0.4, (now - last) / 16.667));
        last = now;
        if (document.hidden || section!.getAttribute("data-scene-visible") === "false") return;

        const nw = stage!.clientWidth;
        const nh = stage!.clientHeight;
        if (nw !== W || nh !== H) {
          W = nw;
          H = nh;
          renderer.setSize(W, H, false);
          camera.aspect = W / H;
          camera.position.z = H / 2 / Math.tan(25 * D2R);
          camera.updateProjectionMatrix();
          mat.uniforms.uFogNear.value = camera.position.z - 60;
          mat.uniforms.uFogFar.value = camera.position.z + 560;
        }
        const cy = H * 0.46;
        const t = now * 0.001;
        mat.uniforms.uTime.value = t;

        /* lightning lifts the paper */
        const b = boltRef.current;
        if (b) {
          const age = now - b.k;
          mat.uniforms.uFlash.value =
            age < 800 ? (1 - age / 800) * (0.3 + 0.12 * Math.abs(Math.sin(age * 0.02))) : 0;
        } else if (mat.uniforms.uFlash.value !== 0) {
          mat.uniforms.uFlash.value = 0;
        }

        /* a letter just read → swap its cell for the cracked seal */
        if (crackRef.current.size !== lastFound) {
          lastFound = crackRef.current.size;
          sims.forEach((s, i) => {
            if (s.sealed && crackRef.current.has(s.story)) {
              const [u, v, w, h] = cellFor(s, true);
              uvAttr.setXYZW(i, u, v, w, h);
            }
          });
          uvAttr.needsUpdate = true;
        }

        const g = gustRef.current;

        /* scroll = wind — clamped so nav jumps don't slam the storm */
        const sy = window.scrollY;
        const ds = Math.max(-70, Math.min(70, sy - lastScroll));
        g.y += ds * 0.14;
        g.x += ds * 0.05 * (Math.random() < 0.5 ? -1 : 1);
        lastScroll = sy;

        /* ambient squalls */
        if (t > nextGust) {
          nextGust = t + 6 + Math.random() * 8;
          g.x += (Math.random() - 0.4) * 4.4;
          g.y += (Math.random() - 0.5) * 3.2;
        }
        const gx = g.x + Math.sin(t * 0.21) * 1.1 + Math.sin(t * 0.083 + 2) * 0.8;
        const gy = g.y + Math.cos(t * 0.17) * 0.8;
        g.x *= 0.985;
        g.y *= 0.982;

        /* a catch detonates the swirl — one shockwave, consumed once */
        const burst = burstRef.current;
        if (burst) {
          burstRef.current = null;
          for (const o of sims) {
            const dx = o.x - burst.x;
            const dy = o.y - burst.y;
            const d = Math.hypot(dx, dy) + 1;
            const f = Math.max(0, 1 - d / 720) * 20;
            o.vx += (dx / d) * f;
            o.vy += (dy / d) * f - 3;
            o.spin += (prand(Math.round(o.phase * 999)) - 0.5) * 8;
          }
        }

        /* camera sway — the sky leans a few degrees toward the hand */
        const p = pointerRef.current;
        const swayT = p.active ? (p.x / W - 0.5) * 2 : 0;
        const swayY = p.active ? (p.y / H - 0.5) * 2 : 0;
        swayX += (swayY * 3 - swayX) * 0.05;
        swayRot += (swayT * 4 - swayRot) * 0.05;
        camera.position.x = swayRot * 5;
        camera.position.y = -swayX * 3.4;
        camera.lookAt(0, 0, 0);

        for (let i = 0; i < sims.length; i++) {
          const s = sims[i];
          if (i === heldRef.current) {
            mesh.setMatrixAt(i, HID);
            continue;
          }

          /* --- the wind field: storm currents streaming left→right ----
             Meandering streamlines bend the whole flock into shared
             S-curves; each letter keeps to its own wind band; shear
             makes mid-stream faster than the edges. */
          const laneY = cy + (s.lane - 0.78) * H * 0.55;
          const meander =
            Math.sin(s.x * 0.0016 + t * 0.33 + s.lane * 4.0) * 0.5 +
            Math.sin(s.y * 0.0038 - t * 0.21 + s.phase * 0.3) * 0.3;
          const shear = 1 - Math.abs(s.lane - 0.8) * 0.35;
          const base = (3.2 + s.spd * 2.6) * shear * (1 + Math.sin(s.x * 0.002 - t * 0.8) * 0.15);
          const dirX = Math.cos(meander);
          const dirY = Math.sin(meander);
          const keep = (laneY - (s.y + s.dh / 2)) * 0.004;

          let dvx = dirX * base + gx * s.windK;
          let dvy =
            dirY * base * 0.8 +
            keep * base +
            gy * s.windK +
            Math.sin(t * 0.9 + s.phase) * 0.4;

          /* the hand parts the storm — near paper feels it most */
          let hovered = false;
          if (p.active) {
            const dx = s.x + s.dw / 2 - p.x;
            const dy = s.y + s.dh / 2 - p.y;
            const d2 = dx * dx + dy * dy;
            const depthBoost = Math.max(0.25, 1 + s.zB / 620);
            const R = (s.sealed ? 125 : 175) * depthBoost;
            if (d2 < R * R && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = (1 - d / R) * (1 - d / R) * (s.sealed ? 1.5 : 2.6) * depthBoost;
              s.vx += (dx / d) * f * dt;
              s.vy += (dy / d) * f * dt;
              s.spin += (dx / d) * (dy / d) * f * 0.3;
            }
            hovered = s.sealed && d2 < 130 * 130;
          }

          /* a sealed postbag notices the hand — it slows and leans in */
          s.boost += ((hovered ? 1.15 : 1) - s.boost) * (hovered ? 0.12 : 0.08) * dt;
          if (hovered) {
            dvx *= 0.55;
            dvy *= 0.55;
          }

          /* steer into the flow — this is what makes it wind, not noise.
             Scaled by target speed so strong currents win fast. */
          const k = Math.min(1, s.steer * dt * (2.4 + Math.hypot(dvx, dvy) * 0.5));
          s.vx += (dvx - s.vx) * k;
          s.vy += (dvy - s.vy) * k;
          s.x += s.vx * dt;
          s.y += s.vy * dt;

          /* exited downstream → re-enter upwind on its band */
          if (s.x > W + 150) {
            s.x = -150 - prand(Math.round(t * 10) + i * 7) * 160;
            s.y = cy + (s.lane - 0.78) * H * 0.55 + (prand(i * 13) - 0.5) * 60;
            s.vx = base;
            s.vy = 0;
          } else if (s.x < -320) {
            s.vx += (-320 - s.x) * 0.01;
          }
          if (s.y < -110) s.vy += (-110 - s.y) * 0.01;
          else if (s.y > H + 110) s.vy += (H + 110 - s.y) * 0.01;

          /* orientation: paper rides broadside; tumblers fully spin */
          let rot: number;
          if (s.tumbler) {
            const want = Math.atan2(s.vy, s.vx) * 57.2958;
            const dr = ((want - s.rot + 540) % 360) - 180;
            s.rot += dr * Math.min(1, 0.05 * dt) + s.spin * dt;
            s.spin *= 0.985;
            rot = s.rot;
          } else {
            const want = Math.max(
              -34,
              Math.min(34, Math.atan2(s.vy, Math.abs(s.vx) + 0.4) * 57.2958 * 1.25),
            );
            const dr = ((want - s.rot + 540) % 360) - 180;
            s.rot += dr * Math.min(1, 0.07 * s.agil * dt);
            rot = s.rot + Math.sin(t * 2.2 * s.freq + s.phase) * s.rock;
          }

          const tiltX = Math.sin(t * 1.05 * s.freq + s.phase) * 12;
          const tiltY =
            Math.cos(t * 0.78 * s.freq + s.phase * 1.4) * 16 +
            Math.max(-11, Math.min(11, s.vx * 0.8));

          const z = s.zB + Math.sin(t * s.zF + s.zP) * s.zA;

          /* world-space: sim is top-left screen px; GL is center, y-up */
          pos.set(s.x + s.dw / 2 - W / 2, H / 2 - (s.y + s.dh / 2), z);
          qH.setFromAxisAngle(ZA, rot * D2R);
          qX.setFromAxisAngle(XA, tiltX * D2R);
          qY.setFromAxisAngle(YA, tiltY * D2R);
          qH.multiply(qX).multiply(qY);
          const sc = s.scale * s.boost;
          scl.set(s.dw * sc, s.dh * sc, 1);
          m4.compose(pos, qH, scl);
          mesh.setMatrixAt(i, m4);

          /* ride the hit button on the sealed letter — include the
             perspective factor so it actually covers the rendered quad */
          if (s.sealed) {
            const btn = hitRef.current[s.story];
            if (btn) {
              const persp = camera.position.z / (camera.position.z - z);
              const bs = sc * persp;
              btn.style.transform = `translate(${(s.x + s.dw / 2 - 66 * bs).toFixed(1)}px, ${(s.y + s.dh / 2 - 45 * bs).toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${bs.toFixed(3)})`;
            }
          }
        }
        mesh.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);
      };

      /* first size */
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.position.z = H / 2 / Math.tan(25 * D2R);
      camera.updateProjectionMatrix();
      mat.uniforms.uFogNear.value = camera.position.z - 60;
      mat.uniforms.uFogFar.value = camera.position.z + 560;

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !running) {
            running = true;
            last = performance.now();
            lastScroll = window.scrollY;
            raf = requestAnimationFrame(paint);
          } else if (!entries[0].isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.05 },
      );
      io.observe(stage!);

      return () => {
        io.disconnect();
        running = false;
        cancelAnimationFrame(raf);
        mesh.dispose();
        geo.dispose();
        mat.dispose();
        tex.dispose();
        renderer.dispose();
      };
    }

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [configs]);

  const grab = useCallback((index: number) => {
    const s = simsRef.current[index];
    const stage = stageRef.current;
    if (!s || !stage || heldRef.current >= 0 || !s.sealed) return;
    heldRef.current = index;
    const btn = hitRef.current[index];
    if (btn) btn.style.visibility = "hidden";
    burstRef.current = { x: s.x, y: s.y };
    lastBtnRef.current = btn ?? null;
    setFound((f) => new Set(f).add(s.story));
    setOpened({
      story: s.story,
      img: SEALED_IMGS[s.story],
      ox: s.x,
      oy: s.y,
      orot: s.rot,
      oscale: s.scale,
      tx: stage.clientWidth / 2 - 66,
      ty: stage.clientHeight * 0.4 - 42,
    });
  }, []);

  /* After the overlay exits, toss the letter back into the storm. */
  const release = useCallback(() => {
    const i = heldRef.current;
    heldRef.current = -1;
    if (i >= 0) {
      const s = simsRef.current[i];
      const stage = stageRef.current;
      const btn = hitRef.current[i];
      if (s && stage) {
        s.x = stage.clientWidth / 2 - 30;
        s.y = stage.clientHeight * 0.45;
        s.vx = (prand(i * 77) - 0.5) * 14;
        s.vy = -5 - prand(i * 55) * 7;
      }
      if (btn) btn.style.visibility = "";
    }
    lastBtnRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpened(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened]);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
  };
  const pointerOff = () => {
    pointerRef.current.active = false;
  };

  if (glFailed) return <FloodStatic />;

  return (
    <section
      ref={sectionRef}
      id="stories"
      aria-label="Letters home"
      className="relative h-[240svh] md:h-[300svh]"
      data-scene
      data-nav-dark
    >
      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerLeave={pointerOff}
        onPointerCancel={pointerOff}
        className="cinema-stage sticky top-0 min-h-svh overflow-hidden select-none"
      >
        <Sky bolt={bolt} />
        <EnvDefs />
        <canvas ref={canvasRef} className="xc-flood-canvas" aria-hidden="true" />

        {/* the four hit areas — invisible buttons riding the sealed
            postbags, each carrying the letter slip that peeks out */}
        <div className="xc-flood-hits">
          {TESTIMONIALS.map((story, i) => {
            const house = getHouse(story.houseId);
            return (
              <button
                key={story.name}
                ref={(el) => {
                  hitRef.current[i] = el;
                }}
                className="xc-flood-hit"
                aria-label={`Open the letter from ${story.name}`}
                onClick={() => grab(i)}
              >
                <span className="xc-flood-tab">
                  <span className="pk-line">“{quotePeek(story)}”</span>
                  <span className="pk-score">
                    <s>{story.before}</s>
                    <b style={{ color: house.ink }}>{story.after}</b>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* headline — under the swarm, so near paper crosses in front of it */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-[60] px-5 pb-14 md:px-10 md:pb-16">
          <h2 className="max-w-md text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-cream sm:text-5xl">
            They wrote back.
          </h2>
          <p className="mt-3 max-w-xs text-[0.85rem] leading-relaxed text-cream/60">
            {found.size === REAL
              ? "All four delivered — the archive is yours."
              : "Four letters, sealed in house wax — the score is already peeking out. Catch one."}
          </p>
        </div>

        {/* top row — kicker + letters-read counter */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[65]">
          <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 pt-24 md:px-8 md:pt-28">
            <p className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.16em] text-cream/75 uppercase">
              <OwlPost className="size-4.5" />
              Letters home
            </p>
            <p className="text-[0.72rem] text-cream/60 tabular-nums" aria-live="polite">
              0{found.size} / 0{REAL} read
            </p>
          </div>
        </div>

        {/* the catch */}
        <AnimatePresence onExitComplete={release}>
          {opened && (
            <motion.button
              key="flood-backdrop"
              className="absolute inset-0 z-[70] cursor-pointer bg-[#050914]/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpened(null)}
              aria-label="Put the letter back"
              tabIndex={-1}
            />
          )}
          {opened && (
            <OpenedLetter key="flood-letter" opened={opened} onClose={() => setOpened(null)} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Settled frame — no cinema, the letters arrive already open           */
/* ------------------------------------------------------------------ */

function FloodStatic() {
  return (
    <section
      id="stories"
      aria-label="Letters home"
      className="relative overflow-hidden py-16 sm:py-28"
      data-nav-dark
    >
      <Sky bolt={null} />
      <EnvDefs />
      <div className="relative mx-auto max-w-[880px] px-5 md:px-8">
        <p className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.16em] text-cream/75 uppercase">
          <OwlPost className="size-4.5" />
          Letters home
        </p>
        <h2 className="mt-4 max-w-xl text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-cream sm:text-5xl">
          They wrote back.
        </h2>
        <p className="mt-4 max-w-md text-[0.85rem] leading-relaxed text-cream/60">
          Four letters, sealed in house wax.
        </p>
        <div className="mt-12 space-y-8">
          {TESTIMONIALS.map((story) => (
            <LetterSheet key={story.name} story={story} animate={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function LetterFlood() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <FloodStatic />;
  return <Flood />;
}
