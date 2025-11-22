import { useGameStore } from '../store/gameStore';
import { BIG_GUN_ENERGY_COST } from '../constants/gameConstants';

export const DebugPanel = () => {
  const { 
    debugMode,
    addEnergy,
    showInformationRings,
    setShowInformationRings,
  } = useGameStore();

  if (!debugMode) return null;

  const handleFillEnergy = () => {
    // Add enough energy to fire the big gun (48 units) plus some extra
    addEnergy(100);
  };

  return (
    <div className="fixed right-6 top-24 z-[50] bg-gray-900 text-white p-4 rounded-lg shadow-xl border-2 border-yellow-500 min-w-[250px]">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-yellow-500">
        <span className="text-xl">🐛</span>
        <h3 className="text-lg font-bold text-yellow-400">Debug Panel</h3>
      </div>
      
      <div className="space-y-4">
        {/* Information Rings Toggle */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded">
            <input
              type="checkbox"
              checked={showInformationRings}
              onChange={(e) => setShowInformationRings(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Show Information Rings</span>
          </label>
        </div>

        {/* Energy Controls */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-400 uppercase">Energy</h4>
          <button
            onClick={handleFillEnergy}
            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors text-sm"
          >
            + 100 Energy
          </button>
          <div className="text-xs text-gray-400 text-center">
            (Big Gun costs {BIG_GUN_ENERGY_COST} units)
          </div>
        </div>

        {/* Additional Debug Info */}
        <div className="pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            <div>Debug mode active</div>
            <div>Press 'D' to toggle panel</div>
          </div>
        </div>
      </div>
    </div>
  );
};
