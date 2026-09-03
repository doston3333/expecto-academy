import { getHouse } from "@/lib/houses";
import { CREAM, FOREST_DEEP } from "@/lib/palette";
import { useId } from "react";

interface CrestProps {
  className?: string;
  /** Stroke/monogram ink. Forest-deep on paper, cream on the night hall. */
  ink?: string;
}

/**
 * The Expecto Academy crest — an original quartered shield.
 * Aurelion, Veridian, Noctis, Amberfell around the EA star.
 */
export function Crest({ className, ink = FOREST_DEEP }: CrestProps) {
  const id = useId().replace(/:/g, "");
  const shield = "M8 6 H56 V34 C56 52 44 62 32 66 C20 62 8 52 8 34 Z";
  const aurelion = getHouse("aurelion");
  const veridian = getHouse("veridian");
  const noctis = getHouse("noctis");
  const amberfell = getHouse("amberfell");

  return (
    <svg viewBox="0 0 64 76" className={className} role="img" aria-label="Expecto Academy crest">
      <defs>
        <clipPath id={id}>
          <path d={shield} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="8" y="6" width="24" height="28" fill={aurelion.hex} />
        <rect x="32" y="6" width="24" height="28" fill={veridian.hex} />
        <rect x="8" y="34" width="24" height="32" fill={noctis.hex} />
        <rect x="32" y="34" width="24" height="32" fill={amberfell.hex} />
        <path d="M32 6 V66 M8 34 H56" stroke={ink} strokeWidth="1.5" />
      </g>
      <path d={shield} fill="none" stroke={ink} strokeWidth="2.5" />
      <circle cx="32" cy="33" r="10" fill={CREAM} stroke={ink} strokeWidth="1.5" />
      <text
        x="32"
        y="37.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={ink}
        fontFamily="Instrument Sans, sans-serif"
      >
        EA
      </text>
      <path d="M16 71 H48" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
      <text x="10" y="73.5" fontSize="6.5" fill={ink}>
        ✦
      </text>
      <text x="50" y="73.5" fontSize="6.5" fill={ink}>
        ✦
      </text>
    </svg>
  );
}
