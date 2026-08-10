import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- ACCRETION DISK SHADER ---
const DiskShaderMaterial = {
    uniforms: {
        time: { value: 0 },
        innerColor: { value: new THREE.Color('#ffffff') }, // Pure white hot
        midColor: { value: new THREE.Color('#fcd34d') }, // Pale gold
        outerColor: { value: new THREE.Color('#ea580c') }, // Amber
        fadeColor: { value: new THREE.Color('#7c2d12') }, // Deep orange/dark red
    },
    vertexShader: `
        attribute float orbitSpeed;
        attribute float orbitOffset;
        attribute float particleSize;
        attribute float distanceScale;
        attribute float turbulence;

        varying float vDistance;
        varying float vAlpha;
        varying float vDoppler;

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
            
            // Extract the absolute world scale from the model matrix
            // This ensures the lensing physics locks to the object's physical size
            float objectScale = length(modelMatrix[0].xyz);
            
            // Transform to view space for lensing calculation
            vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
            vec4 centerPos = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            
            // GRAVITATIONAL LENSING (View Space)
            // If the particle is physically behind the black hole center
            if (mvPosition.z < centerPos.z) {
                vec2 viewDir = mvPosition.xy - centerPos.xy;
                float dist2D = length(viewDir);
                
                // Shadow radius scales perfectly with the object
                float Rs = 1.0 * objectScale;
                
                if (dist2D > 0.0) {
                    // Smooth constraint to prevent vertical pillars and runaway values
                    // Bending is strongest near the shadow edge and falls off quickly.
                    float bendFactor = smoothstep(Rs * 2.5, Rs * 0.5, dist2D);
                    
                    // Controlled Einstein-ring deflection
                    float deflection = (Rs * Rs) / (dist2D + 0.1 * objectScale) * 0.45 * bendFactor;
                    
                    // Depth fade so only particles sufficiently behind are lensed
                    float depthFade = clamp((centerPos.z - mvPosition.z) / (2.0 * objectScale), 0.0, 1.0);
                    
                    mvPosition.xy += normalize(viewDir) * deflection * depthFade;
                }
            }

            gl_Position = projectionMatrix * mvPosition;
            
            // Doppler Asymmetry (Relativistic Beaming approximation)
            float beam = x / distanceScale; // -1.0 to 1.0
            vDoppler = 1.0 + (beam * 0.2); // 0.8x to 1.2x brightness (Subtle)

            // Point size scale (Perspective-aware & clamped)
            // Prevent division by zero and exploding particles when camera is very close
            float zDist = max(-mvPosition.z, 0.1); 
            float basePointSize = particleSize * objectScale;
            float projectedSize = basePointSize * (120.0 / zDist);
            
            // Clamp size so particles remain crisp individuals and never become giant blobs
            gl_PointSize = clamp(projectedSize, 1.5, 6.0);

            // Pass normalized distance to fragment shader
            // Radius starts around 1.01, max around 6.0.
            vDistance = clamp((distanceScale - 1.01) / 4.5, 0.0, 1.0);
            
            // Pulsate alpha slightly
            vAlpha = 0.5 + 0.5 * sin(time * speed * 2.0 + orbitOffset);
        }
    `,
    fragmentShader: `
        uniform vec3 innerColor;
        uniform vec3 midColor;
        uniform vec3 outerColor;
        uniform vec3 fadeColor;

        varying float vDistance;
        varying float vAlpha;
        varying float vDoppler;

        void main() {
            // Circular soft particle
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            
            // Crisp cores: tight falloff
            float alpha = pow((1.0 - r), 1.5) * vAlpha;

            // Thermodynamic Color Mapping based on distance
            vec3 color = innerColor;
            if (vDistance < 0.1) {
                color = mix(innerColor, midColor, vDistance / 0.1);
            } else if (vDistance < 0.4) {
                color = mix(midColor, outerColor, (vDistance - 0.1) / 0.3);
            } else {
                color = mix(outerColor, fadeColor, (vDistance - 0.4) / 0.6);
                // Outer edges fade out entirely
                alpha *= (1.0 - ((vDistance - 0.4) / 0.6));
            }

            // Apply Doppler beaming to final color and alpha
            color *= vDoppler;
            alpha *= vDoppler;

            // Keep global alpha high enough for visibility
            gl_FragColor = vec4(color, alpha * 0.45);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
};


export default function BlackHoleCore() {
    const groupRef = useRef<THREE.Group | null>(null);
    const diskRef = useRef<THREE.Points | null>(null);

    // Generate Particle Data for Layered Accretion Disk
    const particleData = useMemo(() => {
        const count = 55000; // High density for cinematic feel
        const positions = new Float32Array(count * 3);
        const orbitSpeeds = new Float32Array(count);
        const orbitOffsets = new Float32Array(count);
        const particleSizes = new Float32Array(count);
        const distanceScales = new Float32Array(count);
        const turbulences = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const r = Math.random();
            
            let radius = 1.01;
            let sizeBase = 0.2;
            let thickness = 0.02;
            let turbulenceScale = 0.1;

            if (r < 0.05) {
                // Layer 0: Photon Ring (Extremely close to r=1.0)
                const layerR = r / 0.05;
                radius = 1.01 + layerR * 0.04; // 1.01 to 1.05
                sizeBase = 0.25;
                thickness = 0.005; // extremely thin
                turbulenceScale = 0.01;
            } else if (r < 0.35) {
                // Layer A: Inner Hot Disk (1.05 - 1.6)
                const layerR = (r - 0.05) / 0.30;
                radius = 1.05 + Math.pow(layerR, 2.0) * 0.55;
                sizeBase = 0.25;
                thickness = 0.01 + layerR * 0.04;
                turbulenceScale = 0.02;
            } else if (r < 0.7) {
                // Layer B: Transition Region (1.5 - 3.2)
                const layerR = (r - 0.35) / 0.35;
                radius = 1.5 + Math.pow(layerR, 1.5) * 1.7;
                sizeBase = 0.22;
                thickness = 0.03 + layerR * 0.12;
                turbulenceScale = 0.10;
            } else if (r < 0.9) {
                // Layer C: Outer Disk (2.8 - 5.0)
                const layerR = (r - 0.7) / 0.2;
                radius = 2.8 + layerR * 2.2;
                sizeBase = 0.18;
                thickness = 0.1 + layerR * 0.25;
                turbulenceScale = 0.2;
            } else {
                // Layer D: Dust Micro-particles (1.8 - 6.0)
                const layerR = (r - 0.9) / 0.1;
                radius = 1.8 + layerR * 4.2;
                sizeBase = 0.1; // tiny
                thickness = 0.3 + layerR * 0.4; // scattered widely
                turbulenceScale = 0.4;
            }

            positions[i * 3 + 0] = 0;
            positions[i * 3 + 1] = (Math.random() - 0.5) * thickness;
            positions[i * 3 + 2] = 0;

            // Physics attributes
            orbitSpeeds[i] = 1.0 + Math.random() * 0.4;
            orbitOffsets[i] = Math.random() * Math.PI * 2;
            
            // Random variation per particle
            particleSizes[i] = sizeBase * (0.8 + Math.random() * 0.6);
            distanceScales[i] = radius;
            turbulences[i] = (Math.random() - 0.5) * turbulenceScale;
        }

        return { positions, orbitSpeeds, orbitOffsets, particleSizes, distanceScales, turbulences };
    }, []);

    const diskShaderMat = useMemo(() => new THREE.ShaderMaterial(DiskShaderMaterial), []);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Keep motion slow and elegant
        const time = state.clock.getElapsedTime() * 0.35;

        // Slow cinematic wobble
        groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
        groupRef.current.rotation.y = Math.cos(time * 0.15) * 0.05;

        if (diskShaderMat) {
            diskShaderMat.uniforms.time.value = time;
        }

        if (diskRef.current) {
            diskRef.current.rotation.y = time * -0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* 1. Event Horizon - Pure Black Occlusion Volume */}
            {/* Absolute flat black. No shader, no fresnel, no rim light. Defines the void. */}
            <mesh scale={[1.0, 1.0, 1.0]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#000000" depthWrite={true} />
            </mesh>

            {/* 2. Accretion Disk (Procedural Particle Shader) */}
            <group rotation={[0.3, 0, 0.1]}>
                <points ref={diskRef} frustumCulled={false}>
                    <primitive object={diskShaderMat} attach="material" />
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
