import type { InformationRing, ActionType, HexCoordinate } from '../types/solarSystem';
import { 
  RING_EXPANSION_RATE, 
  RING_VISIBILITY_RANGE, 
  RING_DETECTION_TOLERANCE,
  ACTION_COLORS,
} from '../constants/gameConstants';

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
    return turnsSinceCreation * RING_EXPANSION_RATE;
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
        return ACTION_COLORS.MOVE;
      case 'big_gun':
        return ACTION_COLORS.BIG_GUN;
      case 'conversion':
        return ACTION_COLORS.CONVERSION;
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
    scanRange: number = RING_VISIBILITY_RANGE
  ): boolean {
    // Calculate distance from ship to ring origin
    const distanceToOrigin = this.hexDistance(shipPosition, ring.origin);
    
    // Ring is only visible if within scan range
    if (distanceToOrigin > scanRange) {
      return false;
    }

    const ringRadius = this.getRingRadius(ring, currentTurn);
    const distanceFromOrigin = this.hexDistance(point, ring.origin);
    
    // Check if point is on the ring (within particle tolerance)
    // Only detect the visible particles, not the entire ring
    return Math.abs(distanceFromOrigin - ringRadius) <= RING_DETECTION_TOLERANCE;
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
  isRingVisible(ring: InformationRing, shipPosition: HexCoordinate, scanRange: number = RING_VISIBILITY_RANGE): boolean {
    const distanceToOrigin = this.hexDistance(shipPosition, ring.origin);
    return distanceToOrigin <= scanRange;
  }

  /**
   * Get all rings visible from current position
   */
  getVisibleRings(rings: InformationRing[], shipPosition: HexCoordinate, scanRange: number = RING_VISIBILITY_RANGE): InformationRing[] {
    return rings.filter(ring => this.isRingVisible(ring, shipPosition, scanRange));
  }
}

export const ringApi = new RingApi();
