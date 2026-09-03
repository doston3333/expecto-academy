import { onHouseType, type House } from "@/lib/houses";

interface WaxStampProps {
  house: House;
  className?: string;
}

/** A small wax seal stamped in the house color. */
export function WaxStamp({ house, className }: WaxStampProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <circle cx="48" cy="48" r="44" fill={house.hex} />
      <circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        stroke={house.metal}
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      <circle cx="48" cy="48" r="34" fill="none" stroke={house.metal} strokeWidth="1" />
      <text
        x="48"
        y="54"
        textAnchor="middle"
        fill={onHouseType(house)}
        fontSize="14"
        fontWeight="600"
        letterSpacing="3"
        fontFamily="Instrument Sans, sans-serif"
      >
        EA
      </text>
    </svg>
  );
}
