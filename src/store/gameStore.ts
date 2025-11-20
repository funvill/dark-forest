import { create } from 'zustand';

interface HexCoordinate {
  q: number;
  r: number;
}

interface GameState {
  cameraPosition: { x: number; y: number };
  selectedHex: HexCoordinate | null;
  hoveredHex: HexCoordinate | null;
  showHexInfo: boolean;
  isMoveMode: boolean;
  moveTargetHex: HexCoordinate | null;
  statusBarMessage: string;
  shipPosition: HexCoordinate;
  showMoveConfirmation: boolean;
  debugMode: boolean;
  convertedSystems: Set<string>;
  setCameraPosition: (position: { x: number; y: number }) => void;
  setSelectedHex: (hex: HexCoordinate | null) => void;
  setHoveredHex: (hex: HexCoordinate | null) => void;
  setShowHexInfo: (show: boolean) => void;
  setIsMoveMode: (active: boolean) => void;
  setMoveTargetHex: (hex: HexCoordinate | null) => void;
  setStatusBarMessage: (message: string) => void;
  setShipPosition: (position: HexCoordinate) => void;
  setShowMoveConfirmation: (show: boolean) => void;
  setDebugMode: (enabled: boolean) => void;
  convertSolarSystem: (q: number, r: number) => void;
  isSolarSystemConverted: (q: number, r: number) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  cameraPosition: { x: 0, y: 0 },
  selectedHex: null,
  hoveredHex: null,
  showHexInfo: false,
  isMoveMode: false,
  moveTargetHex: null,
  statusBarMessage: 'Ready',
  shipPosition: { q: 0, r: 0 },
  showMoveConfirmation: false,
  debugMode: false,
  convertedSystems: new Set<string>(),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setSelectedHex: (hex) => set({ selectedHex: hex }),
  setHoveredHex: (hex) => set({ hoveredHex: hex }),
  setShowHexInfo: (show) => set({ showHexInfo: show }),
  setIsMoveMode: (active) => set({ isMoveMode: active }),
  setMoveTargetHex: (hex) => set({ moveTargetHex: hex }),
  setStatusBarMessage: (message) => set({ statusBarMessage: message }),
  setShipPosition: (position) => set({ shipPosition: position }),
  setShowMoveConfirmation: (show) => set({ showMoveConfirmation: show }),
  setDebugMode: (enabled) => set({ debugMode: enabled }),
  convertSolarSystem: (q, r) => set((state) => {
    const newConverted = new Set(state.convertedSystems);
    newConverted.add(`${q},${r}`);
    return { convertedSystems: newConverted };
  }),
  isSolarSystemConverted: (q: number, r: number): boolean => {
    return get().convertedSystems.has(`${q},${r}`);
  },
}));

