import { OwlPost } from "@/components/ui/OwlPost";
import { Embers } from "@/components/ui/Embers";
import { FOREST } from "@/lib/palette";
import { ArrowDown } from "lucide-react";

const TASKS = [
  { cls: "xc-task-1", day: "Saturday", label: "Mock 09 · 09:00" },
  { cls: "xc-task-2", day: "Error log", label: "5 misses to rewrite" },
  { cls: "xc-task-3", day: "Tuesday", label: "Desmos drill · 40 min" },
  { cls: "xc-task-4", day: "Tonight", label: "Passage set · Module 2" },
  { cls: "xc-task-5", day: "Report", label: "1180 → target 1450" },
] as const;

/**
 * Between the oath and the index: the page opens into a panorama,
 * the week's papers drift off the desk, and the room underneath
 * belongs to the number.
 */
export function DeskClearing() {
  return (
    <section className="xc-desk" data-chapter="desk" aria-label="A clearer desk">
      <div className="xc-desk-sticky">
        <Embers color={FOREST} opacity={0.16} count={4} className="hidden md:block" />
        <div className="xc-desk-top" aria-hidden="true">
          <span>The room a score needs</span>
          <OwlPost className="size-4" />
        </div>
        <div className="xc-carry" aria-hidden="true">
          {TASKS.map((task) => (
            <div key={task.label} className={`xc-task ${task.cls}`}>
              <small>{task.day}</small>
              {task.label}
            </div>
          ))}
          <p>
            A little less
            <br />
            <em>on your desk.</em>
          </p>
        </div>
        <div className="xc-room">
          <h2>
            More room
            <br />
            <em>for the number.</em>
          </h2>
          <p>
            For the mock that finally feels familiar.
            <br />
            The trap you stop falling for.
            <br />
            The morning the report lands.
          </p>
        </div>
        <div className="xc-desk-bottom" aria-hidden="true">
          <span>Bring the diagnostic. We carry the rest.</span>
          <ArrowDown className="size-3.5" />
        </div>
      </div>
    </section>
  );
}
