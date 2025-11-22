/**
 * Game Constants
 * Central configuration file for all game balance and mechanics variables.
 * Modify these values to tune the game experience.
 */

// ============================================================================
// ENERGY SYSTEM
// ============================================================================

/**
 * Starting energy for the player (in Joules)
 * Default: 4e+20 J (enough for 4 moves of 3 hexes)
 */
export const STARTING_ENERGY = 4e+20;

/**
 * Energy cost formula: 10^(ENERGY_COST_EXPONENT * distance + ENERGY_COST_BASE)
 * Default configuration:
 *   - 1 hex: 1.0e+10 J
 *   - 2 hexes: 1.0e+15 J
 *   - 3 hexes: 1.0e+20 J
 */
export const ENERGY_COST_EXPONENT = 5;
export const ENERGY_COST_BASE = 5;

/**
 * Minimum energy required to continue playing
 * Game over when energy falls below this threshold
 * Default: 1.0e+10 J (cost of 1 hex move)
 */
export const MINIMUM_ENERGY = 1.0e+10;

/**
 * Energy threshold for low energy warning (display in orange)
 * Default: 1.0e+15 J (cost of 2 hex move)
 */
export const LOW_ENERGY_THRESHOLD = 1.0e+15;

/**
 * Speed of light in m/s (used for E=mc² conversion)
 */
export const SPEED_OF_LIGHT = 299792458;

// ============================================================================
// MOVEMENT SYSTEM
// ============================================================================

/**
 * Maximum distance the player can move in hexes per turn
 * Default: 3 hexes
 */
export const MAX_MOVE_DISTANCE = 3;

/**
 * Distance around new position that gets scanned after moving
 * Default: 1 hex (immediate neighbors)
 */
export const SCAN_RANGE_AFTER_MOVE = 1;

/**
 * Ship rotation speed in radians per second
 * Default: 3 RPM (3 * 2π / 60)
 */
export const SHIP_ROTATION_SPEED = (3 * 2 * Math.PI) / 60;

// ============================================================================
// INFORMATION RINGS
// ============================================================================

/**
 * Distance information rings expand per turn (in hexes)
 * Default: 3 hexes per turn
 */
export const RING_EXPANSION_RATE = 3;

/**
 * Maximum distance from ship that rings are visible (in hexes)
 * Default: 25 hexes
 */
export const RING_VISIBILITY_RANGE = 25;

/**
 * Detection tolerance for ring selection (in hexes)
 * Default: 0.5 hexes
 */
export const RING_DETECTION_TOLERANCE = 0.5;

/**
 * Ring line width in pixels
 * Default: 2 pixels
 */
export const RING_LINE_WIDTH = 2;

/**
 * Ring particle count per ring
 * Default: 180 particles
 */
export const RING_PARTICLE_COUNT = 180;

// ============================================================================
// UNIVERSE GENERATION
// ============================================================================

/**
 * Default seed for procedural universe generation
 * Change this to generate a completely different universe
 */
export const DEFAULT_UNIVERSE_SEED = 'darkforest';

/**
 * Base chance for a hex to contain a solar system
 * Modulated by distance from origin
 * Default: 0.15 (15% base chance)
 */
export const SOLAR_SYSTEM_BASE_CHANCE = 0.15;

/**
 * How much the solar system chance varies per sector
 * Each sector is 10 hexes, chance can vary by ±10%
 * Default: 0.01 (1% per sector mod)
 */
export const SOLAR_SYSTEM_CHANCE_VARIANCE = 0.01;

/**
 * Distance between sectors (in hexes)
 * Default: 10 hexes
 */
export const SECTOR_SIZE = 10;

/**
 * Number of sector variations for system density
 * Default: 11 (provides range from base to base+10%)
 */
export const SECTOR_VARIATIONS = 11;

/**
 * Chance for a solar system to have life
 * Default: 0.05 (5%)
 */
export const LIFE_CHANCE = 0.05;

// ============================================================================
// STAR TYPE DISTRIBUTION & MASS RANGES
// ============================================================================

/**
 * Star type probabilities (must sum to 1.0)
 */
export const STAR_DISTRIBUTION = {
  RED_DWARF: 0.70,    // 70% of stars
  YELLOW_SUN: 0.20,   // 20% of stars
  WHITE_DWARF: 0.07,  // 7% of stars
  BLUE_GIANT: 0.03,   // 3% of stars
};

