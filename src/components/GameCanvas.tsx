import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { defineHex, Orientation } from 'honeycomb-grid';
import { useGameStore } from '../store/gameStore';
import { getHexDistance, getHexesInRange, findHexPath } from '../utils/hexUtils';
import { HEX_SIZE, HEX_POSITIONS } from '../utils/hexPositions';
import { universeGenerator } from '../utils/universeGenerator';
import { StarType } from '../types/solarSystem';
import { ringApi } from '../utils/ringApi';
import type { InformationRing } from '../types/solarSystem';
import {
  MAX_MOVE_DISTANCE,
  SHIP_ROTATION_SPEED,
  STAR_COLORS,
  STAR_VISUAL_SIZES,
  PLANET_PARTICLE_MULTIPLIER,
  MIN_ATMOSPHERE_PARTICLES,
} from '../constants/gameConstants';

// Function to create text sprite
const createTextSprite = (text: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;

  canvas.width = 256;
  canvas.height = 128;

  context.fillStyle = 'rgba(0, 0, 0, 0)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = 'Bold 48px Arial';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(60, 30, 1);

  return sprite;
};

// Function to create solar system visual
const createSolarSystemVisual = (starType: StarType, planetCount: number): THREE.Group => {
  const group = new THREE.Group();
  
  const color = STAR_COLORS[starType];
  const size = STAR_VISUAL_SIZES[starType];
  
  // Create star (sun) at center
  const starGeometry = new THREE.CircleGeometry(size, 32);
  const starMaterial = new THREE.MeshBasicMaterial({ color });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.z = 10;
  group.add(star);
  
  // Add glow effect
  const glowGeometry = new THREE.CircleGeometry(size + 3, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.3,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.z = 9;
  group.add(glow);
  
  // Add particle system for star atmosphere
  // Match particle count to planet count (with minimum for visual effect)
  const particleCount = Math.max(planetCount * PLANET_PARTICLE_MULTIPLIER, MIN_ATMOSPHERE_PARTICLES);
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = size + Math.random() * 5;
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
    particlePositions[i * 3 + 2] = 10 + Math.random() * 2;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    color,
    size: 2,
    transparent: true,
    opacity: 0.6,
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  group.add(particles);
  
  // Add orbiting planets
  const numPlanets = Math.min(planetCount, 5); // Show up to 5 visible planets
  for (let i = 0; i < numPlanets; i++) {
    const orbitRadius = size + 10 + (i * 8);
    const planetSize = 1.5 + Math.random() * 1.5;
    // Randomize starting angle for varied positions around the sun
    const planetAngle = Math.random() * Math.PI * 2;
    
    // Calculate orbit speed: 0.5-3 RPM (revolutions per minute)
    // Convert to radians per frame (assuming 60 FPS)
    // RPM to radians/second: RPM * (2π / 60)
    // Radians/second to radians/frame: (radians/second) / 60
    // Random speed between 0.5 and 3 RPM, slower for outer planets
    const baseRPM = 3.0 - (i / numPlanets) * 2.5; // 3.0 to 0.5 RPM
    const orbitSpeed = (baseRPM * 2 * Math.PI) / (60 * 60); // Convert RPM to radians per frame at 60 FPS
    
    // Create planet
    const planetGeometry = new THREE.CircleGeometry(planetSize, 16);
    const planetColor = new THREE.Color().setHSL(Math.random(), 0.5, 0.5);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: planetColor });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    planet.position.x = Math.cos(planetAngle) * orbitRadius;
    planet.position.y = Math.sin(planetAngle) * orbitRadius;
    planet.position.z = 10;
    
    // Store orbit info for animation
    planet.userData = {
      orbitRadius,
      orbitSpeed,
      currentAngle: planetAngle,
    };
    
    group.add(planet);
  }
  
  return group;
};

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const hexMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const shipRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const coordinateTextRef = useRef<THREE.Sprite | null>(null);
  const moveLineRef = useRef<THREE.Group | null>(null);
  const moveLineParticlesRef = useRef<{ particles: THREE.Points; path: THREE.Vector3[]; color: number; time: number } | null>(null);
  const movementGhostRef = useRef<{ line: THREE.Line; particles: THREE.Points } | null>(null);
  const rangeHighlightMeshesRef = useRef<THREE.Mesh[]>([]);
  const debugCirclesRef = useRef<THREE.Object3D[]>([]);
  const solarSystemMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const ringMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const animatingRingsRef = useRef<Map<string, { startTime: number; startRadius: number; endRadius: number }>>(new Map());
  const offsetXRef = useRef<number>(0);
  const offsetYRef = useRef<number>(0);
  const previousTurnRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState('cursor-move');

  const {
    cameraPosition,
    setCameraPosition,
    setHoveredHex,
    setSelectedHex,
    setShowHexInfo,
    isMoveMode,
    shipPosition,
    setMoveTargetHex,
    setStatusBarMessage,
    setShowMoveConfirmation,
    debugMode,
    isSolarSystemConverted,
    convertedSystems,
    scanHex,
    scannedHexes,
    informationRings,
    currentTurn,
    setSelectedRing,
    setShowRingDetails,
    setShowHexInfo: setShowHexInfoState,
    zoomLevel,
    setZoomLevel,
    movementHistory,
  } = useGameStore();

  // Initial hex scanning - scan starting position and surrounding hexes
  useEffect(() => {
    if (scannedHexes.size === 0) {
      const hexesToScan = getHexesInRange(shipPosition, 1);
      hexesToScan.forEach(hex => {
        const solarSystem = universeGenerator.getSolarSystem(hex.q, hex.r);
        scanHex(hex, solarSystem);
      });
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup - Orthographic for top-down view
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 1000;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.sortObjects = true; // Enable sorting for transparent objects
    rendererRef.current = renderer;

    // Define hex grid
    const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });

    // Calculate offset to center hex (0,0) at world origin
    // IMPORTANT: Honeycomb uses Y-down coordinates
    // We'll keep Y-down throughout and only flip the geometry shape
    const originHex = new Hex({ q: 0, r: 0 });
    const offsetX = originHex.center.x;
    const offsetY = originHex.center.y;
    offsetXRef.current = offsetX;
    offsetYRef.current = offsetY;

    // Create hex geometry
    // For pointy-top hexagons in Y-down coordinate system
    // Calculate corners manually to ensure they're centered at (0,0) in local space
    const hexShape = new THREE.Shape();
    const cornerAngles = [-90, -30, 30, 90, 150, -150]; // degrees, Y-down, starting from top
    cornerAngles.forEach((angleDeg, i) => {
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = HEX_SIZE * Math.cos(angleRad);
      const y = HEX_SIZE * Math.sin(angleRad);
      if (i === 0) {
        hexShape.moveTo(x, y);
      } else {
        hexShape.lineTo(x, y);
      }
    });
    hexShape.closePath();

    const hexGeometry = new THREE.ShapeGeometry(hexShape);
    const hexMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });

    const edgeGeometry = new THREE.EdgesGeometry(hexGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });

    // Create hex grid (visible area plus buffer)
    const hexRadius = 25;
    for (let q = -hexRadius; q <= hexRadius; q++) {
      for (let r = -hexRadius; r <= hexRadius; r++) {
        const hex = new Hex({ q, r });
        const center = hex.center;

        // Create hex mesh
        const hexMesh = new THREE.Mesh(hexGeometry, hexMaterial.clone());
        hexMesh.position.set(center.x - offsetX, center.y - offsetY, 0);
        hexMesh.userData = { q, r };
        scene.add(hexMesh);

        // Create hex border
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial.clone());
        edges.position.set(center.x - offsetX, center.y - offsetY, 0.1);
        scene.add(edges);

        hexMeshesRef.current.set(`${q},${r}`, hexMesh);
        
        // Check for solar system at this hex
        const solarSystem = universeGenerator.getSolarSystem(q, r);
        if (solarSystem && !isSolarSystemConverted(q, r)) {
          const solarSystemGroup = createSolarSystemVisual(solarSystem.starType, solarSystem.planetCount);
          solarSystemGroup.position.set(center.x - offsetX, center.y - offsetY, 0);
          solarSystemGroup.userData = { q, r, solarSystem }; // Store system data for click detection
          scene.add(solarSystemGroup);
          solarSystemMeshesRef.current.set(`${q},${r}`, solarSystemGroup);
        }
      }
    }

    // Create ship (cone pointing up)
    const shipGroup = new THREE.Group();
    const shipGeometry = new THREE.ConeGeometry(25, 50, 3); // 50% of HEX_SIZE (100)
    const shipMaterial = new THREE.MeshBasicMaterial({ color: 0x4488ff });
    const shipMesh = new THREE.Mesh(shipGeometry, shipMaterial);
    shipMesh.rotation.z = Math.PI / 2; // Point up
    shipMesh.position.z = 5;
    
    shipGroup.add(shipMesh);
    
    // Position ship at hex (0,0) center position X
    shipGroup.position.set(HEX_POSITIONS.X.x, HEX_POSITIONS.X.y, 0);
    
    scene.add(shipGroup);
    shipRef.current = shipGroup;

    // Add labeled circles to identify each corner and edge midpoint
    const createLabeledCircle = (x: number, y: number, label: string, z: number = 15) => {
      // White circle background
      const circleGeometry = new THREE.CircleGeometry(12, 32);
      const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.set(x, y, z);
      scene.add(circle);
      debugCirclesRef.current.push(circle);
      
      // Black text label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 64;
        canvas.height = 64;
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 48px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(20, 20, 1);
        sprite.position.set(x, y, z + 0.1);
        scene.add(sprite);
        debugCirclesRef.current.push(sprite);
      }
    };
    
    // Label all 6 corners (A-F)
    const cornerLabels = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
    cornerLabels.forEach(label => {
      const pos = HEX_POSITIONS[label];
      createLabeledCircle(pos.x, pos.y, label);
    });
    
    // Label all 6 edge midpoints (G-L)
    const edgeLabels = ['G', 'H', 'I', 'J', 'K', 'L'] as const;
    edgeLabels.forEach(label => {
      const pos = HEX_POSITIONS[label];
      createLabeledCircle(pos.x, pos.y, label);
    });
    
    // Label center (X)
    const centerPos = HEX_POSITIONS.X;
    createLabeledCircle(centerPos.x, centerPos.y, 'X');

    // Create particle system for ship tail
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = HEX_POSITIONS.X.x;
      positions[i * 3 + 1] = HEX_POSITIONS.X.y;
      positions[i * 3 + 2] = 0;
      velocities[i * 3] = (Math.random() - 0.5) * 2.5; // Spread to edge of hex
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 2.5; // Spread to edge of hex
      velocities[i * 3 + 2] = 0;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x44aaff,
      size: 2,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate ship
      if (shipRef.current) {
        shipRef.current.rotation.z += SHIP_ROTATION_SPEED / 60;
      }

      // Animate solar system planets and particles
      solarSystemMeshesRef.current.forEach((solarSystemGroup) => {
        solarSystemGroup.children.forEach((child) => {
          // Animate planets
          if (child.userData.orbitRadius) {
            child.userData.currentAngle += child.userData.orbitSpeed;
            child.position.x = Math.cos(child.userData.currentAngle) * child.userData.orbitRadius;
            child.position.y = Math.sin(child.userData.currentAngle) * child.userData.orbitRadius;
          }
          
          // Animate star particles (slowly rotate)
          if (child instanceof THREE.Points) {
            child.rotation.z += 0.001;
          }
        });
      });

      // Animate ring growth
      const now = Date.now();
      const animationDuration = 800; // ms
      
      animatingRingsRef.current.forEach((animation, ringId) => {
        const ringMesh = ringMeshesRef.current.get(ringId);
        if (ringMesh && sceneRef.current) {
          const elapsed = now - animation.startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          
          // Ease out function
          const eased = 1 - Math.pow(1 - progress, 3);
          
          const currentRadius = animation.startRadius + (animation.endRadius - animation.startRadius) * eased;
          
          // Update ring geometry
          const ring = ringMesh.userData.ring as InformationRing;
          
          // Remove old mesh
          sceneRef.current.remove(ringMesh);
          ringMesh.geometry.dispose();
          (ringMesh.material as THREE.Material).dispose();
          
          // Create new geometry with animated radius
          const newGeometry = new THREE.RingGeometry(
            currentRadius * HEX_SIZE * 1.5,
            currentRadius * HEX_SIZE * 1.5 + 16, // Match the 2x thicker rings
            64
          );
          
          const color = ringApi.getRingColor(ring.actionType);
          const newMaterial = new THREE.MeshBasicMaterial({
            color: parseInt(color.replace('#', '0x')),
            transparent: true,
            opacity: 0.8,
          });
          
          const newMesh = new THREE.Mesh(newGeometry, newMaterial);
          newMesh.position.set(
            ringMesh.position.x,
            ringMesh.position.y,
            ringMesh.position.z
          );
          newMesh.userData = ringMesh.userData;
          
          sceneRef.current.add(newMesh);
          ringMeshesRef.current.set(ringId, newMesh);
          
          // Remove from animating list when done
          if (progress >= 1) {
            animatingRingsRef.current.delete(ringId);
          }
        }
      });

      // Update particles
      if (particlesRef.current && shipRef.current) {
        const positions = particlesRef.current.geometry.attributes.position
          .array as Float32Array;
        const velocities = particlesRef.current.geometry.attributes.velocity
          .array as Float32Array;
        
        const shipX = shipRef.current.position.x;
        const shipY = shipRef.current.position.y;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];

          // Reset particle if too far from ship
          const dx = positions[i * 3] - shipX;
          const dy = positions[i * 3 + 1] - shipY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 100) { // Reset at hex edge (HEX_SIZE)
            positions[i * 3] = shipX + (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = shipY + (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = 5;
          }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Update movement ghost particles
      if (movementGhostRef.current) {
        const ghostPositions = movementGhostRef.current.particles.geometry.attributes.position.array as Float32Array;
        const ghostVelocities = movementGhostRef.current.particles.geometry.attributes.velocity.array as Float32Array;
        const ghostLifetimes = movementGhostRef.current.particles.geometry.attributes.lifetime.array as Float32Array;

        for (let i = 0; i < ghostLifetimes.length; i++) {
          if (ghostLifetimes[i] > 0) {
            // Move particles outward
            ghostPositions[i * 3] += ghostVelocities[i * 3];
            ghostPositions[i * 3 + 1] += ghostVelocities[i * 3 + 1];
            
            // Decrease lifetime slowly
            ghostLifetimes[i] -= 0.003;
            
            // Update opacity based on lifetime
            if (ghostLifetimes[i] < 0.3) {
              const material = movementGhostRef.current.particles.material as THREE.PointsMaterial;
              material.opacity = 0.4 * (ghostLifetimes[i] / 0.3);
            }
          } else {
            // Respawn particle along the path
            ghostLifetimes[i] = 1.0;
            const segmentIndex = Math.floor(i / 20) % (movementHistory.length - 1);
            if (segmentIndex < movementHistory.length - 1 && movementHistory.length > 1) {
              const hex1 = new Hex(movementHistory[segmentIndex]);
              const hex2 = new Hex(movementHistory[segmentIndex + 1]);
              const t = (i % 20) / 20;
              
              ghostPositions[i * 3] = (hex1.center.x - offsetXRef.current) + ((hex2.center.x - offsetXRef.current) - (hex1.center.x - offsetXRef.current)) * t + (Math.random() - 0.5) * 10;
              ghostPositions[i * 3 + 1] = (hex1.center.y - offsetYRef.current) + ((hex2.center.y - offsetYRef.current) - (hex1.center.y - offsetYRef.current)) * t + (Math.random() - 0.5) * 10;
              ghostPositions[i * 3 + 2] = 1;

              const angle = Math.random() * Math.PI * 2;
              const speed = 0.3 + Math.random() * 0.3;
              ghostVelocities[i * 3] = Math.cos(angle) * speed;
              ghostVelocities[i * 3 + 1] = Math.sin(angle) * speed;
            }
          }
        }

        movementGhostRef.current.particles.geometry.attributes.position.needsUpdate = true;
        movementGhostRef.current.particles.geometry.attributes.lifetime.needsUpdate = true;
      }

      // Update move line particles
      if (moveLineParticlesRef.current) {
        const { particles, path } = moveLineParticlesRef.current;
        const positions = particles.geometry.attributes.position.array as Float32Array;
        const velocities = particles.geometry.attributes.velocity.array as Float32Array;
        const lifetimes = particles.geometry.attributes.lifetime.array as Float32Array;
        const maxParticles = lifetimes.length;
        
        moveLineParticlesRef.current.time += 0.016; // ~60fps

        // Update existing particles
        for (let i = 0; i < maxParticles; i++) {
          if (lifetimes[i] > 0) {
            // Update position based on velocity
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];
            
            // Decrease lifetime
            lifetimes[i] -= 0.02;
            
            // Apply fade out
            if (lifetimes[i] < 0.3) {
              // Particle is fading
            }
          }
        }

        // Spawn new particles along the line
        const spawnRate = 5; // particles per frame
        for (let s = 0; s < spawnRate; s++) {
          // Find an inactive particle
          let particleIndex = -1;
          for (let i = 0; i < maxParticles; i++) {
            if (lifetimes[i] <= 0) {
              particleIndex = i;
              break;
            }
          }

          if (particleIndex >= 0 && path.length > 1) {
            // Spawn particle at random point along path
            const t = Math.random();
            const segmentIndex = Math.floor(t * (path.length - 1));
            const segmentT = (t * (path.length - 1)) - segmentIndex;
            
            const start = path[segmentIndex];
            const end = path[Math.min(segmentIndex + 1, path.length - 1)];
            
            // Interpolate position along path
            const x = start.x + (end.x - start.x) * segmentT;
            const y = start.y + (end.y - start.y) * segmentT;
            const z = start.z + (end.z - start.z) * segmentT;
            
            // Set particle position
            positions[particleIndex * 3] = x;
            positions[particleIndex * 3 + 1] = y;
            positions[particleIndex * 3 + 2] = z;
            
            // Set particle velocity (drift away from line)
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            velocities[particleIndex * 3] = Math.cos(angle) * speed;
            velocities[particleIndex * 3 + 1] = Math.sin(angle) * speed;
            velocities[particleIndex * 3 + 2] = (Math.random() - 0.5) * 0.5;
            
            // Set lifetime
            lifetimes[particleIndex] = 1.0; // 1 second lifetime
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.velocity.needsUpdate = true;
        particles.geometry.attributes.lifetime.needsUpdate = true;
        
        // Update opacity based on lifetime
        (particles.material as THREE.PointsMaterial).opacity = 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      if (cameraRef.current) {
        cameraRef.current.left = (frustumSize * aspect) / -2;
        cameraRef.current.right = (frustumSize * aspect) / 2;
        cameraRef.current.top = frustumSize / 2;
        cameraRef.current.bottom = frustumSize / -2;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update movement ghost trail when history changes
  useEffect(() => {
    if (!sceneRef.current || movementHistory.length < 2) return;

    const scene = sceneRef.current;
    const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });

    // Remove old ghost if it exists
    if (movementGhostRef.current) {
      scene.remove(movementGhostRef.current.line);
      scene.remove(movementGhostRef.current.particles);
      movementGhostRef.current.line.geometry.dispose();
      (movementGhostRef.current.line.material as THREE.Material).dispose();
      movementGhostRef.current.particles.geometry.dispose();
      (movementGhostRef.current.particles.material as THREE.Material).dispose();
    }

    // Create line path from movement history
    const points: THREE.Vector3[] = [];
    movementHistory.forEach(pos => {
      const hex = new Hex(pos);
      const center = hex.center;
      points.push(new THREE.Vector3(
        center.x - offsetXRef.current,
        center.y - offsetYRef.current,
        1
      ));
    });

    // Create faint blue line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.3,
      linewidth: 2,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // Create particles along the path
    const ghostParticleCount = points.length * 20;
    const ghostParticleGeometry = new THREE.BufferGeometry();
    const ghostPositions = new Float32Array(ghostParticleCount * 3);
    const ghostVelocities = new Float32Array(ghostParticleCount * 3);
    const ghostLifetimes = new Float32Array(ghostParticleCount);

    for (let i = 0; i < ghostParticleCount; i++) {
      const segmentIndex = Math.floor(i / 20) % (points.length - 1);
      if (segmentIndex < points.length - 1) {
        const t = (i % 20) / 20;
        const p1 = points[segmentIndex];
        const p2 = points[segmentIndex + 1];
        
        ghostPositions[i * 3] = p1.x + (p2.x - p1.x) * t + (Math.random() - 0.5) * 10;
        ghostPositions[i * 3 + 1] = p1.y + (p2.y - p1.y) * t + (Math.random() - 0.5) * 10;
        ghostPositions[i * 3 + 2] = 1;

        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.3;
        ghostVelocities[i * 3] = Math.cos(angle) * speed;
        ghostVelocities[i * 3 + 1] = Math.sin(angle) * speed;
        ghostVelocities[i * 3 + 2] = 0;

        ghostLifetimes[i] = 1.0;
      }
    }

    ghostParticleGeometry.setAttribute('position', new THREE.BufferAttribute(ghostPositions, 3));
    ghostParticleGeometry.setAttribute('velocity', new THREE.BufferAttribute(ghostVelocities, 3));
    ghostParticleGeometry.setAttribute('lifetime', new THREE.BufferAttribute(ghostLifetimes, 1));

    const ghostParticleMaterial = new THREE.PointsMaterial({
      color: 0x4488ff,
      size: 2,
      transparent: true,
      opacity: 0.4,
    });

    const ghostParticles = new THREE.Points(ghostParticleGeometry, ghostParticleMaterial);
    scene.add(ghostParticles);

    movementGhostRef.current = { line, particles: ghostParticles };
  }, [movementHistory]);

  // Handle move mode - show range highlights and animate camera
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clean up existing range highlights
    rangeHighlightMeshesRef.current.forEach((mesh) => {
      sceneRef.current?.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    rangeHighlightMeshesRef.current = [];

    if (isMoveMode) {
      // Show green tint on all hexes within 3-hex range
      const hexesInRange = getHexesInRange(shipPosition, MAX_MOVE_DISTANCE);
      const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });

      hexesInRange.forEach(({ q, r }) => {
        // Skip the ship's current position
        if (q === shipPosition.q && r === shipPosition.r) return;

        const hex = new Hex({ q, r });
        const center = hex.center;

        // Create hexagon shape using manual corner calculation (same as main hex geometry)
        // This ensures perfect alignment with the hex borders
        const hexShape = new THREE.Shape();
        const cornerAngles = [-90, -30, 30, 90, 150, -150]; // degrees, Y-down, starting from top
        cornerAngles.forEach((angleDeg, i) => {
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = HEX_SIZE * Math.cos(angleRad);
          const y = HEX_SIZE * Math.sin(angleRad);
          if (i === 0) {
            hexShape.moveTo(x, y);
          } else {
            hexShape.lineTo(x, y);
          }
        });
        hexShape.closePath();

        const highlightGeometry = new THREE.ShapeGeometry(hexShape);
        const highlightMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        });
        const highlightMesh = new THREE.Mesh(highlightGeometry, highlightMaterial);
        highlightMesh.position.set(center.x - offsetXRef.current, center.y - offsetYRef.current, 1);
        sceneRef.current?.add(highlightMesh);
        rangeHighlightMeshesRef.current.push(highlightMesh);
      });

      // Animate camera to center on ship
      if (cameraRef.current) {
        const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });
        const shipHex = new Hex(shipPosition);
        const shipCenter = shipHex.center;
        
        // Smooth pan animation
        const startPos = { ...cameraPosition };
        const targetPos = { x: shipCenter.x, y: shipCenter.y };
        const duration = 500; // ms
        const startTime = Date.now();

        const animateCamera = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease in-out function
          const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const newX = startPos.x + (targetPos.x - startPos.x) * eased;
          const newY = startPos.y + (targetPos.y - startPos.y) * eased;

          setCameraPosition({ x: newX, y: newY });
          if (cameraRef.current) {
            cameraRef.current.position.set(newX, newY, 100);
          }

          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          }
        };

        animateCamera();
      }
    }
  }, [isMoveMode, shipPosition]);

  // Render information rings
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });

    // Remove old ring meshes
    ringMeshesRef.current.forEach((mesh) => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    ringMeshesRef.current.clear();

    // Create ring meshes for visible rings
    const visibleRings = ringApi.getVisibleRings(informationRings, shipPosition, 25);
    
    if (informationRings.length > 0) {
      console.log('=== RING DEBUG ===');
      console.log('Total rings in store:', informationRings.length);
      console.log('Visible rings:', visibleRings.length);
      console.log('Current turn:', currentTurn);
      console.log('Ship position:', shipPosition);
      informationRings.forEach((r, i) => {
        const radius = ringApi.getRingRadius(r, currentTurn);
        console.log(`Ring ${i + 1}:`, {
          id: r.id.substring(0, 20),
          origin: `(${r.origin.q}, ${r.origin.r})`,
          createdTurn: r.createdTurn,
          radius: radius
        });
      });
      console.log('==================');
    }
    
    visibleRings.forEach((ring: InformationRing) => {
      const radius = ringApi.getRingRadius(ring, currentTurn);
      
      // Always render rings, even if radius is 0 (they'll animate from origin)
      const hex = new Hex(ring.origin);
      const center = hex.center;
        
        // Create ring geometry (circle outline with particles)
        const ringGeometry = new THREE.RingGeometry(
          radius * HEX_SIZE * 1.5, // inner radius (convert hex distance to world units)
          radius * HEX_SIZE * 1.5 + 16, // outer radius (2x thicker ring)
          64 // segments for smooth circle
        );
        
        const color = ringApi.getRingColor(ring.actionType);
        
        // Create material with uniform opacity - SIMPLIFIED FOR DEBUGGING
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: parseInt(color.replace('#', '0x')),
          transparent: true,
          opacity: 0.8,
        });
        
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.position.set(
          center.x - offsetXRef.current,
          center.y - offsetYRef.current,
          2 + ring.createdTurn * 0.01 // Slightly different z-position per turn to prevent z-fighting
        );
        ringMesh.renderOrder = 1000 + ring.createdTurn; // Render older rings first
        ringMesh.userData = { ringId: ring.id, ring };
        
        scene.add(ringMesh);
        ringMeshesRef.current.set(ring.id, ringMesh);
        
        console.log(`Added ring mesh to scene:`, {
          id: ring.id.substring(0, 20),
          position: `(${center.x.toFixed(1)}, ${center.y.toFixed(1)}, ${(2 + ring.createdTurn * 0.01).toFixed(2)})`,
          radius: `${(radius * HEX_SIZE * 1.5).toFixed(1)} to ${(radius * HEX_SIZE * 1.5 + 16).toFixed(1)}`,
          color: color
        });
        
        // Add origin marker
        const markerGeometry = new THREE.CircleGeometry(5, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: parseInt(color.replace('#', '0x')),
          transparent: true,
          opacity: 0.8,
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(
          center.x - offsetXRef.current,
          center.y - offsetYRef.current,
          3 + ring.createdTurn * 0.01 // Match ring z-offset
        );
        marker.userData = { ringId: ring.id, ring, isMarker: true };
        
        scene.add(marker);
    });
  }, [informationRings, currentTurn, shipPosition]);

  // Trigger ring animations when turn changes or new rings added
  useEffect(() => {
    // Check for new rings (just created)
    informationRings.forEach((ring) => {
      const currentRadius = ringApi.getRingRadius(ring, currentTurn);
      
      // If this is a brand new ring (created this turn), animate from 0
      if (ring.createdTurn === currentTurn && !animatingRingsRef.current.has(ring.id)) {
        animatingRingsRef.current.set(ring.id, {
          startTime: Date.now(),
          startRadius: 0,
          endRadius: currentRadius,
        });
      }
    });
    
    // Handle turn increment animations
    if (currentTurn > previousTurnRef.current && previousTurnRef.current > 0) {
      // Turn incremented, animate all existing rings growing
      informationRings.forEach((ring) => {
        const oldRadius = ringApi.getRingRadius(ring, previousTurnRef.current);
        const newRadius = ringApi.getRingRadius(ring, currentTurn);
        
        // Only animate if ring existed before this turn
        if (oldRadius > 0 && ring.createdTurn < currentTurn) {
          animatingRingsRef.current.set(ring.id, {
            startTime: Date.now(),
            startRadius: oldRadius,
            endRadius: newRadius,
          });
        }
      });
    }
    previousTurnRef.current = currentTurn;
  }, [currentTurn, informationRings]);

  // Handle zoom level changes
  useEffect(() => {
    if (!cameraRef.current) return;
    
    const camera = cameraRef.current;
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 1000 / zoomLevel; // Adjust frustum size based on zoom
    
    camera.left = (frustumSize * aspect) / -2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
  }, [zoomLevel]);

  // Update camera position when cameraPosition state changes
  useEffect(() => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(cameraPosition.x, cameraPosition.y, 100);
  }, [cameraPosition]);

  // Update ship position in 3D scene when it changes
  useEffect(() => {
    if (!shipRef.current) return;

    const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });
    const shipHex = new Hex(shipPosition);
    const shipCenter = shipHex.center;
    
    // Apply offset to center the target hex and position at center X
    const targetX = shipCenter.x - offsetXRef.current;
    const targetY = shipCenter.y - offsetYRef.current;

    // Animate ship to new position
    const startPos = { ...shipRef.current.position };
    const targetPos = { x: targetX, y: targetY, z: 0 };
    const duration = 800; // ms
    const startTime = Date.now();

    const animateShip = () => {
      if (!shipRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease in-out function
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newX = startPos.x + (targetPos.x - startPos.x) * eased;
      const newY = startPos.y + (targetPos.y - startPos.y) * eased;
      const newZ = startPos.z + (targetPos.z - startPos.z) * eased;

      shipRef.current.position.set(newX, newY, newZ);

      if (progress < 1) {
        requestAnimationFrame(animateShip);
      }
    };

    animateShip();
  }, [shipPosition]);

  // Toggle debug circles visibility based on debugMode
  useEffect(() => {
    debugCirclesRef.current.forEach(obj => {
      obj.visible = debugMode;
    });
  }, [debugMode]);

  // Remove solar system visuals when converted
  useEffect(() => {
    convertedSystems.forEach((key: string) => {
      const solarSystemGroup = solarSystemMeshesRef.current.get(key);
      if (solarSystemGroup && sceneRef.current) {
        sceneRef.current.remove(solarSystemGroup);
        solarSystemMeshesRef.current.delete(key);
        
        // Dispose of geometries and materials
        solarSystemGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      }
    });
  }, [convertedSystems]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setDragStart({ x: event.clientX, y: event.clientY });
    setIsDragging(false);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Check if this was a click (no significant drag)
    if (!isDragging) {
      const dragDistance = Math.sqrt(
        Math.pow(event.clientX - dragStart.x, 2) + Math.pow(event.clientY - dragStart.y, 2)
      );
      
      if (dragDistance < 5) {
        // This was a click, not a drag
        handleClick(event);
      }
    }
    
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cameraRef.current || !sceneRef.current) return;

    // Check if mouse button is pressed (buttons property: 1 = primary button)
    if (event.buttons === 1 && !isMoveMode) {
      // User is holding mouse button - this is a drag (not in move mode)
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;

      // Only start dragging if moved more than threshold
      if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        setIsDragging(true);
      }

      if (isDragging) {
        const newX = cameraPosition.x - deltaX * 0.5;
        const newY = cameraPosition.y + deltaY * 0.5;

        setCameraPosition({ x: newX, y: newY });
        cameraRef.current.position.set(newX, newY, 100);
      }

      setDragStart({ x: event.clientX, y: event.clientY });
      return;
    }

    // Not dragging - reset drag state
    if (isDragging) {
      setIsDragging(false);
    }

    // Raycasting for hover
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    // Check for ring hover first (higher z-index)
    if (!isMoveMode && sceneRef.current) {
      const ringIntersects = raycasterRef.current.intersectObjects(
        sceneRef.current.children.filter(child => 
          child.userData.ring || child.userData.isMarker
        )
      );
      
      if (ringIntersects.length > 0) {
        setCursorStyle('cursor-pointer');
        // Still check hexes below but don't change cursor
        const intersects = raycasterRef.current.intersectObjects(
          Array.from(hexMeshesRef.current.values())
        );
        if (intersects.length > 0) {
          const hex = intersects[0].object as THREE.Mesh;
          const { q, r } = hex.userData;
          setHoveredHex({ q, r });
        }
        return;
      }
    }
    
    const intersects = raycasterRef.current.intersectObjects(
      Array.from(hexMeshesRef.current.values())
    );

    // Reset all hexes
    hexMeshesRef.current.forEach((mesh) => {
      (mesh.material as THREE.MeshBasicMaterial).color.set(0x000000);
    });

    // Clean up move line if exists
    if (moveLineRef.current && sceneRef.current) {
      sceneRef.current.remove(moveLineRef.current);
      moveLineRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      moveLineRef.current = null;
      moveLineParticlesRef.current = null;
    }

    if (intersects.length > 0) {
      const hex = intersects[0].object as THREE.Mesh;
      const { q, r } = hex.userData;
      setHoveredHex({ q, r });

      if (isMoveMode) {
        // Move mode: show line and update cursor/status
        const distance = getHexDistance(shipPosition, { q, r });
        const canMove = distance > 0 && distance <= MAX_MOVE_DISTANCE;

        // Update status bar
        if (distance === 0) {
          setStatusBarMessage(`Hex (${q}, ${r}) - Select a destination`);
          setCursorStyle('cursor-not-allowed');
        } else if (canMove) {
          setStatusBarMessage(`Hex (${q}, ${r}) - Move ${distance} ${distance === 1 ? 'space' : 'spaces'}`);
          setCursorStyle('cursor-pointer');
        } else {
          setStatusBarMessage(`Hex (${q}, ${r}) - Can't move that far. ${distance} spaces`);
          setCursorStyle('cursor-not-allowed');
        }

        // Draw line from ship to target hex
        const Hex = defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY });

        const path = findHexPath(shipPosition, { q, r });
        const lineGroup = new THREE.Group();

        // Draw dashed line through path
        const pathPoints: THREE.Vector3[] = [];
        path.forEach((pathHex) => {
          const hex = new Hex(pathHex);
          const center = hex.center;
          pathPoints.push(new THREE.Vector3(center.x - offsetXRef.current, center.y - offsetYRef.current, 2));
        });

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: canMove ? 0x00ff00 : 0xff0000,
          linewidth: 5,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        lineGroup.add(line);

        // Create tube geometry for thicker line (only if we have enough points)
        if (pathPoints.length >= 2) {
          const curve = new THREE.CatmullRomCurve3(pathPoints);
          const tubeGeometry = new THREE.TubeGeometry(curve, pathPoints.length * 4, 2, 8, false);
          const tubeMaterial = new THREE.MeshBasicMaterial({
            color: canMove ? 0x00ff00 : 0xff0000,
            transparent: true,
            opacity: 0.6,
          });
          const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
          lineGroup.add(tube);
        }

        // Create continuous particle system for the line
        const maxParticles = 100;
        const particlePositions = new Float32Array(maxParticles * 3);
        const particleVelocities = new Float32Array(maxParticles * 3);
        const particleLifetimes = new Float32Array(maxParticles);
        
        // Initialize all particles as inactive
        for (let i = 0; i < maxParticles; i++) {
          particleLifetimes[i] = 0; // 0 = inactive
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));
        particleGeometry.setAttribute('lifetime', new THREE.BufferAttribute(particleLifetimes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
          color: canMove ? 0x00ff00 : 0xff0000,
          size: 4,
          transparent: true,
          opacity: 0.8,
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        lineGroup.add(particles);

        sceneRef.current.add(lineGroup);
        moveLineRef.current = lineGroup;
        
        // Store particle system info for animation
        moveLineParticlesRef.current = {
          particles,
          path: pathPoints,
          color: canMove ? 0x00ff00 : 0xff0000,
          time: 0,
        };

        setMoveTargetHex({ q, r });

        // Highlight hex differently based on move validity
        (hex.material as THREE.MeshBasicMaterial).color.set(canMove ? 0x00ff00 : 0xff0000);
      } else {
        // Normal mode: lighter yellow highlight for less distraction
        (hex.material as THREE.MeshBasicMaterial).color.set(0xffffbb);
        setCursorStyle('cursor-move');
        
        // Check for solar system info
        const solarSystem = universeGenerator.getSolarSystem(q, r);
        if (solarSystem && !isSolarSystemConverted(q, r)) {
          setStatusBarMessage(`${solarSystem.name} (${solarSystem.starType}) - Mass: ${solarSystem.mass.toFixed(1)}`);
        } else if (isSolarSystemConverted(q, r)) {
          setStatusBarMessage(`Hex (${q}, ${r}) - Converted system`);
        } else {
          setStatusBarMessage(`Hex (${q}, ${r})`);
        }
      }
      
      // Show coordinate text at top of hex (in normal mode only)
      if (!isMoveMode && sceneRef.current) {
        // Remove old text if exists
        if (coordinateTextRef.current) {
          sceneRef.current.remove(coordinateTextRef.current);
          coordinateTextRef.current.material.map?.dispose();
          coordinateTextRef.current.material.dispose();
        }
        
        // Create new text sprite
        const textSprite = createTextSprite(`(${q}, ${r})`);
        if (textSprite) {
          textSprite.position.set(hex.position.x, hex.position.y + 35, 10);
          sceneRef.current.add(textSprite);
          coordinateTextRef.current = textSprite;
        }
      }
    } else {
      setHoveredHex(null);
      setMoveTargetHex(null);
      setCursorStyle('cursor-move');
      
      if (isMoveMode) {
        setStatusBarMessage('Select a destination within 3 hexes');
      }
      
      // Remove coordinate text
      if (coordinateTextRef.current && sceneRef.current) {
        sceneRef.current.remove(coordinateTextRef.current);
        coordinateTextRef.current.material.map?.dispose();
        coordinateTextRef.current.material.dispose();
        coordinateTextRef.current = null;
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cameraRef.current || !sceneRef.current) return;

    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    // Check for ring clicks first (higher priority)
    const ringIntersects = raycasterRef.current.intersectObjects(
      sceneRef.current.children.filter(child => 
        child.userData.ring || child.userData.isMarker
      )
    );
    
    if (ringIntersects.length > 0 && !isMoveMode) {
      const clickedObject = ringIntersects[0].object as THREE.Mesh;
      const ring = clickedObject.userData.ring as InformationRing;
      
      if (ring) {
        // Close hex info if open, show ring details
        setShowHexInfoState(false);
        setSelectedRing(ring);
        setShowRingDetails(true);
        return;
      }
    }

    // Then check for hex clicks
    const intersects = raycasterRef.current.intersectObjects(
      Array.from(hexMeshesRef.current.values())
    );

    if (intersects.length > 0) {
      const hex = intersects[0].object as THREE.Mesh;
      const { q, r } = hex.userData;
      
      if (isMoveMode) {
        // Move mode: check if move is valid and show confirmation
        const distance = getHexDistance(shipPosition, { q, r });
        const canMove = distance > 0 && distance <= MAX_MOVE_DISTANCE;
        
        if (canMove) {
          setMoveTargetHex({ q, r });
          setShowMoveConfirmation(true);
        }
      } else {
        // Normal mode: close ring details if open, show hex info
        setShowRingDetails(false);
        setSelectedHex({ q, r });
        
        // Check if clicking on a solar system to show additional info
        const solarSystem = universeGenerator.getSolarSystem(q, r);
        if (solarSystem && !isSolarSystemConverted(q, r)) {
          setStatusBarMessage(`${solarSystem.name} - ${solarSystem.starType} - Mass: ${solarSystem.mass.toFixed(1)} - Planets: ${solarSystem.planetCount}${solarSystem.hasLife ? ' - Has Life!' : ''}`);
        }
        
        setShowHexInfo(true);
      }
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const delta = event.deltaY;
    
    if (delta > 0) {
      // Zoom out
      setZoomLevel(zoomLevel / 1.1);
    } else {
      // Zoom in
      setZoomLevel(zoomLevel * 1.1);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
      onClick={handleClick}
      onWheel={handleWheel}
      className={`fixed inset-0 w-full h-full z-0 ${cursorStyle}`}
      style={{
        cursor: isMoveMode
          ? cursorStyle === 'cursor-pointer'
            ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 24 24\'><text y=\'20\' font-size=\'20\'>➡️</text></svg>") 12 12, pointer'
            : cursorStyle === 'cursor-not-allowed'
            ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 24 24\'><text y=\'20\' font-size=\'20\'>❌</text></svg>") 12 12, not-allowed'
            : 'default'
          : 'move',
      }}
    />
  );
};
