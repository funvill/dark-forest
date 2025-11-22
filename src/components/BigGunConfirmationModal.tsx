import { useGameStore } from '../store/gameStore';
import { universeGenerator } from '../utils/universeGenerator';
import { ringApi } from '../utils/ringApi';
import { ActionType } from '../types/solarSystem';
import { formatEnergy } from '../utils/energyUtils';
import { BIG_GUN_ENERGY_COST } from '../constants/gameConstants';

export const BigGunConfirmationModal = () => {
  const {
    showBigGunConfirmation,
    bigGunTargetHex,
    shipPosition,
    setShowBigGunConfirmation,
    setIsBigGunMode,
    setStatusBarMessage,
    incrementTurn,
    addInformationRing,
    currentTurn,
    deductEnergy,
    energy,
    addDestroyedHex,
    setBigGunTargetHex,
  } = useGameStore();

  if (!showBigGunConfirmation || !bigGunTargetHex) return null;

  const canAfford = energy >= BIG_GUN_ENERGY_COST;
  const targetSystem = universeGenerator.getSolarSystem(bigGunTargetHex.q, bigGunTargetHex.r);

  const handleConfirm = () => {
    // Deduct energy cost
    if (!deductEnergy(BIG_GUN_ENERGY_COST)) {
      setStatusBarMessage('Not enough energy to fire Big Gun!');
      setShowBigGunConfirmation(false);
      return;
    }
    
    // Create information rings at source and destination
    const sourceRing = ringApi.createRing(
      shipPosition,
      currentTurn,
      ActionType.BIG_GUN,
      'player',
      'You (Big Gun Source)',
      bigGunTargetHex
    );
    addInformationRing(sourceRing);
    
    const destinationRing = ringApi.createRing(
      bigGunTargetHex,
      currentTurn,
      ActionType.BIG_GUN,
      'player',
      'You (Big Gun Destination)',
      shipPosition
    );
    addInformationRing(destinationRing);
    
    // Mark hex as destroyed
    addDestroyedHex({
      q: bigGunTargetHex.q,
      r: bigGunTargetHex.r,
      destroyedTurn: currentTurn,
    });
    
    // If there's a solar system, it's now destroyed (removed from universe)
    if (targetSystem) {
      universeGenerator.destroySolarSystem(bigGunTargetHex.q, bigGunTargetHex.r);
    }
    
    // Increment turn
    incrementTurn();
    
    // Exit Big Gun mode
    setIsBigGunMode(false);
    setBigGunTargetHex(null);
    setShowBigGunConfirmation(false);
    setStatusBarMessage('Big Gun fired!');
  };

  const handleCancel = () => {
    setShowBigGunConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-yellow-500">⚠️ Fire Big Gun</h2>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Target:</span> ({bigGunTargetHex.q}, {bigGunTargetHex.r})
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Energy Cost:</span> <span className={canAfford ? 'text-yellow-400' : 'text-red-400'}>{formatEnergy(BIG_GUN_ENERGY_COST)}</span>
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Current Energy:</span> {formatEnergy(energy)}
          </p>
          {targetSystem && (
            <p className="text-red-400 mt-4 text-sm font-semibold">
              ⚠️ This will destroy the solar system: {targetSystem.name}
            </p>
          )}
          {!canAfford && (
            <p className="text-red-400 mt-4 text-sm font-semibold">
              ⚠️ Not enough energy to fire the Big Gun!
            </p>
          )}
          <p className="text-gray-400 mt-4 text-sm">
            Are you sure you want to fire the Big Gun? This will end your turn.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canAfford}
            className={`${
              canAfford 
                ? 'bg-yellow-600 hover:bg-yellow-700' 
                : 'bg-gray-500 cursor-not-allowed'
            } text-white font-semibold py-2 px-6 rounded transition-colors`}
          >
            Fire Big Gun and End Turn
          </button>
        </div>
      </div>
    </div>
  );
};
