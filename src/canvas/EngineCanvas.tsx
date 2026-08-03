'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import type { ReactElement } from 'react';
import SceneManager from '@/canvas/SceneManager';

export default function EngineCanvas(): ReactElement {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        stencil: false,
        depth: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000,
        position: [0, 0, 5],
      }}
      shadows
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneManager />
      </Suspense>
    </Canvas>
  );
}