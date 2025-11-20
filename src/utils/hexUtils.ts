interface HexCoordinate {
  q: number;
  r: number;
}

/**
 * Calculate distance between two hexes using axial/cube coordinate system
 * Honeycomb-grid v4 uses axial coordinates (q, r) by default
 * Based on: https://www.redblobgames.com/grids/hexagons/#distances
 */
export const getHexDistance = (hex1: HexCoordinate, hex2: HexCoordinate): number => {
  // Honeycomb (q, r) are already axial coordinates
  // Convert to cube: x=q, z=r, y=-q-r
  const dq = hex1.q - hex2.q;
  const dr = hex1.r - hex2.r;
  const ds = (-hex1.q - hex1.r) - (-hex2.q - hex2.r);
  
  // Cube distance formula
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(ds)) / 2;
};

/**
 * Get all hexes within a given range from a center hex
 */
export const getHexesInRange = (center: HexCoordinate, range: number): HexCoordinate[] => {
  const hexes: HexCoordinate[] = [];
  
  for (let q = center.q - range; q <= center.q + range; q++) {
    for (let r = center.r - range; r <= center.r + range; r++) {
      const hex = { q, r };
      if (getHexDistance(center, hex) <= range) {
        hexes.push(hex);
      }
    }
  }
  
  return hexes;
};

/**
 * Find path between two hexes (simple straight line path for now)
 * Returns array of hex coordinates from start to end
 * Uses cube coordinate lerp as described in Red Blob Games
 */
export const findHexPath = (start: HexCoordinate, end: HexCoordinate): HexCoordinate[] => {
  const distance = getHexDistance(start, end);
  if (distance === 0) return [start];
  
  const path: HexCoordinate[] = [];
  
  // Convert axial to cube coordinates
  const cubeStart = { x: start.q, y: -start.q - start.r, z: start.r };
  const cubeEnd = { x: end.q, y: -end.q - end.r, z: end.r };
  
  // Lerp through the path in cube space
  for (let i = 0; i <= distance; i++) {
    const t = i / distance;
    
    // Linear interpolation in cube coordinates
    const x = cubeStart.x + (cubeEnd.x - cubeStart.x) * t;
    const y = cubeStart.y + (cubeEnd.y - cubeStart.y) * t;
    const z = cubeStart.z + (cubeEnd.z - cubeStart.z) * t;
    
    // Round to nearest hex
    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);
    
    const xDiff = Math.abs(rx - x);
    const yDiff = Math.abs(ry - y);
    const zDiff = Math.abs(rz - z);
    
    if (xDiff > yDiff && xDiff > zDiff) {
      rx = -ry - rz;
    } else if (yDiff > zDiff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }
    
    // Convert cube back to axial
    const q = rx;
    const r = rz;
    
    path.push({ q, r });
  }
  
  return path;
};

/**
 * Get the world center position of a hex, accounting for the coordinate system offset.
 * This ensures hex (0,0) is at world position (0,0).
 * 
 * @param hexCoords - The hex coordinates (q, r)
 * @param Hex - The Hex class from honeycomb-grid
 * @param offsetX - The X offset to center the coordinate system
 * @param offsetY - The Y offset to center the coordinate system
 * @returns The world position { x, y } of the hex center
 */
export function getHexWorldCenter(
  hexCoords: HexCoordinate,
  Hex: any,
  offsetX: number,
  offsetY: number
): { x: number; y: number } {
  const hex = new Hex(hexCoords);
  return {
    x: hex.center.x - offsetX,
    y: hex.center.y - offsetY,
  };
}
