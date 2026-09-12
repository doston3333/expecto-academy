import { OwlPost } from "@/components/ui/OwlPost";
import { ArrowDown, Check, Mail } from "lucide-react";

/**
 * Chapter IV's door: three oversized lines gather off the page, collapse
 * into the owl-post thread, and hand off to the archive heading.
 */
export function WordsChapter() {
  return (
    <div className="xc-scene-chapter xc-words-chapter" data-chapter="words" aria-label="Chapter IV — the archive">
      <div className="xc-chapter-stage">
        <div className="xc-art xc-words-art" aria-hidden="true">
          <div className="xc-scene-index">
            <span>The work is quiet</span>
            <OwlPost className="size-4" />
          </div>
          <div className="xc-word-line xc-word-line-one">
            <span>A quiet room.</span>
            <em>A loud result.</em>
          </div>
          <div className="xc-word-line xc-word-line-two">
            <em>Diagnostic.</em>
            <span>Official.</span>
          </div>
          <div className="xc-word-line xc-word-line-three">
            <span>Four seats.</span>
            <em>Funded.</em>
          </div>
          <div className="xc-words-thread">
            <i />
            <span>
              <OwlPost />
            </span>
            <i />
          </div>
          <div className="xc-words-delivery">
            <Mail className="size-4" />
            <span>Letters home</span>
            <Check className="size-3.5" />
          </div>
          <div className="xc-scene-cue">
            <span>Scroll into the archive</span>
            <ArrowDown className="size-3" />
          </div>
        </div>
        <div className="xc-scene-copy">
          <div className="xc-width xc-words-heading">
            <p className="xc-eyebrow">
              <i />
              <span className="xc-chapter-no">Chapter IV</span>The archive
            </p>
            <h2>
              Proof,
              <br />
              <em>on paper.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[0.9rem] leading-relaxed text-muted">
              Four graduates, four funded seats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
