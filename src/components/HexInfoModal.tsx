import { useGameStore } from '../store/gameStore';

export const HexInfoModal = () => {
  const { selectedHex, showHexInfo, setShowHexInfo } = useGameStore();

  if (!showHexInfo || !selectedHex) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Hex Information</h2>
        
        <div className="mb-6">
          <p className="text-gray-300">
            <span className="font-semibold">Coordinates:</span> ({selectedHex.q}, {selectedHex.r})
          </p>
          <p className="text-gray-300 mt-2">
            This is placeholder text for hex information. In future versions, this will display 
            detailed information about the selected hex, such as resources, units, or other game data.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowHexInfo(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
