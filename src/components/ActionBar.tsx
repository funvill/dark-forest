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
    isSolarSystemConverted,
    setShowEventsLog,
    showEventsLog,
    setShowConversionConfirmation,
    isGameOver,
  } = useGameStore();

  const handleMoveClick = () => {
    if (isGameOver) {
      setStatusBarMessage('Game Over - No energy remaining!');
      return;
    }
    
    if (isMoveMode) {
      // Exit move mode
      setIsMoveMode(false);
      setStatusBarMessage('Ready');
    } else {
      // Enter move mode
      setIsMoveMode(true);
      setStatusBarMessage('Select a destination within 3 hexes');
      // Camera will smoothly pan to ship in GameCanvas.tsx useEffect
    }
  };

  const handleConvertClick = () => {
    if (isGameOver) {
      setStatusBarMessage('Game Over - No energy remaining!');
      return;
    }
    setShowConversionConfirmation(true);
  };

  // Check if ship is on a solar system
  const solarSystem = universeGenerator.getSolarSystem(shipPosition.q, shipPosition.r);
  const canConvert = solarSystem && !isSolarSystemConverted(shipPosition.q, shipPosition.r);

  return (
    <div className="flex gap-2">
      <button
        onClick={handleMoveClick}
        disabled={isGameOver}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          isGameOver
            ? 'bg-gray-400 cursor-not-allowed text-gray-200'
            : isMoveMode
            ? 'bg-blue-700 hover:bg-blue-800 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isMoveMode ? 'Cancel Move' : 'Move'}
      </button>
      {canConvert && (
        <button
          onClick={handleConvertClick}
          disabled={isGameOver}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            isGameOver
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Convert System (E=MC²)
        </button>
      )}
      <button
        onClick={() => setShowEventsLog(!showEventsLog)}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          showEventsLog
            ? 'bg-purple-700 hover:bg-purple-800 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Events Log
      </button>
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
