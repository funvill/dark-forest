import { ActionBar } from './ActionBar';
import { useGameStore } from '../store/gameStore';
import { formatEnergy } from '../utils/energyUtils';
import { LOW_ENERGY_THRESHOLD } from '../constants/gameConstants';

export const Header = () => {
  const { energy, isGameOver } = useGameStore();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white text-black z-[60] shadow-lg border-b-2 border-gray-300">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">Dark forest</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg border-2 border-blue-300">
            <span className="text-lg font-semibold text-blue-800">⚡</span>
            <div className="flex flex-col">
              <span className="text-xs text-blue-600 font-medium">Energy</span>
              <span className={`text-sm font-bold ${
                isGameOver ? 'text-red-600' : energy < LOW_ENERGY_THRESHOLD ? 'text-orange-600' : 'text-blue-800'
              }`}>
                {formatEnergy(energy)}
              </span>
            </div>
          </div>
          {isGameOver && (
            <div className="px-4 py-2 bg-red-100 rounded-lg border-2 border-red-300">
              <span className="text-red-800 font-bold">GAME OVER</span>
            </div>
          )}
        </div>
        <ActionBar />
      </div>
    </header>
  );
};
