# Hex Info panel

Instead of showing the model dialog for the Hex info, when a user clicks on a hex in the map
Show a panel on the left hand side of the screen 300 pixles wide. This is the Hex info panel
The panel should have a button in the top right to close/hide the panel.

The panel will show information that the user knows about the hex. All information has a age of when it was last updated. See `docs\04-fog-of-war.md` (Age: 6 turns ago)

The information about a hex tile is updated when the users ship travels within 1 space of the hex (Moving past or stopped next to it)

The system should use a API call with the user's token to get the information about this hex. Use a mock API call in MVP.

## Hex Panel information

- The Hexagons coordinates and the distance from the players ship. This is always known and does not have an age.
- The last time this solar system was updated. (Age: 6 turns ago)
- A list of events that happened on this hex, when how long ago they happened. (future, use place holder text)
- If this hex has a solar system or not.
  - If the hex has a solar system then it will display the following information.
    - The solar system's approxmit mass (use place holder text)
    - Flavor text about the solar system. This text has no effect on the game.
      - The solar system name and desigation
      - A rendering of the solar system with all of its planets around the sun
      - How many life forms live in this solar system
