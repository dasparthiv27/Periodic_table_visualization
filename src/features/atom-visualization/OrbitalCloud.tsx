import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { sampleHydrogenicOrbital, type OrbitalSelection } from '../../lib/chemistry/orbital-density';

function ProbabilityPoints({ orbital }: { orbital: OrbitalSelection }) {
  const positions = useMemo(() => sampleHydrogenicOrbital(orbital), [orbital]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#75dfff"
        size={0.075}
        sizeAttenuation
        transparent
        opacity={0.14}
        depthWrite={false}
      />
    </points>
  );
}

export const OrbitalCloud: React.FC<{ orbital: OrbitalSelection }> = ({ orbital }) => (
  <Canvas
    className="orbital-cloud-canvas"
    camera={{ position: [0, 0, 14], fov: 45 }}
    dpr={[1, 1.5]}
    frameloop="demand"
    role="img"
    tabIndex={0}
    aria-label={`Interactive sampled hydrogenic probability density for orbital ${orbital}; drag to rotate and scroll to zoom`}
    fallback={<div className="viz-webgl-fallback" role="status">Orbital density rendering requires WebGL. The selected orbital model and its explanation remain available above.</div>}
  >
    <ambientLight intensity={1.3} />
    <pointLight position={[4, 5, 7]} intensity={2.2} color="#9cecff" />
    <ProbabilityPoints orbital={orbital} />
    <OrbitControls makeDefault enableDamping minDistance={6} maxDistance={24} />
  </Canvas>
);
