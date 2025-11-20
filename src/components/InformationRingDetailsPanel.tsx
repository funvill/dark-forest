import { useGameStore } from '../store/gameStore';
import { ringApi } from '../utils/ringApi';

export const InformationRingDetailsPanel = () => {
  const { selectedRing, showRingDetails, setShowRingDetails, currentTurn, shipPosition } = useGameStore();

  if (!showRingDetails || !selectedRing) {
    return null;
  }

  const actionName = ringApi.getActionName(selectedRing.actionType);
  const turnsAgo = currentTurn - selectedRing.createdTurn;
  const distance = ringApi.hexDistance(shipPosition, selectedRing.origin);

  const handleClose = () => {
    setShowRingDetails(false);
  };

  return (
    <div className="fixed left-0 top-[80px] bottom-0 w-[300px] bg-gray-900 text-white shadow-2xl z-50 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
        <h2 className="text-lg font-bold">Information Ring</h2>
        <button
          onClick={handleClose}
          className="bg-red-600 hover:bg-red-700 text-white transition-colors p-1.5 rounded flex-shrink-0 ml-2"
          aria-label="Close panel"
          title="Close panel"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Action</p>
          <p className="text-lg text-white font-semibold">{actionName}</p>
        </div>

        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Location</p>
          <p className="font-mono text-lg text-white">({selectedRing.origin.q}, {selectedRing.origin.r})</p>
          <p className="text-sm text-gray-400 mt-2">
            Distance from ship: {distance.toFixed(1)} hexes
          </p>
        </div>

        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Time</p>
          <p className="text-white">
            {turnsAgo} turn{turnsAgo !== 1 ? 's' : ''} ago (Turn {selectedRing.createdTurn})
          </p>
        </div>

        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Triggered By</p>
          <p className="text-white">{selectedRing.playerName}</p>
        </div>

        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Current Ring Radius</p>
          <p className="text-white">{ringApi.getRingRadius(selectedRing, currentTurn)} hexes</p>
        </div>
      </div>
    </div>
  );
};
