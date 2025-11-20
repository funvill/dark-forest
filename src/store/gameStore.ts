import { create } from 'zustand';
import type { SolarSystem, InformationRing } from '../types/solarSystem';

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
  zoomLevel: number;
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
  informationRings: InformationRing[];
  selectedRing: InformationRing | null;
  showRingDetails: boolean;
  showEventsLog: boolean;
  setCameraPosition: (position: { x: number; y: number }) => void;
  setZoomLevel: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetCamera: () => void;
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
  addInformationRing: (ring: InformationRing) => void;
  setSelectedRing: (ring: InformationRing | null) => void;
  setShowRingDetails: (show: boolean) => void;
  setShowEventsLog: (show: boolean) => void;
  showConversionConfirmation: boolean;
  setShowConversionConfirmation: (show: boolean) => void;
  getRingsAtTurn: (turn: number) => InformationRing[];
}

export const useGameStore = create<GameState>((set, get) => ({
  cameraPosition: { x: 0, y: 0 },
  zoomLevel: 1.0,
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
  informationRings: [],
  selectedRing: null,
  showRingDetails: false,
  showEventsLog: false,
  showConversionConfirmation: false,
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setZoomLevel: (zoom: number) => set({ zoomLevel: Math.max(0.3, Math.min(3.0, zoom)) }),
  zoomIn: () => set((state) => ({ zoomLevel: Math.min(3.0, state.zoomLevel * 1.2) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(0.3, state.zoomLevel / 1.2) })),
  resetCamera: () => {
    // Ship is always rendered at world coordinate (0, 0) after grid offset
    // So camera should center at (0, 0) to focus on ship
    set({ 
      cameraPosition: { x: 0, y: 0 },
      zoomLevel: 2.0 // Zoom in for better view
    });
  },
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
  addInformationRing: (ring: InformationRing) => set((state) => ({
    informationRings: [...state.informationRings, ring],
  })),
  setSelectedRing: (ring: InformationRing | null) => set({ selectedRing: ring }),
  setShowRingDetails: (show: boolean) => set({ showRingDetails: show }),
  setShowEventsLog: (show: boolean) => set({ showEventsLog: show }),
  setShowConversionConfirmation: (show: boolean) => set({ showConversionConfirmation: show }),
  getRingsAtTurn: (turn: number): InformationRing[] => {
    return get().informationRings.filter(ring => ring.createdTurn <= turn);
  },
}));

