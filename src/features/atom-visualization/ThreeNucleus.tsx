import React, { Component, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AtomCounts } from '../../types/atom';

const COLORS = { proton: '#f07662', neutron: '#b9c5d6', electron: '#6ee7ff' };

const ParticleCloud = React.memo(function ParticleCloud({ positions, radius, color, emissive = 0, roughness = 0.45 }: { positions: [number, number, number][]; radius: number; color: string; emissive?: number; roughness?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const instance = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    positions.forEach((position, index) => {
      instance.position.set(...position);
      instance.updateMatrix();
      mesh.current?.setMatrixAt(index, instance.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [instance, positions]);
  if (!positions.length) return null;
  return <instancedMesh ref={mesh} args={[undefined, undefined, positions.length]}>
    <sphereGeometry args={[radius, 10, 10]} />
    <meshStandardMaterial color={color} roughness={roughness} {...(emissive > 0 ? { emissive: color, emissiveIntensity: emissive } : {})} />
  </instancedMesh>;
});

function nucleonPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    const r = 0.72 * Math.cbrt((i + 0.5) / Math.max(count, 1));
    return [Math.cos(angle) * radius * r, y * r, Math.sin(angle) * radius * r] as [number, number, number];
  });
}

const ElectronShell = React.memo(function ElectronShell({ count, index, playing, showPaths, visible }: { count: number; index: number; playing: boolean; showPaths: boolean; visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  const radius = 1.55 + index * 0.52;
  useFrame((_, delta) => {
    if (group.current && playing) group.current.rotation.y += delta * (0.55 / (index + 1));
  });
  const positions = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = (i / Math.max(count, 1)) * Math.PI * 2;
    return [Math.cos(a) * radius, Math.sin(a) * radius, 0] as [number, number, number];
  }), [count, radius]);
  const curve = useMemo(() => new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0).getPoints(96), [radius]);
  const curvePositions = useMemo(() => {
    const positions = new Float32Array(curve.length * 3);
    curve.forEach((point, pointIndex) => {
      positions[pointIndex * 3] = point.x;
      positions[pointIndex * 3 + 1] = point.y;
      positions[pointIndex * 3 + 2] = 0;
    });
    return positions;
  }, [curve]);
  return <group ref={group} rotation={[index % 2 ? 0.8 : 0.15, 0, index % 2 ? 0.45 : 0]}>
    {showPaths && <lineLoop><bufferGeometry><bufferAttribute attach="attributes-position" args={[curvePositions, 3]} /></bufferGeometry><lineBasicMaterial color="#38bdf8" transparent opacity={0.24} /></lineLoop>}
    {visible && <ParticleCloud positions={positions} radius={0.075} color={COLORS.electron} emissive={0.72} />}
  </group>;
});

function AtomModel({ counts, shells, playing, showPaths, showParticles }: { counts: AtomCounts; shells: number[]; playing: boolean; showPaths: boolean; showParticles: boolean }) {
  const protons = useMemo(() => nucleonPositions(counts.protons), [counts.protons]);
  const neutrons = useMemo(() => nucleonPositions(counts.neutrons).map(([x, y, z]) => [x + 0.055, y, z] as [number, number, number]), [counts.neutrons]);
  return <>
    <ambientLight intensity={0.8} /><pointLight position={[4, 5, 6]} intensity={7} color="#9cecff" /><pointLight position={[-4, -2, -3]} intensity={3} color="#a78bfa" />
    {showParticles && <>
      <ParticleCloud positions={protons} radius={0.105} color={COLORS.proton} roughness={0.38} emissive={0.22} />
      <ParticleCloud positions={neutrons} radius={0.105} color={COLORS.neutron} roughness={0.48} />
    </>}
    {shells.map((count, i) => count > 0 && <ElectronShell key={i} count={count} index={i} playing={playing} showPaths={showPaths} visible={showParticles} />)}
    <OrbitControls makeDefault enableDamping minDistance={3} maxDistance={11} />
  </>;
}

class SceneErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="viz-webgl-fallback" role="status">3D rendering is unavailable in this browser. Switch to Bohr Shells to continue exploring.</div> : this.props.children; }
}

export function ThreeNucleus({ counts, shells, playing, showPaths, showParticles, resetKey }: { counts: AtomCounts; shells: number[]; playing: boolean; showPaths: boolean; showParticles: boolean; resetKey: number }) {
  return <SceneErrorBoundary><Canvas camera={{ position: [0, 0, 5.8], fov: 42 }} dpr={[1, 1.5]} frameloop={playing ? 'always' : 'demand'} tabIndex={0} aria-label="Interactive three-dimensional atom scene; use pointer or touch to rotate and zoom" fallback={<div className="viz-webgl-fallback" role="status">3D rendering is unavailable in this browser. Switch to Bohr Shells to continue exploring.</div>}>
    <AtomModel counts={counts} shells={shells} playing={playing} showPaths={showPaths} showParticles={showParticles} key={resetKey} />
  </Canvas></SceneErrorBoundary>;
}
