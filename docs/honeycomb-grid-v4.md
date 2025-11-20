# Honeycomb-Grid v4 Cheat Sheet

## Overview

Honeycomb-grid v4 is a TypeScript library for working with hexagonal grids. It provides utilities for creating hex grids, calculating distances, finding paths, and managing hex coordinates.

**Version used in this project:** `4.1.5`

## Key Concepts

### Coordinate Systems

Honeycomb-grid v4 uses **axial coordinates** by default, NOT offset coordinates.

- **Axial coordinates**: `(q, r)` - Two axes that naturally represent the hex grid
- **Cube coordinates**: `(x, y, z)` where `x + y + z = 0` - Derived from axial
- **Offset coordinates**: Row/column grid (NOT used by honeycomb-grid v4)

**Conversion formulas:**
```typescript
// Axial to Cube
x = q
z = r  
y = -q - r

// Cube to Axial
q = x
r = z
```

### Orientations

- **Pointy-top**: Hexagons with a point at the top (used in this project)
- **Flat-top**: Hexagons with a flat edge at the top

## Basic Setup

```typescript
import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid';

// Define hex type with dimensions
const Hex = defineHex({ 
  dimensions: 50,  // HEX_SIZE
  orientation: Orientation.POINTY 
});

// Create a single hex
const hex = new Hex({ q: 0, r: 0 });

// Create a rectangular grid
const grid = new Grid(Hex, rectangle({ width: 10, height: 10 }));
```

## Critical Gotcha: World Coordinate Offset

**⚠️ IMPORTANT:** Honeycomb-grid v4 does NOT position hex (0,0) at world origin (0, 0)!

With `HEX_SIZE = 50` and pointy-top orientation:
- Hex (0,0) center is at world coordinates `(43.30127..., 50)`
- This offset varies based on `HEX_SIZE` and `orientation`

### Solution: Calculate and Apply Offset

```typescript
// Calculate the offset
const originHex = new Hex({ q: 0, r: 0 });
const offsetX = originHex.center.x;  // ~43.3
const offsetY = originHex.center.y;  // 50

// Apply offset to all world positions
const hex = new Hex({ q: 2, r: -1 });
const worldX = hex.center.x - offsetX;
const worldY = hex.center.y - offsetY;
```

This centers your coordinate system so hex (0,0) is at world (0,0).

## Hex Positions Within a Hexagon

When placing elements within a hexagon, you can use standardized position references. The project includes helper functions in `src/utils/hexPositions.ts` for working with these positions.

### Position Reference Diagram

![Hex Position Reference](../docs/hex-position-reference.png)

The diagram above shows a hexagon with labeled positions:
- **A-F**: Corner positions (vertices of the hexagon)
- **G-L**: Edge midpoint positions
- **X**: Center position

### Position Details (Y-down, Pointy-Top)

**Corners (vertices):**
- **A**: Top corner (0°, at top)
- **B**: Top-right corner (60° clockwise from A)
- **C**: Bottom-right corner (120° clockwise from A)
- **D**: Bottom corner (180° from A)
- **E**: Bottom-left corner (240° clockwise from A)
- **F**: Top-left corner (300° clockwise from A)

**Edges (midpoints between corners):**
- **G**: Top-right edge (between A and B)
- **H**: Right edge (between B and C)
- **I**: Bottom-right edge (between C and D)
- **J**: Bottom-left edge (between D and E)
- **K**: Left edge (between E and F)
- **L**: Top-left edge (between F and A)

**Center:**
- **X**: Hex center point

### Using Hex Position Helpers

```typescript
import { 
  getHexPosition, 
  getHexCorners,
  getHexEdges,
  HEX_POSITIONS 
} from './utils/hexPositions';
import { hexToWorldPosition } from './utils/hexUtils';

// Get a specific position within hex (2, -1)
const topCorner = getHexPosition({ q: 2, r: -1 }, 'A', hexToWorldPosition);
// Returns: { x: worldX, y: worldY }

// Get all corners of a hex
const corners = getHexCorners({ q: 0, r: 0 }, hexToWorldPosition);
// Returns: [posA, posB, posC, posD, posE, posF]

// Get all edge midpoints of a hex
const edges = getHexEdges({ q: 0, r: 0 }, hexToWorldPosition);
// Returns: [posG, posH, posI, posJ, posK, posL]

// Access position constants directly
const topRightOffset = HEX_POSITIONS.B;
// Returns: { x: 43.3, y: -25, label: 'Top-Right' }
```

