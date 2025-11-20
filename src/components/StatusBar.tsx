import { useGameStore } from '../store/gameStore';

export const StatusBar = () => {
  const { statusBarMessage } = useGameStore();

  // Format build date as "2025-Nov-20"
  const formatBuildDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getFullYear()}-${months[date.getMonth()]}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const versionString = `v${__VERSION__} ${formatBuildDate(__BUILD_DATE__)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white text-black px-6 py-2 z-[60] shadow-lg border-t-2 border-gray-300">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{statusBarMessage}</p>
        <p className="text-xs text-gray-600">{versionString}</p>
      </div>
    </div>
  );
};
