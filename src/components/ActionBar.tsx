import { useGameStore } from '../store/gameStore';
import { universeGenerator } from '../utils/universeGenerator';

export const ActionBar = () => {
  const { 
    isMoveMode, 
    setIsMoveMode, 
    setStatusBarMessage, 
    setCameraPosition, 
    debugMode, 
    setDebugMode,
    shipPosition,
    convertSolarSystem,
    isSolarSystemConverted,
  } = useGameStore();

  const handleMoveClick = () => {
    if (isMoveMode) {
      // Exit move mode
      setIsMoveMode(false);
      setStatusBarMessage('Ready');
    } else {
      // Enter move mode
      setIsMoveMode(true);
      setStatusBarMessage('Select a destination within 3 hexes');
      // Smoothly pan camera to center (0, 0)
      setCameraPosition({ x: 0, y: 0 });
    }
  };

  const handleConvertClick = () => {
    const solarSystem = universeGenerator.getSolarSystem(shipPosition.q, shipPosition.r);
    if (solarSystem && !isSolarSystemConverted(shipPosition.q, shipPosition.r)) {
      convertSolarSystem(shipPosition.q, shipPosition.r);
      setStatusBarMessage(`Converted ${solarSystem.name}! Mass: ${solarSystem.mass.toFixed(1)} -> Energy: ${(solarSystem.mass * Math.pow(299792458, 2)).toExponential(2)} J`);
    }
  };

  // Check if ship is on a solar system
  const solarSystem = universeGenerator.getSolarSystem(shipPosition.q, shipPosition.r);
  const canConvert = solarSystem && !isSolarSystemConverted(shipPosition.q, shipPosition.r);

  return (
    <div className="flex gap-2 px-6 py-2 border-t border-gray-200">
      <button
        onClick={handleMoveClick}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          isMoveMode
            ? 'bg-blue-700 hover:bg-blue-800 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isMoveMode ? 'Cancel Move' : 'Move'}
      </button>
      {canConvert && (
        <button
          onClick={handleConvertClick}
          className="px-4 py-2 rounded font-semibold transition-colors bg-red-600 hover:bg-red-700 text-white"
        >
          Convert System (E=MC²)
        </button>
      )}
      <button
        onClick={() => setDebugMode(!debugMode)}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          debugMode
            ? 'bg-gray-700 hover:bg-gray-800 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
      >
        {debugMode ? 'Debug: ON' : 'Debug: OFF'}
      </button>
    </div>
  );
};
