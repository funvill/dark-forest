# Hex Position Helper - Usage Examples

This document provides practical examples of using the hex position helper functions to place elements within and around hexagons.

## Quick Reference

For visual reference of positions within a hex, see the [Position Reference Diagram](./honeycomb-grid-v4.md#position-reference-diagram).

![Hex Position Reference](./hex-position-reference.png)

## Basic Setup

```typescript
import { defineHex, Orientation } from 'honeycomb-grid';
import { 
  HEX_SIZE,
  HEX_POSITIONS, 
  getHexPosition,
  getHexCorners,
  getHexEdges
} from '../utils/hexPositions';
import { getHexWorldCenter } from '../utils/hexUtils';

// Define your hex type
const Hex = defineHex({ 
  dimensions: HEX_SIZE, 
  orientation: Orientation.POINTY 
});

// Calculate coordinate system offset
const originHex = new Hex({ q: 0, r: 0 });
const offsetX = originHex.center.x;
const offsetY = originHex.center.y;

// Create a helper function for converting hex coords to world position
const hexToWorld = (hexCoords: { q: number; r: number }) => 
  getHexWorldCenter(hexCoords, Hex, offsetX, offsetY);
```

## Example 1: Placing Icons at Hex Corners

Place resource icons at the corners of a hex:

```typescript
// Place a gold icon at the top-right corner of hex (3, -2)
const goldIconPos = getHexPosition({ q: 3, r: -2 }, 'B', hexToWorld);
goldIcon.position.set(goldIconPos.x, goldIconPos.y, 10);

// Place a crystal icon at the bottom corner
const crystalIconPos = getHexPosition({ q: 3, r: -2 }, 'D', hexToWorld);
crystalIcon.position.set(crystalIconPos.x, crystalIconPos.y, 10);
```

## Example 2: Placing Units at Edge Midpoints

Place military units along the edges of a hex:

```typescript
const hexCoords = { q: 0, r: 0 };

// Place a defender at the right edge
const defenderPos = getHexPosition(hexCoords, 'H', hexToWorld);
defenderSprite.position.set(defenderPos.x, defenderPos.y, 15);

// Place attackers at multiple edges
['G', 'I', 'J'].forEach((edge, index) => {
  const pos = getHexPosition(hexCoords, edge as any, hexToWorld);
  attackers[index].position.set(pos.x, pos.y, 15);
});
```

## Example 3: Drawing Border Around Hex

Highlight a hex by drawing circles at all its corners:

```typescript
const hexCoords = { q: 2, r: -1 };
const corners = getHexCorners(hexCoords, hexToWorld);

corners.forEach((corner, index) => {
  const circleGeometry = new THREE.CircleGeometry(5, 16);
  const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const circle = new THREE.Mesh(circleGeometry, circleMaterial);
  circle.position.set(corner.x, corner.y, 10);
  scene.add(circle);
});
```

## Example 4: Creating Connection Lines Between Hexes

Draw a line from the center of one hex to a specific edge of another:

```typescript
const fromHex = { q: 0, r: 0 };
const toHex = { q: 1, r: 0 };

// Get center of first hex
const startPos = getHexPosition(fromHex, 'X', hexToWorld);

// Get right edge of second hex (where it connects)
const endPos = getHexPosition(toHex, 'H', hexToWorld);

// Create line
const points = [
  new THREE.Vector3(startPos.x, startPos.y, 5),
  new THREE.Vector3(endPos.x, endPos.y, 5)
];
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, lineMaterial);
scene.add(line);
```

## Example 5: Using Position Constants Directly

Access position offsets without hex-to-world conversion:

```typescript
// Get the offset for the top corner relative to hex center
const topCornerOffset = HEX_POSITIONS.A;
console.log(topCornerOffset); 
// Output: { x: 0, y: -50, label: 'Top' }

// Place an element at top corner of hex at world position (100, 200)
const hexCenterX = 100;
const hexCenterY = 200;
element.position.set(
  hexCenterX + topCornerOffset.x,
  hexCenterY + topCornerOffset.y,
  10
);
```

## Example 6: Placing Building at Hex Center

Place a building or structure at the center of a hex:

```typescript
const hexCoords = { q: 5, r: -3 };
const buildingPos = getHexPosition(hexCoords, 'X', hexToWorld);

buildingSprite.position.set(buildingPos.x, buildingPos.y, 20);
```

## Example 7: Creating Edge Decorations

Add decorative elements along all edges of a hex:

```typescript
const hexCoords = { q: -2, r: 1 };
const edges = getHexEdges(hexCoords, hexToWorld);

edges.forEach((edge, index) => {
  const decorGeometry = new THREE.CircleGeometry(3, 16);
  const decorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const decoration = new THREE.Mesh(decorGeometry, decorMaterial);
  decoration.position.set(edge.x, edge.y, 8);
  scene.add(decoration);
});
```

## Example 8: Territory Markers

Place markers at corners to show territory ownership:

```typescript
const territoryHexes = [
  { q: 0, r: 0 },
  { q: 1, r: 0 },
  { q: 0, r: 1 }
];

territoryHexes.forEach(hexCoords => {
  // Place marker at top corner of each hex
  const markerPos = getHexPosition(hexCoords, 'A', hexToWorld);
  
  const marker = new THREE.Mesh(
    new THREE.CircleGeometry(8, 32),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  marker.position.set(markerPos.x, markerPos.y, 12);
  scene.add(marker);
});
```

## Example 9: Dynamic Position Selection

Find the closest position to a mouse click within a hex:

```typescript
import { getClosestHexPosition } from '../utils/hexPositions';

// Given mouse click on a hex, find which part was clicked
const clickedHex = { q: 2, r: -1 };
const hexCenter = hexToWorld(clickedHex);

// Calculate offset from hex center
const offsetX = mouseWorldX - hexCenter.x;
const offsetY = mouseWorldY - hexCenter.y;

// Find closest position
const closestPos = getClosestHexPosition(offsetX, offsetY);
console.log(`Clicked on position: ${closestPos}`);
// Output: "B" (if clicked near top-right corner)

// Check what type of position it is
if (isCornerPosition(closestPos)) {
  console.log('Clicked a corner!');
} else if (isEdgePosition(closestPos)) {
  console.log('Clicked an edge!');
} else {
  console.log('Clicked the center!');
}
```

## Example 10: Path Waypoint Markers

Place waypoint markers along a path at specific hex positions:

```typescript
import { findHexPath } from '../utils/hexUtils';

const path = findHexPath({ q: 0, r: 0 }, { q: 5, r: -3 });

path.forEach((hexCoords, index) => {
  // Place marker at center of each hex in path
  const markerPos = getHexPosition(hexCoords, 'X', hexToWorld);
  
  const waypointNumber = createTextSprite((index + 1).toString());
  waypointNumber.position.set(markerPos.x, markerPos.y, 25);
  scene.add(waypointNumber);
});
```

## Example 11: Selecting Specific Hex by Coordinates

To select a specific hex by its coordinates programmatically:

```typescript
// Select hex at coordinates (3, -2)
const targetHex = { q: 3, r: -2 };

// Get the hex's world position
const hexWorldPos = hexToWorld(targetHex);

// Highlight the hex by creating a visual indicator
const highlightGeometry = new THREE.CircleGeometry(HEX_SIZE * 0.8, 32);
const highlightMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xffff00, 
  transparent: true, 
  opacity: 0.3 
});
const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
highlight.position.set(hexWorldPos.x, hexWorldPos.y, 2);
scene.add(highlight);

// Or trigger the hex info modal programmatically
setSelectedHex(targetHex);
setShowHexInfo(true);
```

## Example 12: Iterating Through All Positions

Process all positions within a hex systematically:

```typescript
const hexCoords = { q: 0, r: 0 };

// Iterate through all corners
const cornerKeys = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
cornerKeys.forEach(key => {
  const pos = getHexPosition(hexCoords, key, hexToWorld);
  const label = HEX_POSITIONS[key].label;
  console.log(`${key} (${label}): (${pos.x}, ${pos.y})`);
});

// Iterate through all edges
const edgeKeys = ['G', 'H', 'I', 'J', 'K', 'L'] as const;
edgeKeys.forEach(key => {
  const pos = getHexPosition(hexCoords, key, hexToWorld);
  const label = HEX_POSITIONS[key].label;
  console.log(`${key} (${label}): (${pos.x}, ${pos.y})`);
});

// Get center
const centerPos = getHexPosition(hexCoords, 'X', hexToWorld);
console.log(`X (Center): (${centerPos.x}, ${centerPos.y})`);
```

## Best Practices

1. **Always use helper functions** instead of calculating positions manually
2. **Use position constants** (A-L, X) instead of magic numbers
3. **Cache hex-to-world conversions** if using the same hex repeatedly
4. **Use descriptive variable names** that include the position (e.g., `topCornerPos`)
5. **Keep z-coordinates consistent** for proper layering (e.g., terrain=0, units=10, UI=20)
6. **Reference the diagram** when unsure about position labels

## Common Position Use Cases

| Position | Common Uses |
|----------|-------------|
| X (Center) | Buildings, hex info, territory markers |
| A (Top) | Direction indicators, exit points |
| B-F (Corners) | Resource icons, fortifications, connection points |
| G-L (Edges) | Units, walls, connections to adjacent hexes |

## Coordinate System Reminder

- Uses **Y-down** coordinate system (like canvas/DOM)
- **Pointy-top** orientation (point at top)
- **Axial coordinates** (q, r) for hex grid positions
- Position A is at **top** (0°), going **clockwise**

## See Also

- [Honeycomb Grid v4 Cheat Sheet](./honeycomb-grid-v4.md)
- [Hex Position Helper API](../src/utils/hexPositions.ts)
- [Hex Utils API](../src/utils/hexUtils.ts)
