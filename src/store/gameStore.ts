import { create } from 'zustand';
import type { SolarSystem } from '../types/solarSystem';

interface HexCoordinate {
  q: number;
  r: number;
}

// Information about a scanned hex
interface HexScanData {
  coordinates: HexCoordinate;
  lastScanned: number; // Turn number when last scanned
  solarSystem: SolarSystem | null;
  events: Array<{
    description: string;
    turnsAgo: number;
  }>;
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
  currentTurn: number;
  scannedHexes: Map<string, HexScanData>;
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
  incrementTurn: () => void;
  scanHex: (hex: HexCoordinate, solarSystem: SolarSystem | null) => void;
  getHexScanData: (hex: HexCoordinate) => HexScanData | null;
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
  currentTurn: 0,
  scannedHexes: new Map<string, HexScanData>(),
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
  incrementTurn: () => set((state) => ({ currentTurn: state.currentTurn + 1 })),
  scanHex: (hex: HexCoordinate, solarSystem: SolarSystem | null) => set((state) => {
    const key = `${hex.q},${hex.r}`;
    const newScannedHexes = new Map(state.scannedHexes);
    newScannedHexes.set(key, {
      coordinates: hex,
      lastScanned: state.currentTurn,
      solarSystem,
      events: [], // Will be populated by mock API later
    });
    return { scannedHexes: newScannedHexes };
  }),
  getHexScanData: (hex: HexCoordinate): HexScanData | null => {
    const key = `${hex.q},${hex.r}`;
    return get().scannedHexes.get(key) || null;
  },
}));

