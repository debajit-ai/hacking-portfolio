import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Constants ─── */
const DUST_COUNT = 300;
const DUST_RADIUS = 30;
const STAR_FAR_COUNT = 350;
const STAR_MID_COUNT = 120;
const STAR_NEAR_COUNT = 30;
const STAR_RADIUS = 75;

/* ─── Geometry helpers ─── */
function sphericalRandom(radius: number, minRadius = 0): [number, number, number] {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = minRadius + (radius - minRadius) * Math.cbrt(Math.random());
    return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
    ];
}

/* ─── Procedural Circular Texture ─── */
function createCircleTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
        context.beginPath();
        context.arc(32, 32, 30, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

/* ─── Procedural Soft Radial Nebula Texture ─── */
function createNebulaTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

/* ─── Custom Twinkle Material ─── */
const TwinkleShaderMaterial = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#ffffff') },
        map: { value: null },
    },
    vertexShader: `
        attribute float twinkleSpeed;
        attribute float twinkleOffset;
        attribute float scale;
        varying float vAlpha;
        uniform float time;
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = scale * (300.0 / -mvPosition.z);
            
            // Twinkle calculation
            float t = time * twinkleSpeed + twinkleOffset;
            vAlpha = 0.3 + 0.7 * sin(t); // Pulsates between 0.3 and 1.0 multiplier
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform sampler2D map;
        varying float vAlpha;
        void main() {
            vec4 texColor = texture2D(map, gl_PointCoord);
            if(texColor.a < 0.1) discard;
            gl_FragColor = vec4(color, texColor.a * vAlpha);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
};


/* ─── Component ─── */
export default function Atmosphere() {
    const dustRef = useRef<THREE.Points | null>(null);
    const starsFarRef = useRef<THREE.Points | null>(null);
    const starsMidRef = useRef<THREE.Points | null>(null);
    const starsNearRef = useRef<THREE.Points | null>(null);
    const nebulaRef = useRef<THREE.Points | null>(null);

    const circleTexture = useMemo(() => createCircleTexture(), []);
    const nebulaTexture = useMemo(() => createNebulaTexture(), []);

    // We will memoize the custom material instance so we can update its uniform.time
    const midStarMaterial = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            ...TwinkleShaderMaterial,
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color('#94a3b8') }, // Slightly cool mid stars
                map: { value: circleTexture },
            }
        });
        return mat;
    }, [circleTexture]);

    /* Near-field volumetric dust */
    const dustPositions = useMemo(() => {
        const buf = new Float32Array(DUST_COUNT * 3);
        for (let i = 0; i < DUST_COUNT; i++) {
            const [x, y, z] = sphericalRandom(DUST_RADIUS);
            buf[i * 3] = x;
            buf[i * 3 + 1] = y;
            buf[i * 3 + 2] = z;
        }
        return buf;
    }, []);

    /* Far-field deep-space stars (Static, dim) */
    const starsFarPositions = useMemo(() => {
        const buf = new Float32Array(STAR_FAR_COUNT * 3);
        for (let i = 0; i < STAR_FAR_COUNT; i++) {
            const [x, y, z] = sphericalRandom(STAR_RADIUS + 30, STAR_RADIUS - 10);
            buf[i * 3] = x;
            buf[i * 3 + 1] = y;
            buf[i * 3 + 2] = z;
        }
        return buf;
    }, []);

    /* Mid-field stars (Twinkling) */
    const { midPositions, midScales, midSpeeds, midOffsets } = useMemo(() => {
        const buf = new Float32Array(STAR_MID_COUNT * 3);
        const scales = new Float32Array(STAR_MID_COUNT);
        const speeds = new Float32Array(STAR_MID_COUNT);
        const offsets = new Float32Array(STAR_MID_COUNT);
        
        for (let i = 0; i < STAR_MID_COUNT; i++) {
            const [x, y, z] = sphericalRandom(STAR_RADIUS - 15, STAR_RADIUS - 40);
            buf[i * 3] = x;
            buf[i * 3 + 1] = y;
            buf[i * 3 + 2] = z;
            
            // Only 10% of stars twinkle actively, the rest are very slow or static
            const isActiveTwinkler = Math.random() > 0.9;
            speeds[i] = isActiveTwinkler ? 1.5 + Math.random() * 1.5 : 0.05 + Math.random() * 0.1;
            offsets[i] = Math.random() * Math.PI * 2;
            scales[i] = 0.015 + Math.random() * 0.02; // Varied sizes
        }
        return { midPositions: buf, midScales: scales, midSpeeds: speeds, midOffsets: offsets };
    }, []);

    /* Near-field stars (Strong parallax, distinct) */
    const starsNearPositions = useMemo(() => {
        const buf = new Float32Array(STAR_NEAR_COUNT * 3);
        for (let i = 0; i < STAR_NEAR_COUNT; i++) {
            const [x, y, z] = sphericalRandom(STAR_RADIUS - 40, 10);
            buf[i * 3] = x;
            buf[i * 3 + 1] = y;
            buf[i * 3 + 2] = z;
        }
        return buf;
    }, []);

    /* Localized Nebula Wisps */
    const nebulaPositions = useMemo(() => {
        const count = 4;
        const buf = new Float32Array(count * 3);
        // Distant top right
        buf[0] = 30; buf[1] = 20; buf[2] = -40;
        // Distant bottom left
        buf[3] = -40; buf[4] = -15; buf[5] = -35;
        // Mid right
        buf[6] = 25; buf[7] = -10; buf[8] = -25;
        // Far back
        buf[9] = 0; buf[10] = 30; buf[11] = -50;
        return buf;
    }, []);
    const nebulaColors = useMemo(() => {
        const count = 4;
        const buf = new Float32Array(count * 3);
        const col1 = new THREE.Color('#1e1b4b'); // Deep indigo
        const col2 = new THREE.Color('#312e81'); // Indigo
        const col3 = new THREE.Color('#0f172a'); // Slate
        
        buf.set([col1.r, col1.g, col1.b], 0);
        buf.set([col2.r, col2.g, col2.b], 3);
        buf.set([col3.r, col3.g, col3.b], 6);
        buf.set([col1.r, col1.g, col1.b], 9);
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
        const scrollFactor = scrollY * 0.0001;

        // Pointer parallax targets
        const px = pointerRef.current.x;
        const py = pointerRef.current.y;

        /* Update custom twinkle shader time */
        if (midStarMaterial) {
            midStarMaterial.uniforms.time.value = time;
        }

        /* Dust field — slow rotation with scroll coupling and parallax */
        if (dustRef.current) {
            dustRef.current.rotation.y += delta * 0.006 + scrollFactor;
            dustRef.current.rotation.x += delta * 0.003;
            dustRef.current.position.x = THREE.MathUtils.lerp(dustRef.current.position.x, px * 0.5, 0.05);
            dustRef.current.position.y = THREE.MathUtils.lerp(dustRef.current.position.y, py * -0.5, 0.05);
        }

        /* Star fields — varying parallax based on depth */
        if (starsFarRef.current) {
            starsFarRef.current.rotation.y = time * 0.0002 + scrollFactor * 0.1;
            starsFarRef.current.position.x = THREE.MathUtils.lerp(starsFarRef.current.position.x, px * 0.02, 0.02);
            starsFarRef.current.position.y = THREE.MathUtils.lerp(starsFarRef.current.position.y, py * -0.02, 0.02);
        }
        
        if (starsMidRef.current) {
            starsMidRef.current.rotation.y = time * 0.0005 + scrollFactor * 0.2;
            starsMidRef.current.position.x = THREE.MathUtils.lerp(starsMidRef.current.position.x, px * 0.1, 0.03);
            starsMidRef.current.position.y = THREE.MathUtils.lerp(starsMidRef.current.position.y, py * -0.1, 0.03);
        }

        if (starsNearRef.current) {
            starsNearRef.current.rotation.y = time * 0.001 + scrollFactor * 0.4;
            starsNearRef.current.position.x = THREE.MathUtils.lerp(starsNearRef.current.position.x, px * 0.3, 0.05);
            starsNearRef.current.position.y = THREE.MathUtils.lerp(starsNearRef.current.position.y, py * -0.3, 0.05);
        }

        /* Nebula slow drift */
        if (nebulaRef.current) {
            nebulaRef.current.rotation.y = time * 0.001;
            nebulaRef.current.rotation.z = time * -0.0005;
        }
    });

    return (
        <group>
            {/* Cinematic Fog — pure black */}
            <fog attach="fog" args={['#010101', 25, 75]} />

            {/* Localized Nebula Wisps instead of global boxes */}
            <points ref={nebulaRef} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[nebulaPositions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[nebulaColors, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={nebulaTexture}
                    size={45} // Huge soft sprites
                    transparent
                    opacity={0.05} // Extremely subtle
                    vertexColors
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Near-field volumetric dust particles */}
            <points ref={dustRef} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={circleTexture}
                    color="#64748b"
                    size={0.015}
                    transparent
                    opacity={0.08}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    alphaTest={0.01}
                />
            </points>

            {/* Stars Layer 1: Far Field (Dim, static) */}
            <points ref={starsFarRef} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[starsFarPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={circleTexture}
                    color="#475569" // Very dim distant stars
                    size={0.01}
                    transparent
                    opacity={0.15}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    alphaTest={0.01}
                />
            </points>

            {/* Stars Layer 2: Mid Field (Twinkling) */}
            <points ref={starsMidRef} frustumCulled={false} material={midStarMaterial}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[midPositions, 3]} />
                    <bufferAttribute attach="attributes-scale" args={[midScales, 1]} />
                    <bufferAttribute attach="attributes-twinkleSpeed" args={[midSpeeds, 1]} />
                    <bufferAttribute attach="attributes-twinkleOffset" args={[midOffsets, 1]} />
                </bufferGeometry>
            </points>

            {/* Stars Layer 3: Near Field (Brighter, strong parallax) */}
            <points ref={starsNearRef} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[starsNearPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={circleTexture}
                    color="#f8fafc" // White/crisp near stars
                    size={0.025}
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    alphaTest={0.01}
                />
            </points>
        </group>
    );
}