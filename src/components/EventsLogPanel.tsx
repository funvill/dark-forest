import { useGameStore } from '../store/gameStore';
import { ringApi } from '../utils/ringApi';
import type { InformationRing } from '../types/solarSystem';

export const EventsLogPanel = () => {
  const { 
    showEventsLog, 
    setShowEventsLog, 
    informationRings, 
    currentTurn,
    shipPosition,
    setSelectedRing,
    setShowRingDetails,
  } = useGameStore();

  if (!showEventsLog) {
    return null;
  }

  const handleClose = () => {
    setShowEventsLog(false);
  };

  const handleRingClick = (ring: InformationRing) => {
    setSelectedRing(ring);
    setShowRingDetails(true);
    setShowEventsLog(false);
  };

  // Sort rings by most recent first
  const sortedRings = [...informationRings].sort((a, b) => b.createdTurn - a.createdTurn);

  // Filter visible rings (within 25 hex scan range)
  const visibleRings = ringApi.getVisibleRings(sortedRings, shipPosition, 25);

  return (
    <div className="fixed left-0 top-[80px] bottom-0 w-[300px] bg-gray-900 text-white shadow-2xl z-50 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-lg font-bold">Events Log</h2>
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
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        {visibleRings.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No events detected within scan range
          </div>
        ) : (
          <div className="space-y-2">
            {visibleRings.map((ring) => {
              const turnsAgo = currentTurn - ring.createdTurn;
              const actionName = ringApi.getActionName(ring.actionType);
              const color = ringApi.getRingColor(ring.actionType);
              const distance = ringApi.hexDistance(shipPosition, ring.origin);

              return (
                <button
                  key={ring.id}
                  onClick={() => handleRingClick(ring)}
                  className="w-full text-left p-3 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white">{actionName}</div>
                      <div className="text-sm text-gray-300">
                        {turnsAgo} turn{turnsAgo !== 1 ? 's' : ''} ago • Turn {ring.createdTurn}
                      </div>
                      <div className="text-xs text-gray-500">
                        Origin: ({ring.origin.q}, {ring.origin.r}) • {distance.toFixed(1)} hexes away
                      </div>
                      <div className="text-xs text-gray-500">
                        By: {ring.playerName}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-700 bg-gray-800 text-xs text-gray-400">
        Showing {visibleRings.length} of {informationRings.length} total events
        {informationRings.length > visibleRings.length && (
          <div className="mt-1">
            ({informationRings.length - visibleRings.length} events outside scan range)
          </div>
        )}
      </div>
    </div>
  );
};
