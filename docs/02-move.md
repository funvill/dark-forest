# 02 - Move

Add a status bar to the bottom of the screen. This should be white, and always on top

Add a action bar to the top of the screen, under the header, on top of the map

In the Action bar add a "move" button

When the Move button is pressed

- The map recenters on the players ship (0,0)
- A line is drawn from the center of the players ship to the center of the hex that the mouse is over top of. The line should be under the players ship.
- The line should glow with particles, and be rendered using threejs
- If the line is less then three hex away, the line should glow green. The mouse icon should change to a "Move" icon. This shows the user that they can move there. The status bar should show "Move {$distance} spaces"
- If the line is farther away then three hex the line should glow red and the mouse icon should change to a "X". This shows the user that they can't move there. The status bar should show "Can't move that far. {$distance} spaces"
- If the user is within three hex and they click a hex, a "Are you sure?" Model dialog should pop up. The options are "Cancel", or "Move and end turn"

## Implementation Details - Questions & Answers

1. **Move Mode Toggle**: A) Toggle on/off with same button (button text changes to "Cancel Move")

2. **Move Mode Visual State**: A) Yes, change background color (e.g., blue → darker blue)

3. **Distance Calculation**: A) Straight-line hex distance (Manhattan distance on hex grid)

4. **Line Animation**: B) Dashed/dotted line with particles

5. **Particle Details**: Particles should drift away from the line, and slowly dissipate

6. **Move Range Display**: A) Yes, show all hexes within 3-hex range with green tint

7. **Hex Info Modal**: A) Only show "Are you sure?" dialog (no hex info modal)

8. **Ship Movement Animation**: B) Smoothly animate along the line path

9. **Action Bar Styling**: A) Same white background as header

10. **Status Bar Content**: D) "Ready" or similar status text

11. **Status Bar Height**: C) Minimal height (~40px)

12. **Action Bar Position**: D) Be part of header component

13. **Line Z-Index**: A) Z-position in 3D scene below ship mesh

14. **Move Distance**: A) 1, 2, or 3 hexes (inclusive of 3)

15. **Cursor Icons**: C) Use emoji as cursor

16. **Line Rendering**: C) Follow hex path showing route

17. **Multiple Actions**: A) Yes, design action bar for multiple buttons

18. **Confirmation Dialog**: C) Both destination coordinates and movement cost/distance

19. **After Move**: A) Exit move mode automatically

20. **Camera Recentering**: B) Smooth animated pan to center
