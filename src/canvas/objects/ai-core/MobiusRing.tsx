import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MobiusRing — Precision mathematical orbital system around the AI Core.
 *
 * Contains:
 * - Primary Möbius strip (dark metallic)
 * - Computational accent ring (emissive blue)
 * - Secondary tilted orbital ring
 * - Data path ring (larger, faint)
 */
export default function MobiusRing() {
    const groupRef = useRef<THREE.Group | null>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const secondaryRingRef = useRef<THREE.Mesh | null>(null);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();

        const positions: number[] = [];
        const normals: number[] = [];
        const indices: number[] = [];

        const radius = 1.2;
        const halfWidth = 0.035;
        const halfThickness = 0.003;
        const segmentsU = 360;

        for (let i = 0; i <= segmentsU; i++) {
            const u = (i / segmentsU) * Math.PI * 2;

            const cosU = Math.cos(u);
            const sinU = Math.sin(u);

            const cosU2 = Math.cos(u / 2);
            const sinU2 = Math.sin(u / 2);

            const xDir = [
                cosU * cosU2,
                sinU * cosU2,
                sinU2,
            ];

            const yDir = [
                -cosU * sinU2,
                -sinU * sinU2,
                cosU2,
            ];

            const center = [
                radius * cosU,
                radius * sinU,
                0,
            ];

            const c0 = [
                center[0] + halfWidth * xDir[0] + halfThickness * yDir[0],
                center[1] + halfWidth * xDir[1] + halfThickness * yDir[1],
                center[2] + halfWidth * xDir[2] + halfThickness * yDir[2],
            ];

            const c1 = [
                center[0] - halfWidth * xDir[0] + halfThickness * yDir[0],
                center[1] - halfWidth * xDir[1] + halfThickness * yDir[1],
                center[2] - halfWidth * xDir[2] + halfThickness * yDir[2],
            ];

            const c2 = [
                center[0] - halfWidth * xDir[0] - halfThickness * yDir[0],
                center[1] - halfWidth * xDir[1] - halfThickness * yDir[1],
                center[2] - halfWidth * xDir[2] - halfThickness * yDir[2],
            ];

            const c3 = [
                center[0] + halfWidth * xDir[0] - halfThickness * yDir[0],
                center[1] + halfWidth * xDir[1] - halfThickness * yDir[1],
                center[2] + halfWidth * xDir[2] - halfThickness * yDir[2],
            ];

            positions.push(...c0, ...c1);
            normals.push(...yDir, ...yDir);

            positions.push(...c1, ...c2);
            normals.push(
                -xDir[0], -xDir[1], -xDir[2],
                -xDir[0], -xDir[1], -xDir[2]
            );

            positions.push(...c2, ...c3);
            normals.push(
                -yDir[0], -yDir[1], -yDir[2],
                -yDir[0], -yDir[1], -yDir[2]
            );

            positions.push(...c3, ...c0);
            normals.push(...xDir, ...xDir);
        }

        for (let i = 0; i < segmentsU; i++) {
            const current = i * 8;
            const next = (i + 1) * 8;

            for (let face = 0; face < 4; face++) {
                const v0 = current + face * 2;
                const v1 = current + face * 2 + 1;
                const v2 = next + face * 2;
                const v3 = next + face * 2 + 1;

                indices.push(v0, v2, v1);
                indices.push(v1, v2, v3);
            }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geo.setIndex(indices);

        return geo;
    }, []);

    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);

    useFrame((state) => {
        if (!groupRef.current || !meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Primary Möbius — very slow roll
        meshRef.current.rotation.z = time * -0.04;

        // Group tilt oscillation
        groupRef.current.rotation.x =
            THREE.MathUtils.degToRad(25) +
            Math.sin(time * 0.15) * 0.04;
        groupRef.current.rotation.y =
            time * 0.02 + Math.cos(time * 0.12) * 0.02;

        // Secondary ring — counter-rotation
        if (secondaryRingRef.current) {
            secondaryRingRef.current.rotation.z = time * 0.03;
            secondaryRingRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* ORBIT C: Subtle Möbius / twisted orbital structure */}
            <mesh ref={meshRef} geometry={geometry}>
                <meshPhysicalMaterial
                    color="#0f172a"
                    metalness={0.9}
                    roughness={0.08}
                    clearcoat={1.0}
                    clearcoatRoughness={0.02}
                    ior={1.6}
                    reflectivity={0.9}
                    transmission={0.2}
                    thickness={0.1}
                />
            </mesh>

            {/* ORBIT A: Thin metallic precision ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[1.45, 0.002, 16, 128]} />
                <meshPhysicalMaterial
                    color="#94a3b8"
                    metalness={1.0}
                    roughness={0.15}
                    clearcoat={0.5}
                    emissive="#38bdf8"
                    emissiveIntensity={0.05}
                />
            </mesh>

            {/* ORBIT B: Asymmetric elliptical computational path */}
            <mesh ref={secondaryRingRef} rotation={[-0.5, 0.8, 0.3]} scale={[1, 1.2, 1]}>
                <torusGeometry args={[1.6, 0.0015, 12, 128]} />
                <meshPhysicalMaterial
                    color="#64748b"
                    metalness={1.0}
                    roughness={0.2}
                    emissive="#94a3b8"
                    emissiveIntensity={0.02}
                />
            </mesh>

            {/* ORBIT D: Very faint large gravitational field ring */}
            <mesh rotation={[0.2, -0.4, 0.1]}>
                <torusGeometry args={[2.2, 0.001, 8, 256]} />
                <meshBasicMaterial
                    color="#475569"
                    transparent
                    opacity={0.05}
                />
            </mesh>
        </group>
    );
}