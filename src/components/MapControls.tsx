import { useGameStore } from '../store/gameStore';

export const MapControls = () => {
  const { zoomIn, zoomOut, resetCamera, zoomLevel } = useGameStore();

  return (
    <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg border-2 border-gray-300 p-2 z-40 flex flex-col gap-2">
      <button
        onClick={zoomIn}
        className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xl transition-colors"
        title="Zoom In"
      >
        +
      </button>
      
      <div className="text-center text-xs text-gray-600 py-1">
        {(zoomLevel * 100).toFixed(0)}%
      </div>
      
      <button
        onClick={zoomOut}
        className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xl transition-colors"
        title="Zoom Out"
      >
        −
      </button>
      
      <div className="border-t border-gray-300 my-1"></div>
      
      <button
        onClick={resetCamera}
        className="w-10 h-10 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded font-bold text-sm transition-colors"
        title="Recenter Map"
      >
        ⌖
      </button>
    </div>
  );
};
