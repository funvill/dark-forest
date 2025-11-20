# 05 - Universe Generation

**Note**: Generation algorithms will be changed and tweaked over time. Implementation should allow for updates and adjustments.

Use a fixed seed for the pseudo random generator.

The universe is filled with solar systems.

Variable 5-15% of hexes should have a solar system based on sector.

Each solar system has a sun and planets that have mass

Some solar systems have more mass than others depending on the type of their sun.

Solar systems have a random chance of having 0-10 planets. (Weighted: 50% chance of 2-4 planets)

Solar systems have a random chance of having passive life forms (flavor text) - 5% of systems (very rare)

Solar systems have names (flavor text)

All solar systems are known to exist by all players at the start of the game.

## Generation

Use the seeded pseudo random generator to generate where the Solar systems are on the map. What kind of star they are, how much mass, if they have life, and their name.

Solar systems are generated on-demand using the hex coordinates and seed. The same seed + coordinates will always generate the same solar system data, ensuring consistency without storing all systems in memory.

**Star Types** (these mass values will be tweaked in the future):
- Red Dwarf: 1-10 mass
- Yellow Sun: 20-50 mass  
- Blue Giant: 100-500 mass
- White Dwarf: 5-15 mass

**Planet Contribution**: Planets don't contribute to mass calculation, only star matters.

**Naming**: Random words from predefined list combined with coordinate-based identifiers (e.g., "Crimson System-0,5")

There should be a solar system approximately every 5 spaces away from each other (average, not strict minimum).

## Starting Conditions

The player's starting hex (0,0) does NOT have a solar system. The story is that the player converted their home system to generate their ship and initial energy.

## Action: Convert

When a player's ship is on a hex with a solar system, they can convert the mass of the solar system into energy using E=MC^2. This is an instant action with no cooldown that provides information to the universe.

The solar system is destroyed immediately.

**Information Propagation** (Future Implementation):
- A ring of information is sent out
- Other players do not know the solar system has been destroyed until the ring of information hits them
- Before the ring reaches them, the solar system still appears normal/unconverted
- Each ring is independent; hexes receive all overlapping ring data

---

## Implementation Questions & Answers

**1. What random number generator library should we use for the seeded pseudo-random generation?**
- **A) seedrandom (npm package - lightweight and reliable)** ✓

**2. What should be the default seed value for universe generation?**
- **A) "darkforest" (easy to remember, game-themed)** ✓

**3. What is the map size/radius for universe generation?**
- **C) Infinite generation on-demand** ✓

**4. How should we implement "1 in 10 hex should have a solar system"?**
- **D) Variable 5-15% based on sector** ✓

**5. What does "5 spaces away from each other" mean in relation to "1 in 10 hex"?**
- **D) 5 hexes is average, not minimum** ✓

**6. What star types should be available for solar systems?**
- **A) Red Dwarf, Yellow Sun, Blue Giant, White Dwarf (classic astronomy)** ✓

**7. How should star type affect mass distribution?**
- **A) Red Dwarf: 1-10, Yellow Sun: 20-50, Blue Giant: 100-500, White Dwarf: 5-15** ✓
- Note: These numbers will be tweaked in the future

**8. What probability distribution for planet count (0-10, "closer to three")?**
- **C) Weighted: 50% chance of 2-4 planets** ✓

**9. How should planet mass contribute to total solar system mass?**
- **C) Planets don't contribute, only star matters** ✓

**10. What probability should passive life forms have?**
- **C) 5% of systems (very rare)** ✓

**11. How should life forms be represented?**
- **A) Flavor text only (string description, no gameplay effect)** ✓

**12. What name generation strategy for solar systems?**
- **B) Random words from predefined list** ✓
- **D) Coordinate-based (e.g., "System-0,5")** ✓
- Implementation: Combine both approaches

**13. How should we store solar system data?**
- **Use the random seed to generate the solar system data on-demand, use the same method for looking up the solar system data** ✓
- No storage needed; regenerate from seed + coordinates

**14. What happens to solar system mass after conversion (E=MC²)?**
- **Future implementation - not included in this version**

**15. What is the information ring propagation speed?**
- **Future implementation - not included in this version**

**16. How should the information ring be visualized?**
- **Future implementation - not included in this version**

**17. What should players see before an information ring reaches them?**
- **A) Solar system still appears normal/unconverted** ✓

**18. Can players convert their starting/home system?**
- **Story: Players converted their home system to generate their ship. There should NOT be a solar system in the starting hex (0,0)** ✓

**19. How should we handle multiple rings overlapping?**
- **A) Each ring is independent, hex receives all overlapping ring data** ✓
- **Future implementation**

**20. Should conversion be instant or take time?**
- **C) Instant with no cooldown** ✓
