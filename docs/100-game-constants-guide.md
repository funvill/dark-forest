# Game Constants Configuration

This file (`src/constants/gameConstants.ts`) contains all the configurable parameters for the Dark Forest game. You can modify these values to tune the game balance and mechanics.

## Quick Reference

### Energy System
- **STARTING_ENERGY**: Initial energy available (default: 4e+20 J - enough for 4 moves of 3 hexes)
- **ENERGY_COST_EXPONENT & ENERGY_COST_BASE**: Controls move cost formula
  - Formula: `Energy = 10^(ENERGY_COST_EXPONENT * distance + ENERGY_COST_BASE)`
  - Default costs: 1 hex = 1e+10 J, 2 hex = 1e+15 J, 3 hex = 1e+20 J
- **MINIMUM_ENERGY**: Game over threshold (default: 1e+10 J)
- **LOW_ENERGY_THRESHOLD**: Warning threshold for UI (default: 1e+15 J)

### Movement
- **MAX_MOVE_DISTANCE**: Maximum hexes per move (default: 3)
- **SCAN_RANGE_AFTER_MOVE**: How many hexes around new position get scanned (default: 1)
- **SHIP_ROTATION_SPEED**: Visual rotation speed in radians/second

### Information Rings
- **RING_EXPANSION_RATE**: Hexes per turn that rings expand (default: 3)
- **RING_VISIBILITY_RANGE**: Max distance rings are visible (default: 25 hexes)
- **RING_DETECTION_TOLERANCE**: Detection radius for selecting rings (default: 0.5 hexes)
- **RING_LINE_WIDTH**: Visual thickness in pixels (default: 2)
- **RING_PARTICLE_COUNT**: Number of particles per ring (default: 180)

### Universe Generation
- **DEFAULT_UNIVERSE_SEED**: Seed for procedural generation (default: 'darkforest')
- **SOLAR_SYSTEM_BASE_CHANCE**: Base probability of system (default: 0.15 = 15%)
- **SOLAR_SYSTEM_CHANCE_VARIANCE**: How much density varies (default: 0.01 = 1% per sector)
- **SECTOR_SIZE**: Distance between sector changes (default: 10 hexes)
- **LIFE_CHANCE**: Probability of life in systems (default: 0.05 = 5%)

### Star Types
**Distribution** (must sum to 1.0):
- Red Dwarf: 70%
- Yellow Sun: 20%
- White Dwarf: 7%
- Blue Giant: 3%

**Mass Ranges** (in solar masses M☉):
- Red Dwarf: 1-10 M☉
- Yellow Sun: 20-50 M☉
- White Dwarf: 5-15 M☉
- Blue Giant: 100-500 M☉

**Visual Properties**:
- Sizes (pixels): 8, 12, 18, 6 respectively
- Colors: Red (#ff4444), Yellow (#ffff44), Blue (#4444ff), White (#eeeeee)

### Planet Generation
- **COMMON_PLANET_COUNT_CHANCE**: Probability of 2-4 planets (default: 0.5 = 50%)
- **COMMON_PLANET_COUNT**: Range for common case (default: 2-4)
- **FULL_PLANET_COUNT_RANGE**: Full range (default: 0-10)
- **PLANET_PARTICLE_MULTIPLIER**: Atmosphere particles = planets * multiplier (default: 3)
- **MIN_ATMOSPHERE_PARTICLES**: Minimum visual particles (default: 10)

### Camera & Rendering
- **DEFAULT_ZOOM**: Starting zoom (default: 1.0)
- **MIN_ZOOM / MAX_ZOOM**: Zoom limits (default: 0.3 - 3.0)
- **ZOOM_STEP**: Zoom multiplier per step (default: 1.2 = 20%)
- **RESET_CAMERA_ZOOM**: Zoom when centering on ship (default: 2.0)
- **HEX_SIZE**: Hex radius in pixels (default: 100)
- **RENDER_RING_COUNT**: Hex rings to render around ship (default: 30)

### UI Colors
- **ACTION_COLORS**: Colors for move/big gun/conversion rings
- **HEX_COLORS**: Colors for different hex states
- **FOG_OF_WAR_OPACITY**: Fog opacity (default: 0.7)

## Example Modifications

### Make the game easier
```typescript
export const STARTING_ENERGY = 1e+21; // 10x more starting energy
export const MAX_MOVE_DISTANCE = 5; // Move further per turn
export const RING_VISIBILITY_RANGE = 50; // See rings from twice as far
```

### Make the game harder
```typescript
export const STARTING_ENERGY = 2e+20; // Half the starting energy
export const ENERGY_COST_EXPONENT = 6; // More expensive moves
export const SCAN_RANGE_AFTER_MOVE = 0; // Only scan current hex
```

### Change universe density
```typescript
export const SOLAR_SYSTEM_BASE_CHANCE = 0.30; // More systems (30% instead of 15%)
export const STAR_DISTRIBUTION = {
  RED_DWARF: 0.50,    // Fewer red dwarfs
  YELLOW_SUN: 0.30,   // More yellow suns
  WHITE_DWARF: 0.10,  // More white dwarfs
  BLUE_GIANT: 0.10,   // Much more blue giants
};
```

### Speed up information propagation
```typescript
export const RING_EXPANSION_RATE = 5; // Rings expand 5 hexes per turn (instead of 3)
```

## Tips for Balancing

1. **Energy Economy**: The starting energy should allow at least a few exploration moves before requiring conversions
2. **Movement Costs**: The exponential formula creates dramatic differences - small adjustments have big impacts
3. **Universe Density**: Higher density means more opportunities for energy but also more decisions
4. **Star Distribution**: Rare stars should have higher masses to make finding them worthwhile
5. **Ring Speed**: Faster rings reveal information quickly but reduce strategic depth

## Testing Your Changes

After modifying constants:
1. Save the file
2. The dev server will auto-reload
3. Start a new game to see the changes
4. Check that:
   - Starting energy makes sense for game length
   - Universe feels neither too empty nor too crowded
   - Information rings expand at a reasonable pace
   - Star types and masses feel balanced for energy conversion

## Resetting to Defaults

If you want to restore the original values, use Git:
```bash
git checkout src/constants/gameConstants.ts
```
