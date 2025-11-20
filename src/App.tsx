import { GameCanvas } from './components/GameCanvas';
import { Header } from './components/Header';
import { HexInfoPanel } from './components/HexInfoPanel';
import { FogOfWar } from './components/FogOfWar';
import { StatusBar } from './components/StatusBar';
import { MoveConfirmationModal } from './components/MoveConfirmationModal';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header />
      <GameCanvas />
      <FogOfWar />
      <HexInfoPanel />
      <MoveConfirmationModal />
      <StatusBar />
    </div>
  );
}

export default App;

