import { OwlPost } from "@/components/ui/OwlPost";
import { Embers } from "@/components/ui/Embers";
import { BreakCopy } from "@/components/cinema/BreakCopy";
import { MOSS } from "@/lib/palette";
import type { CSSProperties } from "react";

const TICKS = Array.from({ length: 48 }, (_, i) => i);

interface HorizonChapterProps {
  numeral: string;
  line: string;
  sub?: string;
}

/**
 * The week-dial spins and recedes while a cream horizon rises over the
 * tinted hall — the letters end, the ledger begins.
 */
export function HorizonChapter({ numeral, line, sub }: HorizonChapterProps) {
  return (
    <section className="xc-scene-chapter xc-horizon-chapter" data-chapter="horizon" aria-label={line}>
      <div className="xc-chapter-stage">
        <div className="xc-art xc-horizon-art" aria-hidden="true">
          <Embers color={MOSS} opacity={0.3} count={4} />
          <div className="xc-scene-index">
            <span>The weeks turn</span>
            <OwlPost className="size-4" />
          </div>
          <div className="xc-dial">
            {TICKS.map((tick) => (
              <i key={tick} style={{ "--tick": tick } as CSSProperties} />
            ))}
            <span className="xc-dial-hand" />
            <span className="xc-dial-center" />
          </div>
          <p className="xc-horizon-whisper">
            Eight weeks.
            <br />
            <em>One number.</em>
          </p>
          <div className="xc-horizon-dome" />
        </div>
        <div className="xc-scene-copy">
          <BreakCopy numeral={numeral} line={line} sub={sub} />
        </div>
      </div>
    </section>
  );
}
