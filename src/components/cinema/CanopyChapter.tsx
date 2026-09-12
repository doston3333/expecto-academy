import { Candle } from "@/components/ui/Candle";
import { Stars } from "@/components/ui/Stars";
import { WaxStamp } from "@/components/ui/WaxStamp";
import { getHouse, HOUSES } from "@/lib/houses";
import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";

const LETTERS = ["E", "X", "P", "E", "C", "T", "O"];

/**
 * Seven house-edged panels lift one by one like a canopy, revealing the
 * lit hall behind them — the doorway into enrollment.
 */
export function CanopyChapter() {
  return (
    <div className="xc-scene-chapter xc-canopy-chapter" data-chapter="canopy" aria-label="Chapter VI — the hall">
      <div className="xc-chapter-stage">
        <div className="xc-hall-peek" data-nav-dark data-peek-gated>
          <Stars count={8} />
          <Candle className="absolute bottom-[8%] left-[6%] hidden sm:block" height={64} delay={1.4} />
          <Candle className="absolute right-[6%] bottom-[14%] hidden sm:block" height={52} delay={2.6} />
          <div className="xc-hall-inner">
            <p className="xc-eyebrow">
              <i />
              <span className="xc-chapter-no">Chapter VI</span>The hall
            </p>
            <h2>
              The hall is lit.
              <br />
              Take your seat.
            </h2>
            <span className="xc-hall-cue">
              <ArrowDown className="size-3.5" />
              Enroll below
            </span>
          </div>
        </div>
        <div className="xc-art xc-canopy-art" aria-hidden="true">
          {LETTERS.map((letter, i) => (
            <div
              key={letter + i}
              className="xc-canopy-panel"
              style={
                {
                  "--panel": i,
                  "--panel-tint": HOUSES[i % HOUSES.length].hex,
                } as CSSProperties
              }
            >
              <span>{letter}</span>
            </div>
          ))}
          <div className="xc-canopy-invite">
            <WaxStamp house={getHouse("amberfell")} className="xc-invite-mark size-14 drop-shadow-md" />
            <p>
              The great hall
              <br />
              <em>is waiting.</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
