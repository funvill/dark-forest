# Dark Forest

A hidden-movement, information-warfare strategy game inspired by the "Dark Forest" hypothesis from The Three-Body Problem.

## Features

- **Hex Grid Map**: Interactive hexagonal grid with infinite panning
- **ThreeJS Rendering**: 3D graphics with orthographic top-down view
- **Ship with Particle Trail**: Rotating ship at center with particle effects
- **Fog of War**: CSS overlay that grays out distant hexes
- **Interactive UI**: Click hexes to view information, hover for highlights
- **React + TypeScript**: Modern web technologies with type safety

## Tech Stack

- **Framework**: React 19 with TypeScript
- **3D Graphics**: ThreeJS (native implementation)
- **Hex Grid Logic**: honeycomb-grid library
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the game in action.

### Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Controls

- **Mouse Drag**: Pan around the map
- **Mouse Hover**: Highlight hexes and see coordinates
- **Mouse Click**: Open hex information dialog

## Project Structure

```
src/
  ├── components/
  │   ├── GameCanvas.tsx    # Main ThreeJS scene
  │   ├── Header.tsx        # Top navigation bar
  │   ├── HexInfoModal.tsx  # Hex details dialog
  │   └── FogOfWar.tsx      # CSS fog overlay
  ├── store/
  │   └── gameStore.ts      # Zustand state management
  ├── App.tsx               # Main app component
  └── index.css             # Global styles
```

## Game Features

### Map

- Hexagonal grid covering the entire window
- ~100px hexagons (50px radius)
- Black background with light gray borders
- Infinite panning in all directions
- Fog of war at 20 hex distance

### Ship

- Located at map coordinate (0, 0)
- Cone-shaped 3D model
- Rotates at 3 RPM
- Particle trail effect

### Interactions

- Hover: Yellow highlight and coordinate display
- Click: Opens information modal
- Drag: Pan camera around the map

## Future Development

See `docs/00-project-vision.md` for the full game vision and planned features.

## License

MIT

