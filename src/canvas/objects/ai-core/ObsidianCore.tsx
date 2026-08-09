import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ObsidianCore — The central dark computational sphere.
 *
 * Multi-layered scientific instrument:
 * - Outer obsidian shell (dark graphite, high clearcoat)
 * - Inner quantum heart (subtle emissive pulse)
 * - Energy field (atmospheric glow sphere)
 * - Micro-particles orbiting the core
 */

const MICRO_PARTICLE_COUNT = 160;

export default function ObsidianCore() {
    const groupRef = useRef<THREE.Group | null>(null);
    const innerCoreRef = useRef<THREE.Mesh | null>(null);
    const fieldRef = useRef<THREE.Mesh | null>(null);
    const microParticlesRef = useRef<THREE.Points | null>(null);

    /* Micro-particles orbiting the core */
    const microPositions = useMemo(() => {
        const buf = new Float32Array(MICRO_PARTICLE_COUNT * 3);
        for (let i = 0; i < MICRO_PARTICLE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 0.55 + Math.random() * 0.35;
            buf[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            buf[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            buf[i * 3 + 2] = r * Math.cos(phi);
        }
        return buf;
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();

        // Very slow multi-axis rotation
        groupRef.current.rotation.y = time * -0.02;
        groupRef.current.rotation.x = time * -0.01;
        groupRef.current.rotation.z = time * -0.005;

        // Breathing scale
        const breath = 1 + Math.sin(time * 0.8) * 0.015;
        groupRef.current.scale.set(breath, breath, breath);

        // Inner emissive pulse
        if (innerCoreRef.current) {
            const mat = innerCoreRef.current.material as THREE.MeshStandardMaterial;
            if (mat) {
                mat.emissiveIntensity = 0.3 + Math.sin(time * 1.2) * 0.2;
            }
        }

        // Energy field pulse
        if (fieldRef.current) {
            const mat = fieldRef.current.material as THREE.MeshBasicMaterial;
            if (mat) {
                mat.opacity = 0.03 + Math.sin(time * 0.7) * 0.015;
            }
        }

        // Micro-particles rotation
        if (microParticlesRef.current) {
            microParticlesRef.current.rotation.y = time * 0.05;
            microParticlesRef.current.rotation.x = time * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Outer Obsidian Shell — very dark graphite with physical properties */}
            <mesh scale={[0.5, 0.5, 0.5]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhysicalMaterial
                    color="#020305"
                    metalness={1.0}
                    roughness={0.05}
                    clearcoat={1.0}
                    clearcoatRoughness={0.02}
                    ior={2.0}
                    reflectivity={1.0}
                    transmission={0.15}
                    thickness={0.8}
                    envMapIntensity={1.5}
                />
            </mesh>

            {/* Microscopic Singularity Point */}
            <mesh ref={innerCoreRef} scale={[0.08, 0.08, 0.08]}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#38bdf8"
                    emissiveIntensity={1.2}
                    roughness={0.1}
                />
            </mesh>

            {/* Micro-particles orbiting the core */}
            <points ref={microParticlesRef} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[microPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    color="#94a3b8"
                    size={0.006}
                    transparent
                    opacity={0.25}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Precision accent ring — equatorial */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.62, 0.003, 8, 128]} />
                <meshStandardMaterial
                    color="#38bdf8"
                    emissive="#38bdf8"
                    emissiveIntensity={0.3}
                    roughness={0.2}
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Secondary accent ring — tilted */}
            <mesh rotation={[0.4, 0.8, 0.2]}>
                <torusGeometry args={[0.72, 0.002, 8, 96]} />
                <meshStandardMaterial
                    color="#64748b"
                    emissive="#94a3b8"
                    emissiveIntensity={0.1}
                    roughness={0.3}
                    transparent
                    opacity={0.15}
                />
            </mesh>
        </group>
    );
}
