import { useGameStore } from '../store/gameStore';
import { getHexDistance, getHexesInRange } from '../utils/hexUtils';
import { universeGenerator } from '../utils/universeGenerator';
import { ringApi } from '../utils/ringApi';
import { ActionType } from '../types/solarSystem';

export const MoveConfirmationModal = () => {
  const {
    showMoveConfirmation,
    moveTargetHex,
    shipPosition,
    setShowMoveConfirmation,
    setShipPosition,
    setIsMoveMode,
    setStatusBarMessage,
    incrementTurn,
    scanHex,
    addInformationRing,
    currentTurn,
  } = useGameStore();

  if (!showMoveConfirmation || !moveTargetHex) return null;

  const distance = getHexDistance(shipPosition, moveTargetHex);

  const handleConfirm = () => {
    // Create information ring at starting position
    const ring = ringApi.createRing(
      shipPosition,
      currentTurn,
      ActionType.MOVE,
      'player',
      'You'
    );
    addInformationRing(ring);
    
    // Move the ship
    setShipPosition(moveTargetHex);
    
    // Scan hexes within range 1 of new position
    const hexesToScan = getHexesInRange(moveTargetHex, 1);
    hexesToScan.forEach(hex => {
      const solarSystem = universeGenerator.getSolarSystem(hex.q, hex.r);
      scanHex(hex, solarSystem);
    });
    
    // Increment turn
    incrementTurn();
    
    // Exit move mode
    setIsMoveMode(false);
    setShowMoveConfirmation(false);
    setStatusBarMessage('Ready');
  };

  const handleCancel = () => {
    setShowMoveConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Confirm Move</h2>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Destination:</span> ({moveTargetHex.q}, {moveTargetHex.r})
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Distance:</span> {distance} {distance === 1 ? 'hex' : 'hexes'}
          </p>
          <p className="text-gray-400 mt-4 text-sm">
            Are you sure you want to move to this location?
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Move and End Turn
          </button>
        </div>
      </div>
    </div>
  );
};
