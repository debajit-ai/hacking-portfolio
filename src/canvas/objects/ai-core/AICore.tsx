import { useRef } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

import BlackHoleCore from './BlackHoleCore';

/**
 * AICore — The central computational object of the entire website.
 * Now acts as a realistic black hole centerpiece.
 *
 * Scroll-driven choreography moves the object through the 3D environment
 * in sync with the camera, creating a continuous spatial narrative:
 *
 * HERO:     slightly right, mid-distance
 * VISION:   drifts left and recedes into background
 * ORION:    swings right and pushes forward as centerpiece
 * TECH:     pulls back to center
 * PROJECTS: drifts right background
 * JOURNEY:  far right background
 * CONTACT:  recedes deeply into the distance
 */
export default function AICore(
    props: ThreeElements['group']
) {
    const groupRef = useRef<THREE.Group | null>(null);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const time = state.clock.getElapsedTime();
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        const maxScroll = typeof window !== 'undefined'
            ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
            : 1;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

        let targetX = isMobile ? 0 : 0.8;
        let targetY = isMobile ? 0.5 : 0.0;
        let targetZ = 0.0;
        let targetScale = isMobile ? 0.7 : 0.9;
        let targetRotY = 0;

        if (progress < 0.1) {
            // HERO — right side, prominent but elegant
            const t = progress / 0.1;
            targetX = THREE.MathUtils.lerp(isMobile ? 0 : 0.8, isMobile ? 0 : 0.5, t);
            targetY = THREE.MathUtils.lerp(isMobile ? 0.5 : 0.0, isMobile ? 0.3 : -0.1, t);
            targetZ = THREE.MathUtils.lerp(0.0, -0.5, t);
            targetScale = THREE.MathUtils.lerp(isMobile ? 0.7 : 0.9, isMobile ? 0.8 : 1.0, t);
        } else if (progress < 0.25) {
            // VISION — drift into background, left
            const t = (progress - 0.1) / 0.15;
            targetX = THREE.MathUtils.lerp(isMobile ? 0 : 0.5, isMobile ? 0 : -0.8, t);
            targetY = THREE.MathUtils.lerp(isMobile ? 0.3 : -0.1, isMobile ? 0 : -0.2, t);
            targetZ = THREE.MathUtils.lerp(-0.5, -2.0, t);
            targetScale = THREE.MathUtils.lerp(isMobile ? 0.8 : 1.0, isMobile ? 0.5 : 0.7, t);
            targetRotY = THREE.MathUtils.lerp(0, 0.2, t);
        } else if (progress < 0.4) {
            // ORIONHELIX SHOWCASE — centerpiece, push forward
            const t = (progress - 0.25) / 0.15;
            targetX = THREE.MathUtils.lerp(isMobile ? 0 : -0.8, isMobile ? 0 : 1.6, t);
            targetY = THREE.MathUtils.lerp(isMobile ? 0 : -0.2, isMobile ? -0.3 : -0.15, t);
            // Kept further back in Z to ensure particles don't crowd the text
            targetZ = THREE.MathUtils.lerp(-2.0, -0.5, t); 
            targetScale = THREE.MathUtils.lerp(isMobile ? 0.5 : 0.7, isMobile ? 0.9 : 1.1, t);
            targetRotY = THREE.MathUtils.lerp(0.2, -0.1, t);
        } else if (progress < 0.55) {
            // TECHNOLOGY — pull back center
            const t = (progress - 0.4) / 0.15;
            targetX = THREE.MathUtils.lerp(isMobile ? 0 : 1.6, 0, t);
            targetY = THREE.MathUtils.lerp(isMobile ? -0.3 : -0.15, isMobile ? -0.6 : -0.5, t);
            targetZ = THREE.MathUtils.lerp(0.5, -1.5, t);
            targetScale = THREE.MathUtils.lerp(isMobile ? 0.9 : 1.2, isMobile ? 0.6 : 0.9, t);
            targetRotY = THREE.MathUtils.lerp(-0.1, 0, t);
        } else if (progress < 0.7) {
            // PROJECTS — float right, letting projects take center-left
            const t = (progress - 0.55) / 0.15;
            targetX = THREE.MathUtils.lerp(0, isMobile ? 0 : 1.2, t);
            targetY = THREE.MathUtils.lerp(isMobile ? -0.6 : -0.5, isMobile ? -0.8 : -0.3, t);
            targetZ = THREE.MathUtils.lerp(-1.5, -2.5, t);
            targetScale = THREE.MathUtils.lerp(isMobile ? 0.6 : 0.9, isMobile ? 0.5 : 0.7, t);
            targetRotY = THREE.MathUtils.lerp(0, 0.2, t);
        } else if (progress < 0.85) {
            // JOURNEY — move to upper right background
            const t = (progress - 0.7) / 0.15;
            targetX = THREE.MathUtils.lerp(isMobile ? 0 : 1.2, isMobile ? 0 : 1.8, t);
            targetY = THREE.MathUtils.lerp(isMobile ? -0.8 : -0.3, isMobile ? -0.4 : 0.2, t);
            targetZ = THREE.MathUtils.lerp(-2.5, -4.5, t);
            targetScale = THREE.MathUtils.lerp(isMobile ? 0.5 : 0.7, isMobile ? 0.4 : 0.6, t);
            targetRotY = THREE.MathUtils.lerp(0.2, 0.3, t);
        } else {
            // CONTACT — recede into distance
            const t = (progress - 0.85) / 0.15;
            targetX = THREE.MathUtils.lerp(isMobile ? 0 : 1.8, 0, t);
            targetY = THREE.MathUtils.lerp(isMobile ? -0.4 : 0.2, isMobile ? -1.0 : -0.8, t);
            targetZ = THREE.MathUtils.lerp(-4.5, -6.0, t);
            targetScale = THREE.MathUtils.lerp(isMobile ? 0.4 : 0.6, isMobile ? 0.3 : 0.4, t);
        }

        // Subtle time-based float
        const floatY = Math.sin(time * 0.3) * 0.03;
        const floatX = Math.cos(time * 0.2) * 0.02;

        const damping = 1.8;
        groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX + floatX, damping, delta);
        groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY + floatY, damping, delta);
        groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, damping, delta);

        const currentScale = groupRef.current.scale.x;
        const nextScale = THREE.MathUtils.damp(currentScale, targetScale, damping, delta);
        groupRef.current.scale.set(nextScale, nextScale, nextScale);

        // Subtle rotation response to scroll
        groupRef.current.rotation.y = THREE.MathUtils.damp(
            groupRef.current.rotation.y,
            targetRotY + time * 0.01,
            damping,
            delta
        );
    });

    return (
        <group ref={groupRef} {...props}>
            <BlackHoleCore />
        </group>
    );
}