### Position Coordinates (HEX_SIZE = 50)

All positions are **relative to the hex center** in world space:

```typescript
// Corners
A: { x: 0,     y: -50   }  // Top
B: { x: 43.3,  y: -25   }  // Top-Right
C: { x: 43.3,  y: 25    }  // Bottom-Right
D: { x: 0,     y: 50    }  // Bottom
E: { x: -43.3, y: 25    }  // Bottom-Left
F: { x: -43.3, y: -25   }  // Top-Left

// Edge midpoints
G: { x: 21.65,  y: -37.5  }  // Top-Right Edge
H: { x: 43.3,   y: 0      }  // Right Edge
I: { x: 21.65,  y: 37.5   }  // Bottom-Right Edge
J: { x: -21.65, y: 37.5   }  // Bottom-Left Edge
K: { x: -43.3,  y: 0      }  // Left Edge
L: { x: -21.65, y: -37.5  }  // Top-Left Edge

// Center
X: { x: 0, y: 0 }  // Center
```

### Common Use Cases

**Placing an icon at a corner:**
```typescript
const iconPos = getHexPosition({ q: 3, r: -2 }, 'B', hexToWorldPosition);
iconSprite.position.set(iconPos.x, iconPos.y, 10);
```

**Placing units at edges:**
```typescript
// Get right edge of hex to place a unit
const unitPos = getHexPosition({ q: 0, r: 0 }, 'H', hexToWorldPosition);
```

**Drawing connections between hexes:**
```typescript
// Connect center of hex A to top-right corner of hex B
const startPos = getHexPosition(hexA, 'X', hexToWorldPosition);
const endPos = getHexPosition(hexB, 'B', hexToWorldPosition);
```

**Checking position type:**
```typescript
import { isCornerPosition, isEdgePosition, isCenterPosition } from './utils/hexPositions';

if (isCornerPosition('A')) {
  // Handle corner placement
}
if (isEdgePosition('H')) {
  // Handle edge placement
}
```

## Hex Properties

```typescript
const hex = new Hex({ q: 1, r: -1 });

// Coordinates
hex.q           // Axial q coordinate
hex.r           // Axial r coordinate

// Geometry
hex.center      // { x: number, y: number } - Center point in world coordinates
hex.corners     // Array of 6 corner points { x: number, y: number }

// Example corner structure for pointy-top:
// corners[0] - top
// corners[1] - top-right
// corners[2] - bottom-right
// corners[3] - bottom
// corners[4] - bottom-left
// corners[5] - top-left
```

## Creating Geometry (Three.js Integration)

Hex corners are in **absolute world coordinates**. For Three.js, make them relative to center:

```typescript
const hex = new Hex({ q: 0, r: 0 });
const center = hex.center;
const corners = hex.corners;

const hexShape = new THREE.Shape();
corners.forEach((corner, i) => {
  // Make corners RELATIVE to center for proper geometry
  const relX = corner.x - center.x;
  const relY = corner.y - center.y;
  
  if (i === 0) {
    hexShape.moveTo(relX, relY);
  } else {
    hexShape.lineTo(relX, relY);
  }
});
hexShape.closePath();

// Position the mesh using the center
const geometry = new THREE.ShapeGeometry(hexShape);
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(center.x - offsetX, center.y - offsetY, 0);
```

## Distance Calculation

```typescript
import { getHexDistance } from './utils/hexUtils';

// Distance uses axial coordinates directly
const distance = getHexDistance(
  { q: 0, r: 0 },   // From hex
  { q: 3, r: -2 }   // To hex
);

// Implementation (in utils/hexUtils.ts):
function getHexDistance(hexA: HexCoordinates, hexB: HexCoordinates): number {
  const dq = hexB.q - hexA.q;
  const dr = hexB.r - hexA.r;
  const ds = (-hexA.q - hexA.r) - (-hexB.q - hexB.r);
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(ds)) / 2;
}
```

## Pathfinding

```typescript
import { findHexPath } from './utils/hexUtils';

const path = findHexPath(
  { q: 0, r: 0 },   // Start
  { q: 3, r: -2 }   // End
);

// Returns array of hex coordinates: [{ q: 0, r: 0 }, { q: 1, r: -1 }, ...]
// Uses cube coordinate linear interpolation
```

