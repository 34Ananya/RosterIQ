export const DEMO_SOURCE_FILES = [
  "roster_jan_2026.csv",
  "roster_feb_2026.xlsx",
  "roster_mar_2026.csv"
] as const;

export const SPECIALTIES = [
  "Family Medicine",
  "Internal Medicine",
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "Neurology"
] as const;

export function pseudoRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)]!;
}

