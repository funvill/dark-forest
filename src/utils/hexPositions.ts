/**
 * Hex Position Helper Utilities
 * 
 * This module provides helper functions for working with hex grid positions
 * and calculating positions within individual hexagons.
 * 
 * Coordinate System:
 * - Uses axial coordinates (q, r) for hex grid positions
 * - Uses Y-down coordinate system for world positions (like canvas/DOM)
 * - Hex (0,0) is positioned at world origin (0,0) after applying offset
 */

export const HEX_SIZE = 50; // Distance from center to corner

export interface HexCoordinates {
  q: number;
  r: number;
}

export interface WorldPosition {
  x: number;
  y: number;
}

/**
 * Hex positions relative to center.
 * Use these constants to position elements within a hex.
 * 
 * Reference diagram: See docs/honeycomb-grid-v4.md
 * 
 * Layout (Y-down, pointy-top):
 *     A (top)
 *    / \
 *   F   B (top-right)
 *  /  X  \
 * E   |   C (bottom-right)
 *  \  |  /
 *   L   H
 *    \ /
 *     D (bottom)
 * 
 * A-F: Corner positions
 * G-L: Edge midpoint positions
 * X: Center position
 */

/**
 * Corner positions within a hex (relative to hex center)
 * In Y-down coordinate system for pointy-top orientation
 */
export const HEX_CORNERS = {
  A: { x: 0, y: -HEX_SIZE, label: 'Top' },              // -90°
  B: { x: HEX_SIZE * 0.866, y: -HEX_SIZE * 0.5, label: 'Top-Right' },    // -30°
  C: { x: HEX_SIZE * 0.866, y: HEX_SIZE * 0.5, label: 'Bottom-Right' },  // 30°
  D: { x: 0, y: HEX_SIZE, label: 'Bottom' },            // 90°
  E: { x: -HEX_SIZE * 0.866, y: HEX_SIZE * 0.5, label: 'Bottom-Left' },  // 150°
  F: { x: -HEX_SIZE * 0.866, y: -HEX_SIZE * 0.5, label: 'Top-Left' },    // -150°
} as const;

/**
 * Edge midpoint positions within a hex (relative to hex center)
 * In Y-down coordinate system for pointy-top orientation
 */
export const HEX_EDGES = {
  G: { x: HEX_SIZE * 0.433, y: -HEX_SIZE * 0.75, label: 'Top-Right Edge' },     // Between A and B
  H: { x: HEX_SIZE * 0.866, y: 0, label: 'Right Edge' },                        // Between B and C
  I: { x: HEX_SIZE * 0.433, y: HEX_SIZE * 0.75, label: 'Bottom-Right Edge' },   // Between C and D
  J: { x: -HEX_SIZE * 0.433, y: HEX_SIZE * 0.75, label: 'Bottom-Left Edge' },   // Between D and E
  K: { x: -HEX_SIZE * 0.866, y: 0, label: 'Left Edge' },                        // Between E and F
  L: { x: -HEX_SIZE * 0.433, y: -HEX_SIZE * 0.75, label: 'Top-Left Edge' },     // Between F and A
} as const;

/**
 * Center position within a hex
 */
export const HEX_CENTER = {
  X: { x: 0, y: 0, label: 'Center' },
} as const;

/**
 * All hex positions combined
 */
export const HEX_POSITIONS = {
  ...HEX_CORNERS,
  ...HEX_EDGES,
  ...HEX_CENTER,
} as const;

/**
 * Get the world position of a specific location within a hex
 * 
 * @param hexCoords - Hex grid coordinates (q, r)
 * @param position - Position within the hex ('A' through 'L', or 'X')
 * @param hexToWorld - Function to convert hex coordinates to world position
 * @returns World position { x, y }
 * 
 * @example
 * // Get top corner of hex (2, -1)
 * const pos = getHexPosition({ q: 2, r: -1 }, 'A', hexToWorldPosition);
 */
export function getHexPosition(
  hexCoords: HexCoordinates,
  position: keyof typeof HEX_POSITIONS,
  hexToWorld: (hex: HexCoordinates) => WorldPosition
): WorldPosition {
  const hexCenter = hexToWorld(hexCoords);
  const relativePos = HEX_POSITIONS[position];
  
  return {
    x: hexCenter.x + relativePos.x,
    y: hexCenter.y + relativePos.y,
  };
}