## Grid Traversal

```typescript
const grid = new Grid(Hex, rectangle({ width: 10, height: 10 }));

// Iterate through all hexes
grid.forEach((hex) => {
  console.log(`Hex (${hex.q}, ${hex.r}) at ${hex.center.x}, ${hex.center.y}`);
});

// Create hexes manually in a range
for (let q = -radius; q <= radius; q++) {
  for (let r = -radius; r <= radius; r++) {
    const hex = new Hex({ q, r });
    // Use hex...
  }
}
```

## Finding Hexes in Range

```typescript
function getHexesInRange(center: HexCoordinates, range: number): HexCoordinates[] {
  const hexes: HexCoordinates[] = [];
  
  for (let q = -range; q <= range; q++) {
    for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
      const targetQ = center.q + q;
      const targetR = center.r + r;
      
      if (getHexDistance(center, { q: targetQ, r: targetR }) <= range) {
        hexes.push({ q: targetQ, r: targetR });
      }
    }
  }
  
  return hexes;
}
```

## Common Patterns

### Creating a Hex Template

```typescript
// Create a reusable hex shape
const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });
const templateHex = new Hex({ q: 0, r: 0 });
const templateCenter = templateHex.center;
const corners = templateHex.corners;

// Make corners relative for geometry
const hexShape = new THREE.Shape();
corners.forEach((corner, i) => {
  const relX = corner.x - templateCenter.x;
  const relY = corner.y - templateCenter.y;
  if (i === 0) hexShape.moveTo(relX, relY);
  else hexShape.lineTo(relX, relY);
});
hexShape.closePath();

// Use this geometry for all hexes
const geometry = new THREE.ShapeGeometry(hexShape);
```

### Drawing Lines Between Hexes

```typescript
const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });
const path = findHexPath(start, end);

const points: THREE.Vector3[] = [];
path.forEach((pathHex) => {
  const hex = new Hex(pathHex);
  const center = hex.center;
  // Apply offset to center hex (0,0) at world origin
  points.push(new THREE.Vector3(
    center.x - offsetX,
    center.y - offsetY,
    zLevel
  ));
});

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
```

## Debugging Tips

### Visualize Coordinates

```typescript
// Log hex positions to verify coordinate system
const hex = new Hex({ q: 0, r: 0 });
console.log('Hex (0,0) center:', hex.center);
console.log('Hex (0,0) corners[0]:', hex.corners[0]);
```

### Check World Offset

```typescript
// Always calculate offset for your specific configuration
const Hex = defineHex({ dimensions: YOUR_SIZE, orientation: YOUR_ORIENTATION });
const originHex = new Hex({ q: 0, r: 0 });
console.log('Origin offset:', { x: originHex.center.x, y: originHex.center.y });
```

### Verify Distance Calculations

```typescript
// Distance should be symmetrical
const d1 = getHexDistance({ q: 0, r: 0 }, { q: 3, r: -2 });
const d2 = getHexDistance({ q: 3, r: -2 }, { q: 0, r: 0 });
console.assert(d1 === d2, 'Distance should be symmetrical');
```

## Common Mistakes to Avoid

1. **❌ Don't assume hex (0,0) is at world (0,0)** - Always calculate and apply the offset
2. **❌ Don't use offset coordinate conversions** - Honeycomb-grid v4 uses axial, not offset
3. **❌ Don't use absolute corners for geometry** - Make corners relative to center
4. **❌ Don't forget to apply offset to ALL positioning** - Hexes, ships, particles, lines, etc.
5. **❌ Don't use bitwise operations like `(q & 1)`** - That's for offset coordinates, not axial

## Performance Tips

- Create hex geometry once and reuse it
- Use refs to store offset values rather than recalculating
- Pre-calculate frequently used hex positions
- Use grid traversal methods rather than manual loops when possible

## Resources

- [Honeycomb-grid GitHub](https://github.com/flauwekeul/honeycomb)
- [Hex Grid Guide (Red Blob Games)](https://www.redblobgames.com/grids/hexagons/)
- [Axial Coordinates Explanation](https://www.redblobgames.com/grids/hexagons/#coordinates-axial)

## Version History

- **v4.1.5** (current) - Uses axial coordinates by default
- Earlier versions may have different coordinate systems

---

*Last updated: November 19, 2025*
