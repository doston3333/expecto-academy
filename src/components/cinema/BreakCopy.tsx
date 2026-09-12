import { HOUSES } from "@/lib/houses";

interface BreakCopyProps {
  numeral: string;
  line: string;
  sub?: string;
  tint?: string;
  quad?: boolean;
}

/**
 * The chapter-page content — the same words ChapterBreak always carried,
 * rendered plainly so a surrounding cinema chapter can drive the reveal.
 */
export function BreakCopy({ numeral, line, sub, tint, quad = false }: BreakCopyProps) {
  return (
    <div className="xc-width flex flex-col items-center justify-center py-16 text-center md:py-0">
      <p className="font-display text-[0.9rem] tracking-[0.3em] text-moss uppercase italic">
        <span aria-hidden="true" style={tint ? { color: tint } : undefined}>
          ✦
        </span>{" "}
        {numeral}{" "}
        <span aria-hidden="true" style={tint ? { color: tint } : undefined}>
          ✦
        </span>
      </p>
      <h2 className="mt-6 max-w-4xl text-[clamp(1.85rem,8.4vw,5rem)] leading-[1.08] font-medium tracking-[-0.035em] text-forest-deep sm:text-[clamp(2.2rem,6.5vw,5rem)] sm:leading-[1.02]">
        {line}
      </h2>
      {quad ? (
        <span
          aria-hidden="true"
          className="mt-8 flex h-1 w-28 overflow-hidden rounded-full"
        >
          {HOUSES.map((house) => (
            <span key={house.id} className="flex-1" style={{ backgroundColor: house.hex }} />
          ))}
        </span>
      ) : (
        <span aria-hidden="true" className="mt-8 block h-px w-24 bg-forest/30" />
      )}
      {sub ? (
        <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-muted">{sub}</p>
      ) : null}
    </div>
  );
}
