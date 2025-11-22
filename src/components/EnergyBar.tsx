import { useGameStore } from '../store/gameStore';
import { formatEnergy } from '../utils/energyUtils';
import { MOVE_COSTS, BIG_GUN_ENERGY_COST, MINIMUM_ENERGY } from '../constants/gameConstants';

export const EnergyBar = () => {
  const { energy, isGameOver } = useGameStore();

  // Calculate the segments for the bar
  const segments = [
    { label: 'Death', cost: MINIMUM_ENERGY, color: 'bg-red-600', position: 0 },
    { label: '1 hex', cost: MOVE_COSTS[1], color: 'bg-blue-400', position: MINIMUM_ENERGY },
    { label: '2 hex', cost: MOVE_COSTS[2], color: 'bg-blue-500', position: MINIMUM_ENERGY + MOVE_COSTS[1] },
    { label: '3 hex', cost: MOVE_COSTS[3], color: 'bg-blue-600', position: MINIMUM_ENERGY + MOVE_COSTS[1] + MOVE_COSTS[2] },
    { label: 'Big Gun', cost: BIG_GUN_ENERGY_COST, color: 'bg-orange-500', position: MINIMUM_ENERGY + MOVE_COSTS[1] + MOVE_COSTS[2] + MOVE_COSTS[3] },
  ];

  // Total energy needed to show all segments
  const totalSegmentEnergy = segments.reduce((sum, seg) => sum + seg.cost, 0);
  
  // Determine the bar's display range
  const displayMax = Math.max(totalSegmentEnergy, energy);
  
  // Calculate percentage widths
  const getSegmentWidth = (cost: number) => {
    return (cost / displayMax) * 100;
  };

  const getEnergyWidth = () => {
    return Math.min((energy / displayMax) * 100, 100);
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-3 bg-gray-900 rounded-lg border-2 border-gray-700 min-w-[400px] shadow-xl">
      {/* Title and current energy */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-yellow-400">⚡</span>
          <span className="text-sm font-semibold text-gray-300">Energy</span>
        </div>
        <span className={`text-sm font-bold ${
          isGameOver ? 'text-red-400' : energy < MOVE_COSTS[2] ? 'text-orange-400' : 'text-green-400'
        }`}>
          {formatEnergy(energy)}
        </span>
      </div>

      {/* Energy bar visualization */}
      <div className="relative h-8 bg-gray-800 rounded overflow-hidden border border-gray-600">
        {/* Segment backgrounds (cost indicators) */}
        <div className="absolute inset-0 flex">
          {segments.map((segment) => {
            return (
              <div
                key={segment.label}
                className={`${segment.color} opacity-30 border-r border-gray-700`}
                style={{ width: `${getSegmentWidth(segment.cost)}%` }}
              />
            );
          })}
          {/* Faded area for energy beyond segments */}
          {energy > totalSegmentEnergy && (
            <div 
              className="bg-green-600 opacity-20"
              style={{ width: `${((energy - totalSegmentEnergy) / displayMax) * 100}%` }}
            />
          )}
        </div>

        {/* Current energy level indicator */}
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-300 ${
            isGameOver ? 'bg-red-500' : energy < MOVE_COSTS[2] ? 'bg-orange-500' : 'bg-green-500'
          } opacity-70`}
          style={{ width: `${getEnergyWidth()}%` }}
        />

        {/* Segment labels */}
        <div className="absolute inset-0 flex items-center text-xs font-semibold">
          {segments.map((segment, idx) => {
            const segmentWidth = getSegmentWidth(segment.cost);
            const canAfford = energy >= segments.slice(0, idx + 1).reduce((sum, seg) => sum + seg.cost, 0);
            
            return (
              <div
                key={segment.label}
                className={`flex items-center justify-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] ${
                  !canAfford ? 'opacity-50' : ''
                }`}
                style={{ 
                  width: `${segmentWidth}%`,
                  marginLeft: idx === 0 ? '0' : '0',
                }}
              >
                {segmentWidth > 8 && segment.label}
              </div>
            );
          })}
        </div>

        {/* Energy value at the end if beyond all segments */}
        {energy > totalSegmentEnergy && (
          <div 
            className="absolute top-0 right-2 h-full flex items-center text-xs font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {energy.toFixed(0)} units
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-xs text-gray-400 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-600 opacity-50 rounded"></div>
          <span>Min ({MINIMUM_ENERGY}u)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 opacity-50 rounded"></div>
          <span>Move ({MOVE_COSTS[1]}/{MOVE_COSTS[2]}/{MOVE_COSTS[3]}u)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 opacity-50 rounded"></div>
          <span>Gun ({BIG_GUN_ENERGY_COST}u)</span>
        </div>
      </div>

      {isGameOver && (
        <div className="text-center text-red-400 font-bold text-sm animate-pulse">
          INSUFFICIENT ENERGY - GAME OVER
        </div>
      )}
    </div>
  );
};
