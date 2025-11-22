import { MOVE_COSTS, BIG_GUN_ENERGY_COST } from '../constants/gameConstants';

/**
 * Calculate the energy cost to move a given distance in hexes
 * Moving 1 hex costs 3 units
 * Moving 2 hexes costs 7 units
 * Moving 3 hexes costs 15 units
 */
export const calculateMoveCost = (distance: number): number => {
  if (distance <= 0) return 0;
  if (distance > 3) return MOVE_COSTS[3]; // Cap at 3 hex cost
  return MOVE_COSTS[distance as keyof typeof MOVE_COSTS] || 0;
};

/**
 * Convert internal energy units to Joules for display
 * Uses exponential scaling for dramatic visual effect
 */
export const energyUnitsToJoules = (units: number): number => {
  // Scale: 1 unit = 1e18 J, giving us nice e+18 to e+20 range for display
  return units * 1e18;
};

/**
 * Format energy value for display with Joules
 * Internal units are converted to Joules for display
 */
export const formatEnergy = (energy: number): string => {
  if (energy === 0) return '0 J';
  
  const joules = energyUnitsToJoules(energy);
  const exponent = Math.floor(Math.log10(Math.abs(joules)));
  const mantissa = joules / Math.pow(10, exponent);
  
  return `${mantissa.toFixed(2)}e+${exponent} J`;
};

/**
 * Check if player has enough energy for a move
 */
export const canAffordMove = (currentEnergy: number, distance: number): boolean => {
  return currentEnergy >= calculateMoveCost(distance);
};

/**
 * Get energy cost for big gun
 */
export const getBigGunCost = (): number => {
  return BIG_GUN_ENERGY_COST;
};
