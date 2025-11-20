import { useGameStore } from '../store/gameStore';

export const StatusBar = () => {
  const { statusBarMessage } = useGameStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white text-black px-6 py-2 z-[60] shadow-lg border-t-2 border-gray-300">
      <p className="text-sm font-medium">{statusBarMessage}</p>
    </div>
  );
};