/**
 * Mass ranges for each star type (in solar masses M☉)
 */
export const STAR_MASS_RANGES: Record<string, { min: number; max: number }> = {
  'Red Dwarf': { min: 1, max: 10 },      // 1-10 M☉
  'Yellow Sun': { min: 20, max: 50 },    // 20-50 M☉
  'White Dwarf': { min: 5, max: 15 },    // 5-15 M☉
  'Blue Giant': { min: 100, max: 500 },  // 100-500 M☉
};

/**
 * Star sizes for visual rendering (in pixels)
 */
export const STAR_VISUAL_SIZES: Record<string, number> = {
  'Red Dwarf': 8,
  'Yellow Sun': 12,
  'Blue Giant': 18,
  'White Dwarf': 6,
};

/**
 * Star colors for visual rendering (hex color codes)
 */
export const STAR_COLORS: Record<string, number> = {
  'Red Dwarf': 0xff4444,
  'Yellow Sun': 0xffff44,
  'Blue Giant': 0x4444ff,
  'White Dwarf': 0xeeeeee,
};

// ============================================================================
// PLANET GENERATION
// ============================================================================

/**
 * Chance for a solar system to have 2-4 planets (common range)
 * Default: 0.5 (50% chance)
 */
export const COMMON_PLANET_COUNT_CHANCE = 0.5;

/**
 * Common planet count range (when common chance triggers)
 * Default: 2-4 planets
 */
export const COMMON_PLANET_COUNT = { min: 2, max: 4 };

/**
 * Full planet count range (when common chance doesn't trigger)
 * Default: 0-10 planets
 */
export const FULL_PLANET_COUNT_RANGE = { min: 0, max: 10 };

/**
 * Particle multiplier based on planet count
 * Visual atmosphere particles = planetCount * multiplier
 * Default: 3 (minimum 10 particles regardless)
 */
export const PLANET_PARTICLE_MULTIPLIER = 3;

/**
 * Minimum particle count for star atmosphere
 * Default: 10 particles
 */
export const MIN_ATMOSPHERE_PARTICLES = 10;

// ============================================================================
// CAMERA & RENDERING
// ============================================================================

/**
 * Default camera zoom level
 * Default: 0.5 (50%)
 */
export const DEFAULT_ZOOM = 0.5;

/**
 * Minimum camera zoom level
 * Default: 0.3
 */
export const MIN_ZOOM = 0.3;

/**
 * Maximum camera zoom level
 * Default: 3.0
 */
export const MAX_ZOOM = 3.0;

/**
 * Zoom multiplier for zoom in/out operations
 * Default: 1.2 (20% per zoom step)
 */
export const ZOOM_STEP = 1.2;

/**
 * Default zoom level when resetting camera to ship
 * Default: 2.0
 */
export const RESET_CAMERA_ZOOM = 2.0;

/**
 * Hex grid size (radius of each hex in pixels)
 * Default: 100 pixels
 */
export const HEX_SIZE = 100;

/**
 * Number of hex rings to render around the ship
 * Default: 30 rings (961 hexes total)
 */
export const RENDER_RING_COUNT = 30;

// ============================================================================
// UI COLORS
// ============================================================================

/**
 * Action type colors for information rings
 */
export const ACTION_COLORS = {
  MOVE: '#3b82f6',      // blue
  BIG_GUN: '#f97316',   // orange
  CONVERSION: '#ef4444', // red
};

/**
 * Hex grid colors
 */
export const HEX_COLORS = {
  DEFAULT: 0x444444,        // dark gray
  HOVERED: 0x666666,        // light gray
  SELECTED: 0xffaa00,       // orange
  MOVE_RANGE: 0x00aaff,     // cyan
  MOVE_PATH: 0x00ff00,      // green
  CONVERTED: 0xff0000,      // red
};

/**
 * Fog of war opacity
 * Default: 0.7
 */
export const FOG_OF_WAR_OPACITY = 0.7;

// ============================================================================
// GAME MECHANICS
// ============================================================================

/**
 * Starting ship position
 * Default: (0, 0)
 */
export const STARTING_POSITION = { q: 0, r: 0 };

/**
 * Starting turn number
 * Default: 0
 */
export const STARTING_TURN = 0;

/**
 * Whether debug mode is enabled by default
 * Default: false
 */
export const DEBUG_MODE_DEFAULT = false;
