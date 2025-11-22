# 08 - Multiplayer

In the MVP there is only AI bots for other players, in future versions we will be adding the option for human players. I will be refering to the AI bots as players in this document.

## Starting location

The game map is in the same of a hexagon.
The game map is split into 6 equal sections.

When the game stars, the player can choose a location on the map to start from, any hex. There ship is placed on that hex to start.

The other players also place their ships.
All players must place their ship in different sections of the map.

There is always a total of 6 players. You and 5 others.

## AI bot

In the inital version of the game, the AI bots will be very simple rule based actions.

- Always move to the closes star
- If on a star hex, consume it
- If you have enugh energy to move three hex and fire the big gun, fire the big gun at the last known location of any another player
