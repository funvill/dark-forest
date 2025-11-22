# 06 - Big Gun

This is the main weapon in the game.

The "Big Gun" can take a very small amount of mass and transport it instantaneously across the universe. When the mass arrives at the other side it destroys anything within that hex. To operate the "Big Gun" a very large amount of energy is required.

## Feature Requirements

- Add a "Fire Big Gun" button to the action menu
- When clicked, the user can select any Hex on the map (unlimited range), when they do a "are you sure?" dialog is shown with the buttons "Cancel", "Fire big gun and End Turn".
- Two information rings are created, one at the destination, and another at the source. The information ring shows what ring is the "Big Gun Destination", and the "Big Gun Source".
- The destination hex's background should be changed to a light semi transparent red background (30% opacity).
- The user can no longer move into the destination hex.
- If there are any stars in the destination hex they are destroyed and removed (no mass-to-energy conversion).
- The "Big gun" information rings should be golden in color (#ffaa00).
- Firing the Big Gun automatically ends the player's turn (consistent with all other actions).

## Game Balance

- **Energy Cost**: 48 energy units
- **Range**: Unlimited - can target any hex across the universe
- **Turn Ending**: Yes, automatically ends turn after firing
- **Star Destruction**: Stars are removed but not converted to energy
- **Life Destruction**: No special handling, destroys everything in the hex
- **Visual Feedback**: Red overlay at 30% opacity on destination hex
