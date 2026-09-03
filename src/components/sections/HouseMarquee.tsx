import { HouseScarf } from "@/components/ui/HouseScarf";
import { HOUSES, onHouseType } from "@/lib/houses";

/**
 * The house-scarf procession — an infinite slow march of the four houses.
 * Pauses on hover; reduced motion stills it via the global CSS rule.
 */
export function HouseMarquee() {
  const strip = [...HOUSES, ...HOUSES];

  return (
    <section aria-label="The four houses" className="overflow-hidden">
      <div
        className="house-marquee flex w-max hover:[animation-play-state:paused]"
      >
        {strip.map((house, i) => {
          const onGold = house.onHouse === "forest";
          return (
            <div
              key={`${house.id}-${i}`}
              aria-hidden={i >= HOUSES.length}
              className="relative flex w-[13.5rem] shrink-0 flex-col justify-center gap-1.5 px-5 pt-8 pb-10 sm:w-[17rem] sm:px-6 sm:pt-8 sm:pb-10"
              style={{
                backgroundColor: house.hex,
                color: onHouseType(house),
              }}
            >
              <p className="font-display text-2xl italic sm:text-[1.7rem]">{house.name}</p>
              <p
                className="text-[0.68rem] font-medium tracking-[0.12em] uppercase"
                style={{
                  color: onGold ? house.ink : "color-mix(in srgb, white 72%, transparent)",
                }}
              >
                {house.animal} · {house.track}
              </p>
              <p
                className="font-display text-[0.8rem] italic"
                style={{
                  color: onGold ? house.ink : "color-mix(in srgb, white 60%, transparent)",
                }}
              >
                {house.motto}
              </p>
              <HouseScarf house={house} className="absolute inset-x-0 bottom-0 h-1.5" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
