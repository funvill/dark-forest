import seedrandom from 'seedrandom';
import type { SolarSystem } from '../types/solarSystem';
import { StarType } from '../types/solarSystem';

// Default seed for universe generation
export const DEFAULT_SEED = 'darkforest';

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
  
  constructor(seed: string = DEFAULT_SEED) {
    this.seed = seed;
  }

  /**
   * Generate or retrieve a solar system at given coordinates
   * Uses seed + coordinates to ensure deterministic generation
   */
  getSolarSystem(q: number, r: number): SolarSystem | null {
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
    const sectorMod = Math.floor(distance / 10); // Changes every 10 hexes
    const baseChance = 0.15 + (sectorMod % 11) * 0.01; // 15-25% range (increased from 5-15%)
    
    if (rng() > baseChance) {
      return null; // No solar system here
    }

    // Generate star type - heavily weighted toward smaller stars
    const starRoll = rng();
    let starType: StarType;
    let mass: number;
    
    if (starRoll < 0.7) {
      // 70% Red Dwarf (increased from 50%)
      starType = StarType.RED_DWARF;
      mass = 1 + rng() * 9; // 1-10
    } else if (starRoll < 0.9) {
      // 20% Yellow Sun (decreased from 30%)
      starType = StarType.YELLOW_SUN;
      mass = 20 + rng() * 30; // 20-50
    } else if (starRoll < 0.97) {
      // 7% White Dwarf (decreased from 15%)
      starType = StarType.WHITE_DWARF;
      mass = 5 + rng() * 10; // 5-15
    } else {
      // 3% Blue Giant (decreased from 5%)
      starType = StarType.BLUE_GIANT;
      mass = 100 + rng() * 400; // 100-500
    }

    // Generate planet count (weighted: 50% chance of 2-4 planets)
    let planetCount: number;
    const planetRoll = rng();
    if (planetRoll < 0.5) {
      planetCount = 2 + Math.floor(rng() * 3); // 2-4 planets (50%)
    } else {
      planetCount = Math.floor(rng() * 11); // 0-10 planets (50%)
    }

    // Check for life (5% chance)
    const hasLife = rng() < 0.05;
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
}

// Export singleton instance
export const universeGenerator = new UniverseGenerator();
