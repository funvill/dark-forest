import { GameCanvas } from './components/GameCanvas';
import { Header } from './components/Header';
import { HexInfoPanel } from './components/HexInfoPanel';
import { FogOfWar } from './components/FogOfWar';
import { StatusBar } from './components/StatusBar';
import { EnergyBar } from './components/EnergyBar';
import { MoveConfirmationModal } from './components/MoveConfirmationModal';
import { ConversionConfirmationModal } from './components/ConversionConfirmationModal';
import { BigGunConfirmationModal } from './components/BigGunConfirmationModal';
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
      <BigGunConfirmationModal />
      <div className="fixed bottom-12 right-6 z-[60]">
        <EnergyBar />
      </div>
      <StatusBar />
    </div>
  );
}

export default App;

