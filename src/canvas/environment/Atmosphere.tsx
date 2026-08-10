import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Constants ─── */
const STAR_COUNT = 8000;
const DUST_COUNT = 1500;
const SCENE_RADIUS = 150;

/* ─── Deterministic PRNG (Mulberry32) ─── */
function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
const rng = mulberry32(1337); // Fixed seed for stable universe

/* ─── Star Colors ─── */
const STAR_COLORS = [
    new THREE.Color('#f8fafc'), // Cool white
    new THREE.Color('#e2e8f0'), // Slate white
    new THREE.Color('#bae6fd'), // Faint pale blue
    new THREE.Color('#fef08a'), // Faint pale yellow
    new THREE.Color('#fdf8f5'), // Faint warm white
];

function getRandomStarColor() {
    const r = rng();
    if (r > 0.95) return STAR_COLORS[2]; // 5% blue
    if (r > 0.90) return STAR_COLORS[3]; // 5% yellow
    if (r > 0.85) return STAR_COLORS[4]; // 5% warm
    if (r > 0.50) return STAR_COLORS[0]; // 35% cool white
    return STAR_COLORS[1];               // 50% slate white
}

/* ─── Clustered Generation ─── */
// Creates natural variation: clusters of stars and vast empty regions
function getClusteredPosition(): [number, number, number] {
    // Determine which "cluster" this star belongs to
    const clusterAngle1 = rng() * Math.PI * 2;
    const clusterAngle2 = rng() * Math.PI;
    const clusterRadius = SCENE_RADIUS * 0.3 + rng() * SCENE_RADIUS * 0.7;

    const cx = clusterRadius * Math.sin(clusterAngle2) * Math.cos(clusterAngle1);
    const cy = clusterRadius * Math.sin(clusterAngle2) * Math.sin(clusterAngle1);
    const cz = clusterRadius * Math.cos(clusterAngle2);

    // Add local dispersion around the cluster center
    const dispersion = SCENE_RADIUS * (0.1 + rng() * 0.3); // High dispersion for softness
    const u = rng();
    const v = rng();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = dispersion * Math.cbrt(rng());

    return [
        cx + r * Math.sin(phi) * Math.cos(theta),
        cy + r * Math.sin(phi) * Math.sin(theta),
        cz + r * Math.cos(phi)
    ];
}

/* ─── Procedural Soft Dust Texture ─── */
function createDustTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.3, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

