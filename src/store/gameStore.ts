import { create } from 'zustand';
import type { SolarSystem, InformationRing, DestroyedHex } from '../types/solarSystem';
import { 
  STARTING_ENERGY, 
  MINIMUM_ENERGY, 
  STARTING_POSITION, 
  STARTING_TURN, 
  DEBUG_MODE_DEFAULT,
  DEFAULT_ZOOM,
  RESET_CAMERA_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from '../constants/gameConstants';

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
  movementHistory: HexCoordinate[];
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
  addToMovementHistory: (position: HexCoordinate) => void;
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
  isBigGunMode: boolean;
  setIsBigGunMode: (active: boolean) => void;
  bigGunTargetHex: HexCoordinate | null;
  setBigGunTargetHex: (hex: HexCoordinate | null) => void;
  showBigGunConfirmation: boolean;
  setShowBigGunConfirmation: (show: boolean) => void;
  destroyedHexes: DestroyedHex[];
  addDestroyedHex: (hex: DestroyedHex) => void;
  isHexDestroyed: (q: number, r: number) => boolean;
  energy: number;
  addEnergy: (amount: number) => void;
  deductEnergy: (amount: number) => boolean;
  isGameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  cameraPosition: { x: 0, y: 0 },
  zoomLevel: DEFAULT_ZOOM,
  selectedHex: null,
  hoveredHex: null,
  showHexInfo: false,
  isMoveMode: false,
  moveTargetHex: null,
  statusBarMessage: 'Ready',
  shipPosition: STARTING_POSITION,
  movementHistory: [STARTING_POSITION],
  showMoveConfirmation: false,
  debugMode: DEBUG_MODE_DEFAULT,
  convertedSystems: new Set<string>(),
  currentTurn: STARTING_TURN,
  scannedHexes: new Map<string, HexScanData>(),
  informationRings: [],
  selectedRing: null,
  showRingDetails: false,
  showEventsLog: false,
  showConversionConfirmation: false,
  energy: STARTING_ENERGY,
  isGameOver: false,
  isBigGunMode: false,
  bigGunTargetHex: null,
  showBigGunConfirmation: false,
  destroyedHexes: [],
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setZoomLevel: (zoom: number) => set({ zoomLevel: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)) }),
  zoomIn: () => set((state) => ({ zoomLevel: Math.min(MAX_ZOOM, state.zoomLevel * ZOOM_STEP) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(MIN_ZOOM, state.zoomLevel / ZOOM_STEP) })),
  resetCamera: () => {
    // Ship is always rendered at world coordinate (0, 0) after grid offset
    // So camera should center at (0, 0) to focus on ship
    set({ 
      cameraPosition: { x: 0, y: 0 },
      zoomLevel: RESET_CAMERA_ZOOM
    });
  },
  setSelectedHex: (hex) => set({ selectedHex: hex }),
  setHoveredHex: (hex) => set({ hoveredHex: hex }),
  setShowHexInfo: (show) => set({ showHexInfo: show }),
  setIsMoveMode: (active) => set({ isMoveMode: active }),
  setMoveTargetHex: (hex) => set({ moveTargetHex: hex }),
  setStatusBarMessage: (message) => set({ statusBarMessage: message }),
  setShipPosition: (position) => set({ shipPosition: position }),
  addToMovementHistory: (position) => set((state) => ({
    movementHistory: [...state.movementHistory, position]
  })),
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
  addEnergy: (amount: number) => set((state) => ({ energy: state.energy + amount })),
  deductEnergy: (amount: number): boolean => {
    const state = get();
    if (state.energy >= amount) {
      set({ energy: state.energy - amount });
      // Check if game over after deduction (less than 1 hex move)
      if (state.energy - amount < MINIMUM_ENERGY) {
        set({ isGameOver: true });
      }
      return true;
    }
    return false;
  },
  setGameOver: (gameOver: boolean) => set({ isGameOver: gameOver }),
  setIsBigGunMode: (active: boolean) => set({ isBigGunMode: active }),
  setBigGunTargetHex: (hex: HexCoordinate | null) => set({ bigGunTargetHex: hex }),
  setShowBigGunConfirmation: (show: boolean) => set({ showBigGunConfirmation: show }),
  addDestroyedHex: (hex: DestroyedHex) => set((state) => ({
    destroyedHexes: [...state.destroyedHexes, hex],
  })),
  isHexDestroyed: (q: number, r: number): boolean => {
    return get().destroyedHexes.some(hex => hex.q === q && hex.r === r);
  },
}));

