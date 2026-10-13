import React, { Component, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AtomCounts } from '../../types/atom';

const COLORS = { proton: '#ff705f', neutron: '#8a9cff', electron: '#baf7ff' };

const ParticleCloud = React.memo(function ParticleCloud({ positions, radius, color, emissive = 0, roughness = 0.45, glow = false, glowOpacity = 0.16 }: { positions: [number, number, number][]; radius: number; color: string; emissive?: number; roughness?: number; glow?: boolean; glowOpacity?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const haloMesh = useRef<THREE.InstancedMesh>(null);
  const instance = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    positions.forEach((position, index) => {
      instance.position.set(...position);
      instance.updateMatrix();
      mesh.current?.setMatrixAt(index, instance.matrix);
      haloMesh.current?.setMatrixAt(index, instance.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (haloMesh.current) haloMesh.current.instanceMatrix.needsUpdate = true;
  }, [instance, positions]);
  if (!positions.length) return null;
  return <>
    {glow && <instancedMesh ref={haloMesh} args={[undefined, undefined, positions.length]}>
      <sphereGeometry args={[radius * 2.2, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={glowOpacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </instancedMesh>}
    <instancedMesh ref={mesh} args={[undefined, undefined, positions.length]}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0.12} emissive={color} emissiveIntensity={emissive} />
    </instancedMesh>
  </>;
});

function nucleonPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - 2 * ((i + 0.5) / Math.max(count, 1));
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    const radius = 0.68 * Math.cbrt((i + 0.5) / Math.max(count, 1));
    const variation = 0.94 + ((i * 17) % 7) * 0.018;
    return [Math.cos(angle) * ringRadius * radius * variation, y * radius * variation, Math.sin(angle) * ringRadius * radius * variation] as [number, number, number];
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
  const orbit = useMemo(() => {
    const points = new THREE.EllipseCurve(0, 0, radius * 1.08, radius * 0.82, 0, Math.PI * 2, false, 0)
      .getPoints(128)
      .map((point) => new THREE.Vector3(point.x, point.y, 0));
    return new THREE.CatmullRomCurve3(points, true);
  }, [radius]);
  const orbitGeometry = useMemo(() => new THREE.TubeGeometry(orbit, 128, 0.006, 6, true), [orbit]);
  const orbitGlowGeometry = useMemo(() => new THREE.TubeGeometry(orbit, 128, 0.026, 6, true), [orbit]);
  const electronPositions = useMemo(() => positions.map(([x, y, z]) => [x * 1.08, y * 0.82, z] as [number, number, number]), [positions]);
  return <group ref={group} rotation={[index % 2 ? 0.8 : 0.15, 0, index % 2 ? 0.45 : 0]}>
    {showPaths && <>
      <mesh geometry={orbitGlowGeometry}><meshBasicMaterial color={index % 3 === 1 ? '#a887ff' : '#2f9dff'} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      <mesh geometry={orbitGeometry}><meshBasicMaterial color={index % 3 === 1 ? '#b5a2ff' : '#83eaff'} transparent opacity={0.78} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
    </>}
    {visible && <ParticleCloud positions={electronPositions} radius={0.052} color={COLORS.electron} emissive={1.8} glow />}
  </group>;
});

function AtomModel({ counts, shells, playing, showPaths, showParticles }: { counts: AtomCounts; shells: number[]; playing: boolean; showPaths: boolean; showParticles: boolean }) {
  const nucleons = useMemo(() => nucleonPositions(counts.protons + counts.neutrons), [counts.protons, counts.neutrons]);
  const protons = useMemo(() => nucleons.slice(0, counts.protons), [nucleons, counts.protons]);
  const neutrons = useMemo(() => nucleons.slice(counts.protons), [nucleons, counts.protons]);
  return <>
    <ambientLight intensity={0.52} /><pointLight position={[4, 5, 6]} intensity={9} color="#a8eaff" /><pointLight position={[-4, -2, -3]} intensity={5} color="#9c78ff" /><pointLight position={[0, -4, 3]} intensity={3} color="#ff7d72" />
    {showParticles && <>
      <ParticleCloud positions={protons} radius={0.105} color={COLORS.proton} roughness={0.3} emissive={0.48} glow />
      <ParticleCloud positions={neutrons} radius={0.105} color={COLORS.neutron} roughness={0.34} emissive={0.36} glow glowOpacity={0.1} />
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
  return <SceneErrorBoundary><Canvas camera={{ position: [0, 0, 5.8], fov: 42 }} dpr={[1, 1.35]} gl={{ antialias: true, powerPreference: 'high-performance' }} frameloop={playing ? 'always' : 'demand'} tabIndex={0} aria-label="Interactive three-dimensional atom scene; use pointer or touch to rotate and zoom" fallback={<div className="viz-webgl-fallback" role="status">3D rendering is unavailable in this browser. Switch to Bohr Shells to continue exploring.</div>}>
    <AtomModel counts={counts} shells={shells} playing={playing} showPaths={showPaths} showParticles={showParticles} key={resetKey} />
  </Canvas></SceneErrorBoundary>;
}
