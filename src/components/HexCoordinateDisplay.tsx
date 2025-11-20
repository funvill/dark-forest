import { useGameStore } from '../store/gameStore';

export const HexCoordinateDisplay = () => {
  const { hoveredHex } = useGameStore();

  if (!hoveredHex) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-4 py-2 rounded shadow-lg z-40 pointer-events-none">
      <span className="font-mono text-sm">
        ({hoveredHex.q}, {hoveredHex.r})
      </span>
    </div>
  );
};