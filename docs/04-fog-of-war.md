# 04 - Fog of War

## Information age

All information in this game has a age that is shown in turn ago when it was last updated (Age: 6 turns).

A hexigon information is update when the ship is one space away from the hex.

A user can use a prob/ping to find out information about a far away hex (future)

## Information rings

When a user preforms a action (like move), the information about their action is sent out into the universe in all directions. This is shown as a ring leaving the hex that the action was preformed in. Every turn the ring of information continues outwards getting larger

A user only recives this information when the information ring hits their ship.

The ring of information should be clickable, when the user clicks this ring. Show information about the event/action in the same place as the Hex info panel.

The informaiton rings should expand out into the universe at the "speed of light" (three hex per turn)

### Information Details

When a user views the information details they are shown a panel with the following details.

- The user_token that generated this information
- The age of this information
- The aciton that was taken
