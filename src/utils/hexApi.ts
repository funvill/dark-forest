import type { SolarSystem } from '../types/solarSystem';
import { universeGenerator } from './universeGenerator';

/**
 * Mock API service for fetching hex information
 * In production, this would make actual API calls with authentication tokens
 */

interface HexApiResponse {
  coordinates: { q: number; r: number };
  solarSystem: SolarSystem | null;
  events: Array<{
    description: string;
    turnsAgo: number;
  }>;
  timestamp: number;
}

/**
 * Fetch detailed information about a hex
 * @param q - Q coordinate
 * @param r - R coordinate
 * @param _userToken - Authentication token (unused in MVP)
 * @returns Promise with hex information
 */
export const fetchHexInfo = async (
  q: number, 
  r: number, 
  _userToken?: string
): Promise<HexApiResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // In production, this would be:
  // const response = await fetch(`/api/hex/${q}/${r}`, {
  //   headers: { Authorization: `Bearer ${userToken}` }
  // });
  // return response.json();

  // Mock implementation
  const solarSystem = universeGenerator.getSolarSystem(q, r);
  
  // Generate mock events based on hex coordinates (deterministic)
  const events: Array<{ description: string; turnsAgo: number }> = [];
  const eventSeed = Math.abs(q * 1000 + r);
  
  if (eventSeed % 10 === 0) {
    events.push({
      description: 'Unknown vessel detected in vicinity',
      turnsAgo: Math.floor(eventSeed % 5) + 1,
    });
  }
  
  if (eventSeed % 15 === 0) {
    events.push({
      description: 'Gravitational anomaly recorded',
      turnsAgo: Math.floor(eventSeed % 3) + 2,
    });
  }

  if (solarSystem?.hasLife && eventSeed % 7 === 0) {
    events.push({
      description: 'Radio emissions detected',
      turnsAgo: Math.floor(eventSeed % 8) + 1,
    });
  }

  return {
    coordinates: { q, r },
    solarSystem,
    events,
    timestamp: Date.now(),
  };
};

/**
 * Batch fetch information for multiple hexes
 * @param hexes - Array of hex coordinates
 * @param _userToken - Authentication token
 * @returns Promise with array of hex information
 */
export const fetchMultipleHexInfo = async (
  hexes: Array<{ q: number; r: number }>,
  _userToken?: string
): Promise<HexApiResponse[]> => {
  // In production, this would be a single batched API call
  return Promise.all(hexes.map(hex => fetchHexInfo(hex.q, hex.r, _userToken)));
};
