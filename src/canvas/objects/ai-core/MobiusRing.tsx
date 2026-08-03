import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MobiusRing() {
    const groupRef = useRef<THREE.Group | null>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();

        const positions: number[] = [];
        const normals: number[] = [];
        const indices: number[] = [];

        const radius = 1.4;
        const halfWidth = 0.04;
        const halfThickness = 0.004;
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
                -xDir[0],
                -xDir[1],
                -xDir[2],
                -xDir[0],
                -xDir[1],
                -xDir[2]
            );

            positions.push(...c2, ...c3);
            normals.push(
                -yDir[0],
                -yDir[1],
                -yDir[2],
                -yDir[0],
                -yDir[1],
                -yDir[2]
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

        geo.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );

        geo.setAttribute(
            'normal',
            new THREE.Float32BufferAttribute(normals, 3)
        );

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

        meshRef.current.rotation.z = time * -0.015;

        groupRef.current.rotation.x =
            THREE.MathUtils.degToRad(20) +
            Math.sin(time * 0.1) * 0.015;

        groupRef.current.rotation.y =
            Math.cos(time * 0.08) * 0.015;
    });

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                geometry={geometry}
            >
                <meshPhysicalMaterial
                    color="#2a2d32"
                    metalness={1}
                    roughness={0.15}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    ior={1.5}
                    envMapIntensity={1.2}
                />
            </mesh>
        </group>
    );
}