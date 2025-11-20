import { GameCanvas } from './components/GameCanvas';
import { Header } from './components/Header';
import { HexInfoPanel } from './components/HexInfoPanel';
import { FogOfWar } from './components/FogOfWar';
import { StatusBar } from './components/StatusBar';
import { MoveConfirmationModal } from './components/MoveConfirmationModal';
import { ConversionConfirmationModal } from './components/ConversionConfirmationModal';
import { InformationRingDetailsPanel } from './components/InformationRingDetailsPanel';
import { EventsLogPanel } from './components/EventsLogPanel';
import { MapControls } from './components/MapControls';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header />
      <GameCanvas />
      <FogOfWar />
      <HexInfoPanel />
      <InformationRingDetailsPanel />
      <EventsLogPanel />
      <MapControls />
      <MoveConfirmationModal />
      <ConversionConfirmationModal />
      <StatusBar />
    </div>
  );
}

export default App;

