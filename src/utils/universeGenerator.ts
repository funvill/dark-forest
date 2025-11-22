import seedrandom from 'seedrandom';
import type { SolarSystem } from '../types/solarSystem';
import { StarType } from '../types/solarSystem';
import {
  DEFAULT_UNIVERSE_SEED,
  SOLAR_SYSTEM_BASE_CHANCE,
  SOLAR_SYSTEM_CHANCE_VARIANCE,
  SECTOR_SIZE,
  SECTOR_VARIATIONS,
  STAR_DISTRIBUTION,
  STAR_ENERGY_RANGES,
  COMMON_PLANET_COUNT_CHANCE,
  COMMON_PLANET_COUNT,
  FULL_PLANET_COUNT_RANGE,
  LIFE_CHANCE,
} from '../constants/gameConstants';

// Default seed for universe generation
export const DEFAULT_SEED = DEFAULT_UNIVERSE_SEED;

// Name components for procedural generation
const NAME_PREFIXES = [
  'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Shadow', 'Crystal', 'Void',
  'Nova', 'Stellar', 'Cosmic', 'Nebula', 'Eclipse', 'Phantom', 'Radiant', 'Ancient',
  'Lost', 'Eternal', 'Frozen', 'Burning', 'Silent', 'Distant', 'Hidden', 'Bright',
];

const NAME_SUFFIXES = [
  'Prime', 'Minor', 'Major', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega',
  'Nexus', 'Haven', 'Reach', 'Expanse', 'Cluster', 'Sector', 'Drift', 'Gate',
];

// Life form descriptions
const LIFE_DESCRIPTIONS = [
  'Simple microbial organisms detected in planetary oceans',
  'Complex fungal networks span multiple continental plates',
  'Bioluminescent flora creates stunning light displays at night',
  'Ancient fossilized remains suggest extinct intelligent species',
  'Gaseous life forms drift through upper atmospheric layers',
  'Crystalline entities show signs of primitive collective intelligence',
  'Deep ocean trenches harbor chemosynthetic ecosystems',
  'Vast bacterial mats cover most planetary surfaces',
  'Airborne spore-based organisms form continental-scale colonies',
  'Extremophile bacteria thrive in volcanic regions',
];

/**
 * Universe generator using seeded pseudo-random number generation
 * Ensures consistent solar system generation across sessions
 */
export class UniverseGenerator {
  private seed: string;
  private destroyedSystems: Set<string> = new Set();
  
  constructor(seed: string = DEFAULT_SEED) {
    this.seed = seed;
  }

  /**
   * Generate or retrieve a solar system at given coordinates
   * Uses seed + coordinates to ensure deterministic generation
   */
  getSolarSystem(q: number, r: number): SolarSystem | null {
    // Check if system was destroyed by Big Gun
    const key = `${q},${r}`;
    if (this.destroyedSystems.has(key)) {
      return null;
    }
    
    // Starting hex (0,0) has no solar system (player's converted home system)
    if (q === 0 && r === 0) {
      return null;
    }

    // Create seeded RNG for this specific hex
    const hexSeed = `${this.seed}-${q},${r}`;
    const rng = seedrandom(hexSeed);

    // Determine if this hex has a solar system
    // Higher density for smaller stars, with reduced minimum spacing
    const distance = Math.sqrt(q * q + r * r);
    const sectorMod = Math.floor(distance / SECTOR_SIZE);
    const baseChance = SOLAR_SYSTEM_BASE_CHANCE + (sectorMod % SECTOR_VARIATIONS) * SOLAR_SYSTEM_CHANCE_VARIANCE;
    
    if (rng() > baseChance) {
      return null; // No solar system here
    }

    // Generate star type - heavily weighted toward smaller stars
    const starRoll = rng();
    let starType: StarType;
    let mass: number;
    
    if (starRoll < STAR_DISTRIBUTION.RED_DWARF) {
      starType = StarType.RED_DWARF;
      const range = STAR_ENERGY_RANGES[starType];
      mass = range.min + rng() * (range.max - range.min);
    } else if (starRoll < STAR_DISTRIBUTION.RED_DWARF + STAR_DISTRIBUTION.YELLOW_SUN) {
      starType = StarType.YELLOW_SUN;
      const range = STAR_ENERGY_RANGES[starType];
      mass = range.min + rng() * (range.max - range.min);
    } else if (starRoll < STAR_DISTRIBUTION.RED_DWARF + STAR_DISTRIBUTION.YELLOW_SUN + STAR_DISTRIBUTION.WHITE_DWARF) {
      starType = StarType.WHITE_DWARF;
      const range = STAR_ENERGY_RANGES[starType];
      mass = range.min + rng() * (range.max - range.min);
    } else {
      starType = StarType.BLUE_GIANT;
      const range = STAR_ENERGY_RANGES[starType];
      mass = range.min + rng() * (range.max - range.min);
    }

    // Generate planet count (weighted: 50% chance of 2-4 planets)
    let planetCount: number;
    const planetRoll = rng();
    if (planetRoll < COMMON_PLANET_COUNT_CHANCE) {
      planetCount = COMMON_PLANET_COUNT.min + Math.floor(rng() * (COMMON_PLANET_COUNT.max - COMMON_PLANET_COUNT.min + 1));
    } else {
      planetCount = FULL_PLANET_COUNT_RANGE.min + Math.floor(rng() * (FULL_PLANET_COUNT_RANGE.max - FULL_PLANET_COUNT_RANGE.min + 1));
    }

    // Check for life (5% chance)
    const hasLife = rng() < LIFE_CHANCE;
    const lifeDescription = hasLife 
      ? LIFE_DESCRIPTIONS[Math.floor(rng() * LIFE_DESCRIPTIONS.length)]
      : undefined;

    // Generate name
    const prefix = NAME_PREFIXES[Math.floor(rng() * NAME_PREFIXES.length)];
    const suffix = NAME_SUFFIXES[Math.floor(rng() * NAME_SUFFIXES.length)];
    const name = `${prefix} ${suffix}-${q},${r}`;

    return {
      q,
      r,
      name,
      starType,
      mass,
      planetCount,
      hasLife,
      lifeDescription,
      isConverted: false,
    };
  }

  /**
   * Check if a hex has a solar system without generating full details
   */
  hasSolarSystem(q: number, r: number): boolean {
    return this.getSolarSystem(q, r) !== null;
  }

  /**
   * Get all solar systems in a given radius
   * Useful for rendering visible hexes
   */
  getSolarSystemsInRadius(centerQ: number, centerR: number, radius: number): SolarSystem[] {
    const systems: SolarSystem[] = [];
    
    for (let q = centerQ - radius; q <= centerQ + radius; q++) {
      for (let r = centerR - radius; r <= centerR + radius; r++) {
        const system = this.getSolarSystem(q, r);
        if (system) {
          systems.push(system);
        }
      }
    }
    
    return systems;
  }

  /**
   * Update seed (for testing or alternate universes)
   */
  setSeed(newSeed: string): void {
    this.seed = newSeed;
  }

  /**
   * Get current seed
   */
  getSeed(): string {
    return this.seed;
  }

  /**
   * Destroy a solar system (removed by Big Gun)
   */
  destroySolarSystem(q: number, r: number): void {
    const key = `${q},${r}`;
    this.destroyedSystems.add(key);
  }
}

// Export singleton instance
export const universeGenerator = new UniverseGenerator();