/* ─── Custom Dust Shader with Occlusion ─── */
const DustShaderMaterial = {
    uniforms: {
        color: { value: new THREE.Color('#080c14') },
        map: { value: null },
        opacity: { value: 0.015 },
        blackHolePos: { value: new THREE.Vector3(0, -999, 0) },
        blackHoleScale: { value: 1.0 }
    },
    vertexShader: `
        uniform vec3 blackHolePos;
        uniform float blackHoleScale;
        varying float vOcclusion;
        
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // --- BLACK HOLE ACCRETION DISK OCCLUSION MASK ---
            vec4 bhView = viewMatrix * vec4(blackHolePos, 1.0);
            vec2 dustRay = mvPosition.xy / mvPosition.z;
            vec2 bhRay = bhView.xy / bhView.z;
            float apparentDist = distance(dustRay, bhRay);
            
            // Radius 6.5 safely covers the entire accretion disk
            float apparentMaskRadius = (6.5 * blackHoleScale) / abs(bhView.z);
            vOcclusion = (apparentDist < apparentMaskRadius) ? 0.0 : 1.0;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_Position.z = gl_Position.w * 0.99999;
            
            gl_PointSize = 25.0 * (300.0 / -mvPosition.z);
            if (vOcclusion == 0.0) {
                gl_PointSize = 0.0;
            }
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform sampler2D map;
        uniform float opacity;
        varying float vOcclusion;
        
        void main() {
            if (vOcclusion == 0.0) discard;
            vec4 texColor = texture2D(map, gl_PointCoord);
            gl_FragColor = vec4(color, texColor.a * opacity);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
};

/* ─── Custom Star Shader ─── */
const CinematicStarShader = {
    uniforms: {
        time: { value: 0 },
        blackHolePos: { value: new THREE.Vector3(0, -999, 0) },
        blackHoleScale: { value: 1.0 }
    },
    vertexShader: `
        attribute vec3 customColor;
        attribute float size;
        attribute float twinkleSpeed;
        attribute float twinklePhase;
        
        uniform float time;
        uniform vec3 blackHolePos;
        uniform float blackHoleScale;
        
        varying vec3 vColor;
        varying float vAlpha;
        varying float vOcclusion;
        
        void main() {
            vColor = customColor;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // --- BLACK HOLE ACCRETION DISK OCCLUSION MASK ---
            vec4 bhView = viewMatrix * vec4(blackHolePos, 1.0);
            vec2 starRay = mvPosition.xy / mvPosition.z;
            vec2 bhRay = bhView.xy / bhView.z;
            float apparentDist = distance(starRay, bhRay);
            
            // Radius 6.5 covers the entire accretion disk volume.
            // Any star within this apparent radius is perfectly occluded.
            float apparentMaskRadius = (6.5 * blackHoleScale) / abs(bhView.z);
            vOcclusion = (apparentDist < apparentMaskRadius) ? 0.0 : 1.0;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_Position.z = gl_Position.w * 0.99999;
            
            gl_PointSize = size * (300.0 / -mvPosition.z);
            
            // Calculate scintillation (twinkle)
            if (twinkleSpeed > 0.0) {
                float t = time * twinkleSpeed + twinklePhase;
                // Extremely subtle pulsation for twinkling stars
                vAlpha = 0.2 + 0.8 * abs(sin(t)); 
            } else {
                // Default stars are dim, slightly brighter if larger
                vAlpha = 0.15 + (size * 0.5);
            }
            
            // Fade out very distant stars
            float depthFade = smoothstep(50.0, 300.0, -mvPosition.z);
            vAlpha *= (1.0 - depthFade * 0.8);
            
            if (vOcclusion == 0.0) {
                vAlpha = 0.0;
                gl_PointSize = 0.0;
            }
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vOcclusion;
        
        void main() {
            if (vOcclusion == 0.0) discard;
            // Procedural crisp circle with slight soft edge
            vec2 pt = gl_PointCoord - vec2(0.5);
            float r = length(pt);
            if (r > 0.5) discard;
            
            // Soft anti-aliased edge
            float intensity = 1.0 - smoothstep(0.3, 0.5, r);
            
            // Slight optical bloom in center
            float bloom = 1.0 - smoothstep(0.0, 0.2, r);
            intensity = max(intensity, bloom * 1.5);
            
            gl_FragColor = vec4(vColor, intensity * vAlpha);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
};


/* ─── Component ─── */
export default function Atmosphere() {
    const starsRef = useRef<THREE.Points | null>(null);
    const dustRef = useRef<THREE.Points | null>(null);
    const dustTexture = useMemo(() => createDustTexture(), []);

    // Create custom material instances
    const starMaterial = useMemo(() => new THREE.ShaderMaterial({ ...CinematicStarShader }), []);
    const dustMaterial = useMemo(() => {
        const mat = new THREE.ShaderMaterial({ ...DustShaderMaterial });
        mat.uniforms.map.value = dustTexture;
        return mat;
    }, [dustTexture]);
    
    // Store Black Hole tracking state
    const bhState = useRef({ pos: new THREE.Vector3(0, -999, 0), scale: 1.0 });

    /* Generate Cinematic Starfield */
    const { positions, colors, sizes, twinkleSpeeds, twinklePhases } = useMemo(() => {
        const pBuf = new Float32Array(STAR_COUNT * 3);
        const cBuf = new Float32Array(STAR_COUNT * 3);
        const sBuf = new Float32Array(STAR_COUNT);
        const tsBuf = new Float32Array(STAR_COUNT);
        const tpBuf = new Float32Array(STAR_COUNT);
        
        for (let i = 0; i < STAR_COUNT; i++) {
            const [x, y, z] = getClusteredPosition();
            pBuf[i * 3] = x;
            pBuf[i * 3 + 1] = y;
            pBuf[i * 3 + 2] = z;
            
            const color = getRandomStarColor();
            cBuf[i * 3] = color.r;
            cBuf[i * 3 + 1] = color.g;
            cBuf[i * 3 + 2] = color.b;

            // Exponential size distribution: heavily weighted toward microscopic
            const sizeRand = rng();
            let size = 0.1;
            if (sizeRand > 0.999) {
                size = 0.8 + rng() * 0.5; // <0.1% Rare "bright" stars
            } else if (sizeRand > 0.98) {
                size = 0.3 + rng() * 0.3; // ~2% Medium stars
            } else {
                size = 0.02 + rng() * 0.12; // 98% Microscopic faint points
            }
            
            sBuf[i] = size;

            // Twinkle: only <5% of stars actively twinkle, rest are perfectly stable
            const isTwinkler = rng() > 0.96;
            tsBuf[i] = isTwinkler ? 0.05 + rng() * 0.15 : 0.0;
            tpBuf[i] = rng() * Math.PI * 2;
        }
        return { positions: pBuf, colors: cBuf, sizes: sBuf, twinkleSpeeds: tsBuf, twinklePhases: tpBuf };
    }, []);

    /* Generate Extremely Subtle Deep Cosmic Haze */
    const dustPositions = useMemo(() => {
        const buf = new Float32Array(DUST_COUNT * 3);
        for (let i = 0; i < DUST_COUNT; i++) {
            // Cluster the dust sparsely in the background
            const clusterAngle1 = rng() * Math.PI * 2;
            const clusterAngle2 = rng() * Math.PI;
            const cx = SCENE_RADIUS * 0.8 * Math.sin(clusterAngle2) * Math.cos(clusterAngle1);
            const cy = SCENE_RADIUS * 0.8 * Math.sin(clusterAngle2) * Math.sin(clusterAngle1);
            const cz = SCENE_RADIUS * 0.8 * Math.cos(clusterAngle2);

            const r = 40 * Math.cbrt(rng());
            const u = rng();
            const v = rng();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            buf[i * 3] = cx + r * Math.sin(phi) * Math.cos(theta);
            buf[i * 3 + 1] = cy + r * Math.sin(phi) * Math.sin(theta);
            buf[i * 3 + 2] = cz + r * Math.cos(phi);
        }
        return buf;
    }, []);

    // Pointer parallax reference
    const pointerRef = useRef({ x: 0, y: 0 });

    if (typeof window !== 'undefined') {
        const handler = (e: MouseEvent) => {
            pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        if (typeof window !== 'undefined' && !pointerRef.current.x && !pointerRef.current.y) {
            window.addEventListener('mousemove', handler, { passive: true });
        }
    }

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        
        // Extremely slow monumental rotation
        const scrollRotation = scrollY * 0.00002;
        const timeRotation = time * 0.00005;

        // Pointer parallax targets
        const px = pointerRef.current.x;
        const py = pointerRef.current.y;

        // Dynamically track the Black Hole's position for perfect shader masking
        let found = false;
        state.scene.traverse((child: any) => {
            if (!found && child.isMesh && child.geometry && child.geometry.type === 'SphereGeometry') {
                if (child.material && child.material.type === 'MeshBasicMaterial') {
                    if (child.material.color.getHex() === 0x000000) {
                        child.getWorldPosition(bhState.current.pos);
                        const scaleVec = new THREE.Vector3();
                        child.getWorldScale(scaleVec);
                        bhState.current.scale = scaleVec.x;
                        found = true;
                    }
                }
            }
        });

        /* Update custom shader uniforms */
        if (starMaterial) {
            starMaterial.uniforms.time.value = time;
            starMaterial.uniforms.blackHolePos.value.copy(bhState.current.pos);
            starMaterial.uniforms.blackHoleScale.value = bhState.current.scale;
        }
        if (dustMaterial) {
            dustMaterial.uniforms.blackHolePos.value.copy(bhState.current.pos);
            dustMaterial.uniforms.blackHoleScale.value = bhState.current.scale;
        }

        /* Starfield slow monumental drift & parallax */
        if (starsRef.current) {
            starsRef.current.rotation.y = timeRotation + scrollRotation;
            starsRef.current.rotation.x = timeRotation * 0.5;
            
            // Parallax
            starsRef.current.position.x = THREE.MathUtils.lerp(starsRef.current.position.x, px * 2.0, 0.02);
            starsRef.current.position.y = THREE.MathUtils.lerp(starsRef.current.position.y, py * -2.0, 0.02);
        }

        /* Dust field slow drift */
        if (dustRef.current) {
            dustRef.current.rotation.y = timeRotation * 0.8 + scrollRotation * 1.5;
            dustRef.current.rotation.z = timeRotation * 0.3;
            
            // Parallax
            dustRef.current.position.x = THREE.MathUtils.lerp(dustRef.current.position.x, px * 3.0, 0.02);
            dustRef.current.position.y = THREE.MathUtils.lerp(dustRef.current.position.y, py * -3.0, 0.02);
        }
    });

    return (
        <group>
            {/* 
                Deep Space Fog 
                Pure deep black to preserve cinematic void.
            */}
            <fog attach="fog" args={['#000000', 50, 250]} />

            {/* Subtle Deep Cosmic Haze */}
            <points ref={dustRef} frustumCulled={false} material={dustMaterial}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
                </bufferGeometry>
            </points>

            {/* Unified High-Performance Starfield */}
            <points ref={starsRef} frustumCulled={false} material={starMaterial}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-customColor" args={[colors, 3]} />
                    <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
                    <bufferAttribute attach="attributes-twinkleSpeed" args={[twinkleSpeeds, 1]} />
                    <bufferAttribute attach="attributes-twinklePhase" args={[twinklePhases, 1]} />
                </bufferGeometry>
            </points>
        </group>
    );
}