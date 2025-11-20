import { useGameStore } from '../store/gameStore';
import { getHexDistance } from '../utils/hexUtils';
import { universeGenerator } from '../utils/universeGenerator';
import { ringApi } from '../utils/ringApi';

export const HexInfoPanel = () => {
  const { 
    selectedHex, 
    showHexInfo, 
    setShowHexInfo, 
    shipPosition,
    currentTurn,
    getHexScanData,
    informationRings,
  } = useGameStore();

  if (!showHexInfo || !selectedHex) return null;

  const distance = getHexDistance(selectedHex, shipPosition);
  const scanData = getHexScanData(selectedHex);
  const solarSystem = universeGenerator.getSolarSystem(selectedHex.q, selectedHex.r);
  
  // Find rings that originated from this hex
  const ringsAtHex = informationRings.filter(
    ring => ring.origin.q === selectedHex.q && ring.origin.r === selectedHex.r
  );
  
  // Calculate age in turns
  const turnsAgo = scanData ? currentTurn - scanData.lastScanned : null;
  const ageText = turnsAgo !== null 
    ? turnsAgo === 0 
      ? 'Current turn' 
      : `${turnsAgo} turn${turnsAgo > 1 ? 's' : ''} ago`
    : 'Never scanned';

  return (
    <div className="fixed left-0 top-[80px] bottom-0 w-[300px] bg-gray-900 text-white shadow-2xl z-50 overflow-y-auto">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
        <h2 className="text-lg font-bold">Hex Information</h2>
        <button
          onClick={() => setShowHexInfo(false)}
          className="bg-red-600 hover:bg-red-700 text-white transition-colors p-1.5 rounded flex-shrink-0 ml-2"
          aria-label="Close panel"
          title="Close panel"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Coordinates and Distance - Always known */}
        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Coordinates</p>
          <p className="font-mono text-lg">({selectedHex.q}, {selectedHex.r})</p>
          <p className="text-sm text-gray-400 mt-2">Distance from ship</p>
          <p className="font-mono">{distance} lightyear{distance !== 1 ? 's' : ''} ({distance} hex{distance !== 1 ? 'es' : ''})</p>
        </div>

        {/* Last Scan Information */}
        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Last Scanned</p>
          <p className={turnsAgo === null ? 'text-red-400' : 'text-green-400'}>
            {ageText}
          </p>
        </div>

        {/* Information Rings originated from this hex - Only show if there's a solar system */}
        {solarSystem && ringsAtHex.length > 0 && (
          <div className="bg-gray-800 p-3 rounded border border-purple-600">
            <p className="text-sm text-gray-400 mb-2">Events at this Location</p>
            <div className="space-y-2">
              {ringsAtHex.map((ring) => {
                const turnsAgo = currentTurn - ring.createdTurn;
                const actionName = ringApi.getActionName(ring.actionType);
                const color = ringApi.getRingColor(ring.actionType);
                
                return (
                  <div key={ring.id} className="flex items-start gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <div className="text-white font-semibold">{actionName}</div>
                      <div className="text-gray-400 text-xs">
                        {turnsAgo} turn{turnsAgo !== 1 ? 's' : ''} ago • Turn {ring.createdTurn}
                      </div>
                      <div className="text-gray-500 text-xs">
                        By: {ring.playerName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Solar System Information */}
        {solarSystem ? (
          <>
            {scanData === null && (
              <div className="bg-gray-800 p-3 rounded border border-yellow-600">
                <p className="text-yellow-400">⚠ Hex not yet scanned</p>
                <p className="text-sm text-gray-400 mt-1">
                  Long-range sensors detect anomaly. Move within 1 hex to scan.
                </p>
              </div>
            )}
          <div className="bg-gray-800 p-3 rounded border border-blue-600">
            <p className="text-sm text-gray-400 mb-2">Solar System Detected</p>
            
            {/* System Name and Designation */}
            <h3 className="text-xl font-bold text-blue-400 mb-3">{solarSystem.name}</h3>
            
            {/* Star Type and Mass */}
            <div className="space-y-2 mb-3">
              <div>
                <span className="text-sm text-gray-400">Star Type: </span>
                <span className="text-white">{solarSystem.starType}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Approx. Mass: </span>
                <span className="text-white font-mono">{solarSystem.mass.toFixed(1)} M☉</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Planets: </span>
                <span className="text-white">{solarSystem.planetCount}</span>
              </div>
            </div>

            {/* Simple Solar System Visualization */}
            <div className="bg-black p-4 rounded mb-3 flex items-center justify-center">
              <div className="relative flex items-center gap-1">
                {/* Star */}
                <div 
                  className={`rounded-full ${
                    solarSystem.starType === 'Red Dwarf' ? 'bg-red-500' :
                    solarSystem.starType === 'Yellow Sun' ? 'bg-yellow-400' :
                    solarSystem.starType === 'Blue Giant' ? 'bg-blue-400' :
                    'bg-gray-300'
                  }`}
                  style={{ 
                    width: solarSystem.starType === 'Blue Giant' ? '24px' : 
                           solarSystem.starType === 'Yellow Sun' ? '16px' : '12px',
                    height: solarSystem.starType === 'Blue Giant' ? '24px' : 
                            solarSystem.starType === 'Yellow Sun' ? '16px' : '12px',
                  }}
                />
                {/* Planets */}
                {Array.from({ length: Math.min(solarSystem.planetCount, 8) }).map((_, i) => (
                  <div 
                    key={i}
                    className="rounded-full bg-gray-600"
                    style={{ 
                      width: '6px', 
                      height: '6px',
                      marginLeft: i === 0 ? '8px' : '4px',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Life Information */}
            {solarSystem.hasLife && (
              <div className="bg-green-900/30 border border-green-700 p-3 rounded">
                <p className="text-green-400 font-semibold mb-1">🌿 Life Detected</p>
                <p className="text-sm text-gray-300">{solarSystem.lifeDescription}</p>
              </div>
            )}

            {/* Flavor Text */}
            <div className="mt-3 text-xs text-gray-400 italic">
              <p>
                This {solarSystem.starType.toLowerCase()} system contains {solarSystem.planetCount} planetary {solarSystem.planetCount === 1 ? 'body' : 'bodies'}{' '}
                in stable orbits. {solarSystem.hasLife ? 'Biosignatures detected.' : 'No life signs detected.'}
              </p>
            </div>
          </div>
          </>
        ) : (
          <>
            {scanData === null && (
              <div className="bg-gray-800 p-3 rounded border border-yellow-600">
                <p className="text-yellow-400">⚠ Hex not yet scanned</p>
                <p className="text-sm text-gray-400 mt-1">
                  Move within 1 hex to scan this location
                </p>
              </div>
            )}
            {scanData && (
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <p className="text-gray-400">🌑 Empty Space</p>
                <p className="text-sm text-gray-500 mt-1">
                  No solar system detected in this hex
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
