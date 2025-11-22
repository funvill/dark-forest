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
  mass: number; // Energy units (1-120) - displayed as Joules to user but stored as small numbers
  planetCount: number;
  hasLife: boolean;
  lifeDescription?: string;
  isConverted: boolean;
}

export interface HexCoordinate {
  q: number;
  r: number;
}

export const ActionType = {
  MOVE: 'move',
  BIG_GUN: 'big_gun',
  CONVERSION: 'conversion',
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];

export interface InformationRing {
  id: string;
  origin: HexCoordinate;
  createdTurn: number;
  actionType: ActionType;
  playerId: string;
  playerName: string;
  // For Big Gun rings
  targetHex?: HexCoordinate;
}

export interface DestroyedHex {
  q: number;
  r: number;
  destroyedTurn: number;
}
