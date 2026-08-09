import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MainLighting — Cinematic lighting rig.
 *
 * Scroll-responsive lighting that subtly shifts intensity
 * as the user moves through the 3D environment.
 *
 * Rig:
 * - Key light (top-right, warm white)
 * - Fill light (left, cool slate)
 * - Rim light (back, bright for silhouette)
 * - Core accent (point light near AI Core, subtle blue)
 * - Ambient base
 */
export default function MainLighting() {
    const corePointRef = useRef<THREE.PointLight | null>(null);
    const keyRef = useRef<THREE.DirectionalLight | null>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Scroll progress
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        const maxScroll = typeof window !== 'undefined'
            ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
            : 1;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        // Core point light pulses and moves with scroll (very subtle)
        if (corePointRef.current) {
            corePointRef.current.intensity = 1.0 + Math.sin(time * 0.8) * 0.1 + progress * 0.2;
        }

        // Key light subtle variation
        if (keyRef.current) {
            keyRef.current.intensity = 0.8 + Math.sin(time * 0.05) * 0.1;
        }
    });

    return (
        <group>
            {/* Ambient base — extremely low to preserve pitch black */}
            <ambientLight intensity={0.02} color="#ffffff" />

            {/* Key Light — conceptual accretion disk cast light (pale gold) */}
            <directionalLight
                ref={keyRef}
                castShadow
                position={[4, 2, 4]}
                intensity={0.8}
                color="#fef08a" // Pale yellow/gold
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
            />

            {/* Fill Light — weak far off starlight */}
            <directionalLight
                position={[-5, 2, 3]}
                intensity={0.1}
                color="#94a3b8"
            />

            {/* Rim Light — behind, for subtle silhouette edge separation */}
            <directionalLight
                position={[-4, 4, -6]}
                intensity={0.3}
                color="#cbd5e1"
            />

            {/* Core Accent Point Light — Accretion disk center glow (White hot) */}
            <pointLight
                ref={corePointRef}
                position={[0, 0, 0]}
                intensity={1.2}
                color="#ffffff" // White hot center
                distance={10}
                decay={2}
            />
        </group>
    );
}