# 01 - Project Setup

## Tech stack

- ThreeJS
- NPM + Vite
- TailwindCSS

## UI

- Map
  - A grid of hexagon that should cover the whole window
  - The hexagon should be about 100px across. A normal screen should show about 20 hexes from one side to the other
  - The background should be black
  - The border should be light gray
  - No zooming in or out
  - The user can pan around the map infanitly in all directions
  - Any hexes that are farther away then 20 from the center are grayed out (fog of war)
  - The hexes use the Hexagons Coordinate System
  - In the center of the map coordinate (0,0). This is your ship
  - On mouse over of a hex
    - The hex border should glow and the background should change to a light yellow
    - The hex coordinate should show at the top of the hex.
  - On mouse click - Show Hex info model dialog
  
- Hexagons Coordinate System
  - Review https://www.redblobgames.com/grids/hexagons/#coordinates
  - Odd-Q
  - The world is cenered around your ship at map coordinate (0,0).

- Hex info model dialog
  - Show the Hexagons Coordinate from the center of the map
  - Have place holder text
  - At the bottom of the dialog, show action buttons.
  - Only action button at this time is "close" that closes the Hex info model dialog.

- Ship
  - At the center of the map coordinate (0,0) show an icon for your ship. Your ship should be slowly rotating around in the hex. 3 RPM
  - The ship should have a partical tail.

- Header
  - At the top of the page add a header bar, this is ontop of the map and is sticky to the top of the screen.
  - Contains the text "Dark forest"
  - The content will be expaned in later versions

## Project Setup Questions & Answers

1. **Framework Choice**
   - Question: Which frontend framework should be used?
   - **Selected Answer: A) React (Recommended for ThreeJS ecosystem)**

2. **Language**
   - Question: Which programming language should be used?
   - **Selected Answer: A) TypeScript (Recommended for maintainability)**

3. **ThreeJS Wrapper**
   - Question: How should ThreeJS be integrated?
   - **Selected Answer: D) Native ThreeJS**

4. **Hex Grid Logic**
   - Question: How to handle hex grid math?
   - **Selected Answer: A) `honeycomb-grid` library (Recommended)**

5. **State Management**
   - Question: How to manage game state?
   - **Selected Answer: A) Zustand (Recommended)**

6. **Styling System**
   - Question: How to handle CSS?
   - **Selected Answer: A) TailwindCSS (Recommended/Required)**

7. **Build Tool**
   - Question: Which build tool?
   - **Selected Answer: A) Vite (Recommended/Required)**

8. **Camera Projection**
   - Question: What camera type for the map?
   - **Selected Answer: A) Orthographic - Top down view**

9. **Fog of War Implementation**
   - Question: How to render the fog of war?
   - **Selected Answer: D) CSS overlay**

10. **Hex Rendering Technique**
    - Question: How to render the grid efficiently?
    - **Selected Answer: A) InstancedMesh (Recommended)**

11. **Ship Asset**
    - Question: What visual to use for the ship?
    - **Selected Answer: A) Simple 3D Primitive (Cone) (Recommended for MVP)**

12. **Ship Animation**
    - Question: How to animate the ship rotation?
    - **Selected Answer: A) `requestAnimationFrame` loop (Recommended)**

13. **Particle System (Ship Tail)**
    - Question: How to render the ship's tail?
    - **Selected Answer: A) ThreeJS Points/ShaderMaterial (Recommended)**

14. **UI Overlay Implementation**
    - Question: How to render the HUD and Dialogs?
    - **Selected Answer: A) HTML/DOM over Canvas (Recommended)**

15. **Input/Interaction**
    - Question: How to detect mouse over hexes?
    - **Selected Answer: A) ThreeJS Raycaster (Recommended)**

16. **Infinite Panning Logic**
    - Question: How to handle infinite map movement?
    - **Selected Answer: A) Update Camera position (Recommended)**

17. **Linting/Formatting**
    - Question: Which code quality tools?
    - **Selected Answer: A) ESLint + Prettier (Recommended)**

18. **Testing Framework**
    - Question: Which testing framework?
    - **Selected Answer: D) None**

19. **Package Manager**
    - Question: Which package manager?
    - **Selected Answer: A) npm (Recommended/Required)**

20. **Deployment Target**
    - Question: Where to deploy?
    - **Selected Answer: C) GitHub Pages**


