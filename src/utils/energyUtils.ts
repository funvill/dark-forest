import { ENERGY_COST_EXPONENT, ENERGY_COST_BASE, SPEED_OF_LIGHT } from '../constants/gameConstants';

/**
 * Calculate the energy cost to move a given distance in hexes
 * Moving 1 hex costs 1.0e+10 J
 * Moving 2 hexes costs 1.0e+15 J
 * Moving 3 hexes costs 1.0e+20 J
 * 
 * Formula: Energy = 10^(ENERGY_COST_EXPONENT * distance + ENERGY_COST_BASE)
 */
export const calculateMoveCost = (distance: number): number => {
  if (distance <= 0) return 0;
  return Math.pow(10, ENERGY_COST_EXPONENT * distance + ENERGY_COST_BASE);
};

/**
 * Calculate energy gained from converting mass to energy
 * Using E=mc² where c = 299,792,458 m/s
 */
export const calculateMassToEnergy = (mass: number): number => {
  return mass * Math.pow(SPEED_OF_LIGHT, 2);
};

/**
 * Format energy value for display with appropriate units
 */
export const formatEnergy = (energy: number): string => {
  if (energy === 0) return '0 J';
  
  const exponent = Math.floor(Math.log10(Math.abs(energy)));
  const mantissa = energy / Math.pow(10, exponent);
  
  return `${mantissa.toFixed(2)}e+${exponent} J`;
};

/**
 * Check if player has enough energy for a move
 */
export const canAffordMove = (currentEnergy: number, distance: number): boolean => {
  return currentEnergy >= calculateMoveCost(distance);
};