/**
 * Get multiple positions within a hex
 * 
 * @param hexCoords - Hex grid coordinates (q, r)
 * @param positions - Array of position keys
 * @param hexToWorld - Function to convert hex coordinates to world position
 * @returns Array of world positions
 * 
 * @example
 * // Get all corner positions of hex (0, 0)
 * const corners = getMultipleHexPositions(
 *   { q: 0, r: 0 }, 
 *   ['A', 'B', 'C', 'D', 'E', 'F'],
 *   hexToWorldPosition
 * );
 */
export function getMultipleHexPositions(
  hexCoords: HexCoordinates,
  positions: Array<keyof typeof HEX_POSITIONS>,
  hexToWorld: (hex: HexCoordinates) => WorldPosition
): WorldPosition[] {
  return positions.map(pos => getHexPosition(hexCoords, pos, hexToWorld));
}

/**
 * Get all corner positions of a hex
 * 
 * @param hexCoords - Hex grid coordinates (q, r)
 * @param hexToWorld - Function to convert hex coordinates to world position
 * @returns Array of 6 corner positions in order: A, B, C, D, E, F
 */
export function getHexCorners(
  hexCoords: HexCoordinates,
  hexToWorld: (hex: HexCoordinates) => WorldPosition
): WorldPosition[] {
  return getMultipleHexPositions(
    hexCoords,
    ['A', 'B', 'C', 'D', 'E', 'F'],
    hexToWorld
  );
}

/**
 * Get all edge midpoint positions of a hex
 * 
 * @param hexCoords - Hex grid coordinates (q, r)
 * @param hexToWorld - Function to convert hex coordinates to world position
 * @returns Array of 6 edge positions in order: G, H, I, J, K, L
 */
export function getHexEdges(
  hexCoords: HexCoordinates,
  hexToWorld: (hex: HexCoordinates) => WorldPosition
): WorldPosition[] {
  return getMultipleHexPositions(
    hexCoords,
    ['G', 'H', 'I', 'J', 'K', 'L'],
    hexToWorld
  );
}

/**
 * Calculate the angle (in radians) from one hex to another
 * Useful for determining direction or rotation
 * 
 * @param from - Starting hex coordinates
 * @param to - Target hex coordinates
 * @param hexToWorld - Function to convert hex coordinates to world position
 * @returns Angle in radians (Y-down coordinate system)
 */
export function getHexAngle(
  from: HexCoordinates,
  to: HexCoordinates,
  hexToWorld: (hex: HexCoordinates) => WorldPosition
): number {
  const fromPos = hexToWorld(from);
  const toPos = hexToWorld(to);
  
  return Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
}

/**
 * Get the closest hex position key to a given offset from hex center
 * 
 * @param offsetX - X offset from hex center
 * @param offsetY - Y offset from hex center
 * @returns Closest position key ('A' through 'L', or 'X')
 */
export function getClosestHexPosition(
  offsetX: number,
  offsetY: number
): keyof typeof HEX_POSITIONS {
  let minDistance = Infinity;
  let closestKey: keyof typeof HEX_POSITIONS = 'X';
  
  for (const [key, pos] of Object.entries(HEX_POSITIONS)) {
    const distance = Math.sqrt(
      Math.pow(pos.x - offsetX, 2) + Math.pow(pos.y - offsetY, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestKey = key as keyof typeof HEX_POSITIONS;
    }
  }
  
  return closestKey;
}

/**
 * Check if a hex position is a corner (A-F)
 */
export function isCornerPosition(position: keyof typeof HEX_POSITIONS): boolean {
  return ['A', 'B', 'C', 'D', 'E', 'F'].includes(position);
}

/**
 * Check if a hex position is an edge midpoint (G-L)
 */
export function isEdgePosition(position: keyof typeof HEX_POSITIONS): boolean {
  return ['G', 'H', 'I', 'J', 'K', 'L'].includes(position);
}

/**
 * Check if a hex position is the center (X)
 */
export function isCenterPosition(position: keyof typeof HEX_POSITIONS): boolean {
  return position === 'X';
}
