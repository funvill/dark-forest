# 04 - Information ring

Firing the “Big Gun”, or “Perfect mass to energy conversation” of a solar system, or moving the “Generation ship” causes the information rings to be sent out in every direction at the speed of light. When the "Information rings” passes over another species generation ship they can tell the following information. What action was taken, The location of where the action was triggered, and how long ago the action occurred, who triggered the action.

For example, when the user moves their ship a information ring is created at the starting location of the move. Then every subsequent turn the ring expands outwards 3 hex in all directions.

The user can click the ring to bring up the "Information ring" details panel.

"Information ring" details panel show in the same place as the hex information panel. if the hex information panel is already open its closed before the "Information ring" details panel shown and vise verus.

## "Information ring" details panel

Shows

- What action was taken
- The location of where the action was triggered
- How long ago the action occurred (in turns)
- Who triggered the action.

---

## Implementation Details - Questions & Answers

1. **Ring Visual Representation**: How should the information ring be visually rendered?
   **Answer: A** - Circular outline with glowing particles provides clear visual feedback and matches sci-fi aesthetic

2. **Ring Expansion Rate**: How many hexes should the ring expand per turn?
   **Answer: A** - 3 hexes per turn represents "speed of light" information propagation and maintains consistency

3. **Ring Persistence**: How long should information rings remain visible?
   **Answer: D (25 tiles away)** - Only visible when within player's scan range (25 tiles away)

4. **Multiple Overlapping Rings**: What happens when multiple rings overlap at the same location?
   **Answer: B** - Only show the most recent ring to reduce visual clutter

5. **Ring Color Coding**: Should different action types have different colored rings?
   **Answer: A** - Quick visual identification of event types at a glance improves UX

6. **Ring Opacity**: Should ring opacity change as they age?
   **Answer: B** - Maintain constant opacity for consistent visibility

7. **Ring Click Interaction**: How should clicking on a ring work?
   **Answer: A** - Simple, direct interaction matches hex clicking behavior for consistency

8. **Ring Details Panel Close Behavior**: What happens when clicking another hex or ring?
   **Answer: B** - Keep panel open but update content for smoother interaction

9. **Ring Storage in Game State**: How should rings be stored in the game state?
   **Answer: Use Mock API with simple array** - Array-based storage accessed through mock API layer

10. **Ring Detection Hit Area**: How large should the clickable area be for thin rings?
   **Answer: D** - Only visible portion of ring particles for precise interaction

11. **Ring Rendering Performance**: How to handle many rings (50+) in scene?
   **Answer: A** - Maintains performance while preserving all historical information

12. **Ring and Fog of War Interaction**: Should rings be visible in unexplored areas?
   **Answer: D** - Dim/ghosted in unexplored areas to balance information and fog of war

13. **Ring Origin Marker**: Should the origin point of the ring be marked?
   **Answer: A** - Clear visual reference for action location, especially for large expanded rings

14. **Details Panel Location Display**: How should location be formatted?
   **Answer: A** - Provides navigation reference and context for player decision-making

15. **Player Identification**: What information should identify "who" triggered action?
   **Answer: B** - Just "You" or "Other" for simple single-player implementation

16. **Ring Animation Style**: How should the expanding animation look?
   **Answer: C** - Pulse/wave effect from center for distinctive visual impact

17. **Details Panel Action Buttons**: Should panel include action buttons?
   **Answer: B** - No action buttons, info only to keep panel simple

18. **Ring Z-Index/Layering**: What should the render order be?
   **Answer: A** - Maintains visual hierarchy while keeping rings clearly visible

19. **Historical Event Log**: Should there be a separate panel listing all detected rings?
   **Answer: A** - Provides strategic overview and complements individual ring inspection

20. **Turn Counter Display**: In details panel, how should "turns ago" be displayed?
   **Answer: A** - Both relative and absolute time helps players track event timeline
