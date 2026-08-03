import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ObsidianCore() {
    const groupRef = useRef<THREE.Group | null>(null);

    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.getElapsedTime();

        groupRef.current.rotation.y = time * -0.04;
        groupRef.current.rotation.x = time * -0.02;
        groupRef.current.rotation.z = time * -0.01;

        const breath = 1 + Math.sin(time * 0.25) * 0.005;

        groupRef.current.scale.set(breath, breath, breath);
    });

    return (
        <group ref={groupRef}>
            <mesh scale={[0.18, 0.12, 0.12]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhysicalMaterial
                    color="#030303"
                    metalness={0.0}
                    roughness={0.01}
                    clearcoat={1.0}
                    clearcoatRoughness={0.02}
                    ior={1.5}
                    envMapIntensity={1.0}
                />
            </mesh>
        </group>
    );
};
