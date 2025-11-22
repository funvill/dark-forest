# 07 - Energy

Add a energy resource indicator to the header.
This energy resource increases when you convert a system from mass to energy.

All actions require some amount of energy.

You start the game with enugh energy to fire the big gun and move 6 hexes

If you have less energy then is required to move one hex, its game over

Internally the energy should be small numbers that get converted to J and shown on the screen as J, but internally they are smaler numbers.

Move 1 hex should cost 3 energy units
Move 2 hex should cost 7 energy units
Move 3 hex should cost 15 energy units
Firing the big gun should costs 48 energy units
You should start with 48 + 15 + 7 + 3 energy units

Converting stars should produce
'Red Dwarf': 1-10 energy units
'White Dwarf': 5-15 energy units
'Yellow Sun': 20-50 energy units
'Blue Giant': 60-120 energy units

## UI

We need a way of showing how much energy is required to do the different actions, and how much engery they have stored up.

I was thinking of a bar graph that shows total amount of energy they have. The bar graph should be segments or blocks.

Then overlayed (highlighted sections) within the bar graph is the different costs of each action. Stacked.

*--------------*--------------|--------------|--------------|--------------------------|-----
| Energy death | Move 1 hexes | move 2 hexes | move 3 hexes | Fire the big gun         | .....  
*--------------*--------------|--------------|--------------|--------------------------|-----

Then if the user has more engery then is required to fire the big gun, it fades outs and shows the total at the right side of the bar

