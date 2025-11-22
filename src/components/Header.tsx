import { ActionBar } from './ActionBar';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white text-black z-[60] shadow-lg border-b-2 border-gray-300">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dark forest</h1>
        <ActionBar />
      </div>
    </header>
  );
};
