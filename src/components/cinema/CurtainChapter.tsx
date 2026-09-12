import { WaxStamp } from "@/components/ui/WaxStamp";
import { BreakCopy } from "@/components/cinema/BreakCopy";
import { getHouse } from "@/lib/houses";

interface CurtainChapterProps {
  numeral: string;
  line: string;
  sub?: string;
  tint?: string;
  left: string;
  right: string;
  leftKicker: string;
  rightKicker: string;
  leftFoot?: string;
  rightFoot?: string;
}

/**
 * Two page-panels hold the sentence split at the seam; they part like
 * proscenium curtains to reveal the chapter page underneath.
 */
export function CurtainChapter({
  numeral,
  line,
  sub,
  tint,
  left,
  right,
  leftKicker,
  rightKicker,
  leftFoot,
  rightFoot,
}: CurtainChapterProps) {
  return (
    <section
      className="xc-scene-chapter xc-curtain-chapter"
      data-chapter="curtain"
      aria-label={line}
      style={tint ? { backgroundColor: `${tint}0d` } : undefined}
    >
      <div className="xc-chapter-stage">
        <div className="xc-scene-copy xc-curtain-copy">
          <BreakCopy numeral={numeral} line={line} sub={sub} tint={tint} />
        </div>
        <div className="xc-art xc-curtains" aria-hidden="true">
          <div className="xc-curtain xc-curtain-left">
            <span>{leftKicker}</span>
            <strong>{left}</strong>
            {leftFoot ? <small>{leftFoot}</small> : null}
          </div>
          <div className="xc-curtain xc-curtain-right">
            <span>{rightKicker}</span>
            <strong>
              <em>{right}</em>
            </strong>
            {rightFoot ? <small>{rightFoot}</small> : null}
          </div>
          <div className="xc-curtain-seam">
            <WaxStamp house={getHouse("aurelion")} className="size-[52px] drop-shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
