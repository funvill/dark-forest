import { useGameStore } from '../store/gameStore';
import { universeGenerator } from '../utils/universeGenerator';
import { ringApi } from '../utils/ringApi';
import { ActionType } from '../types/solarSystem';

export const ConversionConfirmationModal = () => {
  const {
    showConversionConfirmation,
    setShowConversionConfirmation,
    shipPosition,
    convertSolarSystem,
    isSolarSystemConverted,
    addInformationRing,
    currentTurn,
    incrementTurn,
    setStatusBarMessage,
  } = useGameStore();

  if (!showConversionConfirmation) return null;

  const solarSystem = universeGenerator.getSolarSystem(shipPosition.q, shipPosition.r);

  const handleCancel = () => {
    setShowConversionConfirmation(false);
  };

  const handleConfirm = () => {
    const solarSystem = universeGenerator.getSolarSystem(shipPosition.q, shipPosition.r);
    if (solarSystem && !isSolarSystemConverted(shipPosition.q, shipPosition.r)) {
      const ring = ringApi.createRing(
        shipPosition,
        currentTurn,
        ActionType.CONVERSION,
        'player',
        'You'
      );
      addInformationRing(ring);
      convertSolarSystem(shipPosition.q, shipPosition.r);
      incrementTurn();
      setStatusBarMessage(`Converted ${solarSystem.name}! Mass: ${solarSystem.mass.toFixed(1)} -> Energy: ${(solarSystem.mass * Math.pow(299792458, 2)).toExponential(2)} J`);
    }
    setShowConversionConfirmation(false);
  };

  if (!solarSystem) return null;

  const energy = (solarSystem.mass * Math.pow(299792458, 2)).toExponential(2);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Confirm Mass-Energy Conversion</h2>
        
        <div className="mb-6 space-y-2">
          <p className="text-gray-300">
            Are you sure you want to convert <span className="text-blue-400 font-semibold">{solarSystem.name}</span>?
          </p>
          <div className="bg-gray-900 p-3 rounded border border-gray-700 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Star Type:</span>
              <span className="text-white">{solarSystem.starType}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Mass:</span>
              <span className="text-white">{solarSystem.mass.toFixed(1)} M☉</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Energy Output:</span>
              <span className="text-green-400 font-semibold">{energy} J</span>
            </div>
          </div>
          <p className="text-yellow-400 text-sm">
            ⚠️ This action will end your turn and cannot be undone.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 rounded font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 rounded font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Convert & End Turn
          </button>
        </div>
      </div>
    </div>
  );
};
