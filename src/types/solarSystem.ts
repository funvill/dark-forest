export const StarType = {
  RED_DWARF: 'Red Dwarf',
  YELLOW_SUN: 'Yellow Sun',
  BLUE_GIANT: 'Blue Giant',
  WHITE_DWARF: 'White Dwarf',
} as const;

export type StarType = typeof StarType[keyof typeof StarType];

export interface SolarSystem {
  q: number;
  r: number;
  name: string;
  starType: StarType;
  mass: number;
  planetCount: number;
  hasLife: boolean;
  lifeDescription?: string;
  isConverted: boolean;
}

export interface HexCoordinate {
  q: number;
  r: number;
}
