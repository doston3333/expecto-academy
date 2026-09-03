import { CREAM, CREAM_2, FOREST_DEEP } from "@/lib/palette";

interface CandleProps {
  className?: string;
  height?: number;
  delay?: number;
}

/** A floating great-hall candle. Pure SVG + CSS; reduced motion stills it. */
export function Candle({ className, height = 96, delay = 0 }: CandleProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ""}`}
      style={{ animation: `candle-float 7s ease-in-out ${delay}s infinite` }}
    >
      <svg width={height * 0.3} height={height} viewBox="0 0 30 100" fill="none">
        <ellipse cx="15" cy="15" rx="11" ry="13" fill="#e8a33d" opacity="0.22" />
        <g
          style={{
            transformOrigin: "15px 22px",
            animation: `candle-flicker 2.6s ease-in-out ${delay}s infinite`,
          }}
        >
          <ellipse cx="15" cy="13" rx="4.5" ry="8.5" fill="#f2b04c" />
          <ellipse cx="15" cy="15.5" rx="2" ry="4.5" fill="#f8e3ae" />
        </g>
        <rect x="14.4" y="20" width="1.2" height="5" fill="#3d2c1e" />
        <rect
          x="11"
          y="25"
          width="8"
          height="68"
          rx="3.5"
          fill={CREAM}
          stroke={FOREST_DEEP}
          strokeOpacity="0.14"
        />
        <rect x="11" y="25" width="8" height="7" rx="3.5" fill={CREAM_2} />
        <path d="M11 34 q-2.5 7 0 11 q2.5 -4 0 -11" fill={CREAM_2} />
      </svg>
    </div>
  );
}
