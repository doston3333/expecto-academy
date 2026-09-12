import { CREAM, FOREST_DEEP, HOUSE_PALETTE } from "./palette";

export type HouseId = "aurelion" | "veridian" | "noctis" | "amberfell";

export interface House {
  id: HouseId;
  name: string;
  animal: string;
  trait: string;
  track: string;
  duration: string;
  motto: string;
  hex: string;
  metal: string;
  ink: string;
  onHouse: "cream" | "forest";
  description: string;
  bestFor: string;
  outcome: string;
}

export const HOUSES: House[] = [
  {
    id: "aurelion",
    name: "Aurelion",
    animal: "Phoenix",
    trait: "Courage",
    track: "Fast-Track",
    duration: "8 weeks",
    motto: "Ex cinere, sursum.",
    hex: HOUSE_PALETTE.aurelion.hex,
    metal: HOUSE_PALETTE.aurelion.metal,
    ink: HOUSE_PALETTE.aurelion.ink,
    onHouse: "cream",
    description:
      "For students with a deadline breathing down their neck. Aurelion compresses the whole prep into eight intense weeks — diagnostic, drills, mocks — so the score lands before this year's application round.",
    bestFor: "Current 11th–12th years applying this cycle",
    outcome: "+150 points before this year's deadlines",
  },
  {
    id: "veridian",
    name: "Veridian",
    animal: "Serpent",
    trait: "Precision",
    track: "Math Intensive",
    duration: "10 weeks",
    motto: "Numeri non mentiuntur.",
    hex: HOUSE_PALETTE.veridian.hex,
    metal: HOUSE_PALETTE.veridian.metal,
    ink: HOUSE_PALETTE.veridian.ink,
    onHouse: "cream",
    description:
      "For students whose Reading is fine and whose Math is the wall. Veridian rebuilds algebra, advanced math, and Desmos strategy until the hard questions stop feeling like guesses.",
    bestFor: "Students stuck below 700 on Math",
    outcome: "A Math score that finally pulls its weight",
  },
  {
    id: "noctis",
    name: "Noctis",
    animal: "Raven",
    trait: "Wit",
    track: "Verbal Intensive",
    duration: "10 weeks",
    motto: "In verbo, via.",
    hex: HOUSE_PALETTE.noctis.hex,
    metal: HOUSE_PALETTE.noctis.metal,
    ink: HOUSE_PALETTE.noctis.ink,
    onHouse: "cream",
    description:
      "For students who lose their points in the passages. Noctis trains evidence, rhetoric, and grammar against the Digital SAT's adaptive modules — in English, the way you will sit it.",
    bestFor: "Strong math students who lose points in passages",
    outcome: "A verbal score that finally matches your math",
  },
  {
    id: "amberfell",
    name: "Amberfell",
    animal: "Badger",
    trait: "Grit",
    track: "Deep Mastery",
    duration: "16 weeks",
    motto: "Lente, certe.",
    hex: HOUSE_PALETTE.amberfell.hex,
    metal: HOUSE_PALETTE.amberfell.metal,
    ink: HOUSE_PALETTE.amberfell.ink,
    onHouse: "forest",
    description:
      "Start lower. Finish certain. Amberfell is the long runway: fundamentals first, then strategy, then the mock gauntlet — with a mentor who will not let a week go quiet.",
    bestFor: "Students beginning below 1100 who want a full rebuild",
    outcome: "A patient climb into a scholarship band — not a crash course",
  },
];

export function getHouse(id: HouseId): House {
  const house = HOUSES.find((item) => item.id === id);
  if (!house) {
    throw new Error(`Unknown house: ${id}`);
  }
  return house;
}

/** Type color on a house fill — cream on ember/green/cobalt, forest on gold. */
export function onHouseType(house: House): string {
  return house.onHouse === "forest" ? FOREST_DEEP : CREAM;
}

