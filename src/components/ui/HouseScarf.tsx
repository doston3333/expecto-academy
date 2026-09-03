import type { House } from "@/lib/houses";

interface HouseScarfProps {
  house: House;
  className?: string;
}

/** House scarf hem — main color banded with the house metal. */
export function HouseScarf({ house, className }: HouseScarfProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background: `repeating-linear-gradient(90deg, ${house.hex} 0 16px, ${house.metal} 16px 22px)`,
      }}
    />
  );
}
