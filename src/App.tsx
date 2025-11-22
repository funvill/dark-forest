import { useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Header } from './components/Header';
import { HexInfoPanel } from './components/HexInfoPanel';
import { FogOfWar } from './components/FogOfWar';
import { StatusBar } from './components/StatusBar';
import { EnergyBar } from './components/EnergyBar';
import { DebugPanel } from './components/DebugPanel';
import { StartScreen } from './components/StartScreen';
import { MoveConfirmationModal } from './components/MoveConfirmationModal';
import { ConversionConfirmationModal } from './components/ConversionConfirmationModal';
import { BigGunConfirmationModal } from './components/BigGunConfirmationModal';
import { InformationRingDetailsPanel } from './components/InformationRingDetailsPanel';
import { EventsLogPanel } from './components/EventsLogPanel';
import { MapControls } from './components/MapControls';
import { useGameStore } from './store/gameStore';

function App() {
  const { gameStarted, setGameStarted } = useGameStore();

  // Warn user before leaving the page - all game data will be lost
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if game has started
      if (!gameStarted) return;
      
      e.preventDefault();
      // Modern browsers require returnValue to be set
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {!gameStarted && <StartScreen onStartGame={handleStartGame} />}
      <Header />
      <GameCanvas />
      <FogOfWar />
      <HexInfoPanel />
      <InformationRingDetailsPanel />
      <EventsLogPanel />
      <MapControls />
      <DebugPanel />
      <MoveConfirmationModal />
      <ConversionConfirmationModal />
      <BigGunConfirmationModal />
      <div className="fixed bottom-12 right-6 z-[60]">
        <EnergyBar />
      </div>
      <StatusBar />
    </div>
  );
}

export default App;

