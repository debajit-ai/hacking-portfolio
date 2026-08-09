import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MainCamera — Cinematic scroll-driven camera system.
 *
 * The camera travels through the 3D environment as the user scrolls,
 * creating a continuous fly-through experience rather than a slideshow.
 *
 * Pointer position adds subtle parallax to reinforce 3D depth.
 */
export default function MainCamera() {
    const { camera } = useThree();

    const currentLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
    const targetPosition = useMemo(() => new THREE.Vector3(0, 0.2, 8), []);
    const targetLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
    const pointerRef = useRef({ x: 0, y: 0 });

    // Listen for pointer movement (subtle parallax)
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

        // Calculate scroll progress [0, 1]
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        const maxScroll = typeof window !== 'undefined'
            ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
            : 1;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        // Pointer parallax influence
        const px = pointerRef.current.x * 0.08;
        const py = pointerRef.current.y * -0.05;

        // ─── Camera keyframes along the scroll journey ───
        let baseCamX = 0;
        let baseCamY = 0.2;
        let baseCamZ = 8;
        let baseLookX = 0;
        let baseLookY = 0;
        let baseLookZ = 0;

        if (progress < 0.1) {
            // HERO — wide establishing shot, slightly right of AI Core
            const t = progress / 0.1;
            baseCamX = THREE.MathUtils.lerp(0, -0.5, t);
            baseCamY = THREE.MathUtils.lerp(0.2, 0.1, t);
            baseCamZ = THREE.MathUtils.lerp(8, 6.5, t);
            baseLookX = THREE.MathUtils.lerp(0, 0.1, t);
            baseLookY = THREE.MathUtils.lerp(0, -0.05, t);
        } else if (progress < 0.25) {
            // VISION — camera drifts left and deeper
            const t = (progress - 0.1) / 0.15;
            baseCamX = THREE.MathUtils.lerp(-0.5, -1.0, t);
            baseCamY = THREE.MathUtils.lerp(0.1, -0.1, t);
            baseCamZ = THREE.MathUtils.lerp(6.5, 5.0, t);
            baseLookX = THREE.MathUtils.lerp(0.1, 0.4, t);
            baseLookY = THREE.MathUtils.lerp(-0.05, -0.15, t);
            baseLookZ = THREE.MathUtils.lerp(0, -1, t);
        } else if (progress < 0.4) {
            // ORIONHELIX SHOWCASE — camera swings right and pushes close
            const t = (progress - 0.25) / 0.15;
            baseCamX = THREE.MathUtils.lerp(-1.0, 0.6, t);
            baseCamY = THREE.MathUtils.lerp(-0.1, -0.05, t);
            baseCamZ = THREE.MathUtils.lerp(5.0, 3.8, t);
            baseLookX = THREE.MathUtils.lerp(0.4, 1.2, t);
            baseLookY = THREE.MathUtils.lerp(-0.15, -0.1, t);
            baseLookZ = THREE.MathUtils.lerp(-1, -0.5, t);
        } else if (progress < 0.55) {
            // TECHNOLOGY — camera pulls back and centers
            const t = (progress - 0.4) / 0.15;
            baseCamX = THREE.MathUtils.lerp(0.6, 0.0, t);
            baseCamY = THREE.MathUtils.lerp(-0.05, -0.2, t);
            baseCamZ = THREE.MathUtils.lerp(3.8, 5.5, t);
            baseLookX = THREE.MathUtils.lerp(1.2, 0.0, t);
            baseLookY = THREE.MathUtils.lerp(-0.1, -0.2, t);
            baseLookZ = THREE.MathUtils.lerp(-0.5, -2, t);
        } else if (progress < 0.7) {
            // PROJECTS — camera pans slightly left and drops down
            const t = (progress - 0.55) / 0.15;
            baseCamX = THREE.MathUtils.lerp(0.0, -0.6, t);
            baseCamY = THREE.MathUtils.lerp(-0.2, -0.3, t);
            baseCamZ = THREE.MathUtils.lerp(5.5, 4.5, t);
            baseLookX = THREE.MathUtils.lerp(0.0, -0.4, t);
            baseLookY = THREE.MathUtils.lerp(-0.2, -0.1, t);
            baseLookZ = THREE.MathUtils.lerp(-2, -1, t);
        } else if (progress < 0.85) {
            // JOURNEY — camera travels forward through a spatial corridor
            const t = (progress - 0.7) / 0.15;
            baseCamX = THREE.MathUtils.lerp(-0.6, 0.4, t);
            baseCamY = THREE.MathUtils.lerp(-0.3, -0.1, t);
            baseCamZ = THREE.MathUtils.lerp(4.5, 3.0, t);
            baseLookX = THREE.MathUtils.lerp(-0.4, 0.6, t);
            baseLookY = THREE.MathUtils.lerp(-0.1, 0.0, t);
            baseLookZ = THREE.MathUtils.lerp(-1, 0, t);
        } else {
            // CONTACT — camera retreats, environment calms
            const t = (progress - 0.85) / 0.15;
            baseCamX = THREE.MathUtils.lerp(0.4, 0.0, t);
            baseCamY = THREE.MathUtils.lerp(-0.1, -0.4, t);
            baseCamZ = THREE.MathUtils.lerp(3.0, 7.0, t);
            baseLookX = THREE.MathUtils.lerp(0.6, 0.0, t);
            baseLookY = THREE.MathUtils.lerp(0.0, -0.3, t);
            baseLookZ = THREE.MathUtils.lerp(0, -4, t);
        }

        // Organic camera drift (breathing)
        const driftX = Math.sin(time * 0.05) * 0.06;
        const driftY = Math.cos(time * 0.035) * 0.04;
        const driftZ = Math.sin(time * 0.025) * 0.04;

        targetPosition.set(
            baseCamX + driftX + px,
            baseCamY + driftY + py,
            baseCamZ + driftZ
        );
        targetLookAt.set(baseLookX, baseLookY, baseLookZ);

        // Smooth damping — never snap
        const damping = 2.0;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPosition.x, damping, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPosition.y, damping, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPosition.z, damping, delta);

        currentLookAt.x = THREE.MathUtils.damp(currentLookAt.x, targetLookAt.x, damping, delta);
        currentLookAt.y = THREE.MathUtils.damp(currentLookAt.y, targetLookAt.y, damping, delta);
        currentLookAt.z = THREE.MathUtils.damp(currentLookAt.z, targetLookAt.z, damping, delta);

        camera.lookAt(currentLookAt);
    });

    return null;
}