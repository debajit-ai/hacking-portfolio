import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- ACCRETION DISK SHADER ---
const DiskShaderMaterial = {
    uniforms: {
        time: { value: 0 },
        innerColor: { value: new THREE.Color('#ffffff') }, // White hot
        midColor: { value: new THREE.Color('#fef08a') }, // Pale gold
        outerColor: { value: new THREE.Color('#ea580c') }, // Amber / dark orange
        fadeColor: { value: new THREE.Color('#000000') }, // Fades to black
    },
    vertexShader: `
        attribute float orbitSpeed;
        attribute float orbitOffset;
        attribute float particleSize;
        attribute float distanceScale;
        attribute float turbulence;

        varying float vDistance;
        varying float vAlpha;

        uniform float time;

        void main() {
            // Keplerian-inspired orbit (inner is faster, outer is slower)
            float speed = orbitSpeed * (1.0 / (distanceScale * 0.5));
            float angle = time * speed + orbitOffset;

            // Base circular orbit
            float x = cos(angle) * distanceScale;
            float z = sin(angle) * distanceScale;
            
            // Add vertical turbulence based on time and position
            float wave = sin(angle * 3.0 + time * 0.5) * turbulence;
            float y = position.y + wave;

            vec3 newPosition = vec3(x, y, z);
            
            vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Greatly reduced point size scale to prevent blowout
            gl_PointSize = particleSize * (100.0 / -mvPosition.z);

            // Pass normalized distance to fragment shader
            vDistance = clamp((distanceScale - 1.4) / 3.1, 0.0, 1.0);
            
            // Pulsate alpha slightly
            vAlpha = 0.3 + 0.7 * sin(time * speed * 2.0 + orbitOffset);
        }
    `,
    fragmentShader: `
        uniform vec3 innerColor;
        uniform vec3 midColor;
        uniform vec3 outerColor;
        uniform vec3 fadeColor;

        varying float vDistance;
        varying float vAlpha;

        void main() {
            // Circular soft particle
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            
            // Extremely soft falloff to prevent harsh additive buildup
            float alpha = pow((1.0 - r), 2.0) * vAlpha;

            // Thermodynamic Color Mapping
            vec3 color = innerColor;
            if (vDistance < 0.15) {
                color = mix(innerColor, midColor, vDistance / 0.15);
            } else if (vDistance < 0.5) {
                color = mix(midColor, outerColor, (vDistance - 0.15) / 0.35);
            } else {
                color = mix(outerColor, fadeColor, (vDistance - 0.5) / 0.5);
                // Outer edges fade out entirely
                alpha *= (1.0 - ((vDistance - 0.5) / 0.5));
            }

            // Lower global alpha multiplier to prevent white-out
            gl_FragColor = vec4(color, alpha * 0.2);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
};


export default function BlackHoleCore() {
    const groupRef = useRef<THREE.Group | null>(null);
    const diskRef = useRef<THREE.Points | null>(null);

    // Generate Particle Data for Accretion Disk
    const particleData = useMemo(() => {
        const count = 45000;
        const positions = new Float32Array(count * 3);
        const orbitSpeeds = new Float32Array(count);
        const orbitOffsets = new Float32Array(count);
        const particleSizes = new Float32Array(count);
        const distanceScales = new Float32Array(count);
        const turbulences = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Distribution highly weighted towards the inner edge
            const r = Math.random();
            // Pushed inner radius out slightly to clear the event horizon
            const radius = 1.4 + Math.pow(r, 3.0) * 3.1; 

            // Initial positions (x,z handled by shader, y is vertical thickness)
            positions[i * 3 + 0] = 0;
            
            // Thickness of disk increases with radius (flared disk)
            const thickness = 0.02 + Math.pow(r, 2.0) * 0.3;
            positions[i * 3 + 1] = (Math.random() - 0.5) * thickness;
            positions[i * 3 + 2] = 0;

            // Physics attributes
            orbitSpeeds[i] = 1.0 + Math.random() * 0.5; // Base speed, shader modifies by 1/r
            orbitOffsets[i] = Math.random() * Math.PI * 2;
            
            // Particle size: slightly sharper
            particleSizes[i] = 0.15 + Math.random() * 0.4 + (r * 0.4);
            
            distanceScales[i] = radius;
            
            // Turbulence: higher waves on the outer edges
            turbulences[i] = (Math.random() - 0.5) * 0.15 * r;
        }

        return { positions, orbitSpeeds, orbitOffsets, particleSizes, distanceScales, turbulences };
    }, []);

    const shaderMat = useMemo(() => new THREE.ShaderMaterial(DiskShaderMaterial), []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();

        // Slow cinematic wobble for the entire system
        groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
        groupRef.current.rotation.y = Math.cos(time * 0.15) * 0.05;

        // Update shader time
        if (shaderMat) {
            shaderMat.uniforms.time.value = time;
        }

        // Extremely slow precession of the entire disk
        if (diskRef.current) {
            diskRef.current.rotation.y = time * -0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* 1. Event Horizon - Rendered first to occlude background */}
            <mesh scale={[1.0, 1.0, 1.0]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#000000" depthWrite={true} />
            </mesh>

            {/* 2. Gravitational Lensing Refraction Shell */}
            <mesh scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhysicalMaterial
                    color="#000000"
                    metalness={1.0}
                    roughness={0.0}
                    transmission={1.0} // Fully refractive
                    thickness={3.0} // Deep warping
                    ior={2.5} // Extreme Index of Refraction
                    transparent
                    opacity={1}
                />
            </mesh>

            {/* 3. Accretion Disk (Procedural Particle Shader) */}
            <group rotation={[0.3, 0, 0.1]}>
                <points ref={diskRef} material={shaderMat} frustumCulled={false}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
                        <bufferAttribute attach="attributes-orbitSpeed" args={[particleData.orbitSpeeds, 1]} />
                        <bufferAttribute attach="attributes-orbitOffset" args={[particleData.orbitOffsets, 1]} />
                        <bufferAttribute attach="attributes-particleSize" args={[particleData.particleSizes, 1]} />
                        <bufferAttribute attach="attributes-distanceScale" args={[particleData.distanceScales, 1]} />
                        <bufferAttribute attach="attributes-turbulence" args={[particleData.turbulences, 1]} />
                    </bufferGeometry>
                </points>
            </group>
        </group>
    );
}
