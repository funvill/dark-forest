import type { InformationRing, ActionType, HexCoordinate } from '../types/solarSystem';

/**
 * Mock API for Information Ring operations
 * Uses simple array-based storage
 */
class RingApi {
  createRing(
    origin: HexCoordinate,
    createdTurn: number,
    actionType: ActionType,
    playerId: string = 'player',
    playerName: string = 'You'
  ): InformationRing {
    return {
      id: `ring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      origin,
      createdTurn,
      actionType,
      playerId,
      playerName,
    };
  }

  /**
   * Calculate the current radius of a ring in hexes
   */
  getRingRadius(ring: InformationRing, currentTurn: number): number {
    const turnsSinceCreation = currentTurn - ring.createdTurn;
    return turnsSinceCreation * 3; // 3 hexes per turn
  }

  /**
   * Get the action type display name
   */
  getActionName(actionType: ActionType): string {
    switch (actionType) {
      case 'move':
        return 'Ship Movement';
      case 'big_gun':
        return 'Big Gun Fired';
      case 'conversion':
        return 'Mass-Energy Conversion';
      default:
        return 'Unknown Action';
    }
  }

  /**
   * Get the color for a ring based on action type
   */
  getRingColor(actionType: ActionType): string {
    switch (actionType) {
      case 'move':
        return '#3b82f6'; // blue
      case 'big_gun':
        return '#f97316'; // orange
      case 'conversion':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  /**
   * Check if a point is near a ring (within detection tolerance)
   */
  isPointNearRing(
    point: HexCoordinate,
    ring: InformationRing,
    currentTurn: number,
    shipPosition: HexCoordinate,
    scanRange: number = 25
  ): boolean {
    // Calculate distance from ship to ring origin
    const distanceToOrigin = this.hexDistance(shipPosition, ring.origin);
    
    // Ring is only visible if within scan range (25 tiles)
    if (distanceToOrigin > scanRange) {
      return false;
    }

    const ringRadius = this.getRingRadius(ring, currentTurn);
    const distanceFromOrigin = this.hexDistance(point, ring.origin);
    
    // Check if point is on the ring (within particle tolerance)
    // Only detect the visible particles, not the entire ring
    const tolerance = 0.5; // Half a hex tolerance
    return Math.abs(distanceFromOrigin - ringRadius) <= tolerance;
  }

  /**
   * Calculate hex distance (Manhattan distance on hex grid)
   */
  hexDistance(a: HexCoordinate, b: HexCoordinate): number {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
  }

  /**
   * Check if a ring is visible (within scan range from ship)
   */
  isRingVisible(ring: InformationRing, shipPosition: HexCoordinate, scanRange: number = 25): boolean {
    const distanceToOrigin = this.hexDistance(shipPosition, ring.origin);
    return distanceToOrigin <= scanRange;
  }

  /**
   * Get all rings visible from current position
   */
  getVisibleRings(rings: InformationRing[], shipPosition: HexCoordinate, scanRange: number = 25): InformationRing[] {
    return rings.filter(ring => this.isRingVisible(ring, shipPosition, scanRange));
  }
}

export const ringApi = new RingApi();
