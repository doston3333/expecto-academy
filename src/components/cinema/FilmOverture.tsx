import { Logo } from "@/components/ui/Logo";
import { HOUSES } from "@/lib/houses";

/**
 * The hero's last breath: a quiet page condenses into the Expecto seal —
 * shrinking, tilting, lifting away — before Chapter I opens.
 */
export function FilmOverture() {
  return (
    <section className="xc-overture" data-chapter="overture" aria-label="Chapter I — the film">
      <div className="xc-overture-stage">
        <div className="xc-art xc-iris" aria-hidden="true">
          <div className="xc-iris-depth">
            <p className="xc-ov-whisper">
              Every Tuesday.
              <br />
              <em>A little sharper.</em>
            </p>
            <div className="xc-iris-card">
              <span className="xc-iris-dots">
                {HOUSES.map((house) => (
                  <i key={house.id} style={{ backgroundColor: house.hex }} />
                ))}
              </span>
              <Logo className="h-[clamp(90px,16svh,150px)]" />
              <span>Expecto Academy · The prospectus</span>
            </div>
          </div>
        </div>
        <div className="xc-ov-heading">
          <p className="xc-eyebrow">
            <i />
            <span className="xc-chapter-no">Chapter I</span>The film
          </p>
          <h2>
            Watch the
            <br />
            <em>score get built.</em>
          </h2>
          <p className="xc-ov-caption">One window. Six beats of a real preparation.</p>
        </div>
        <div className="xc-ov-cue" aria-hidden="true">
          <span>The door</span>
          <i />
          <span>The film</span>
        </div>
      </div>
    </section>
  );
}
