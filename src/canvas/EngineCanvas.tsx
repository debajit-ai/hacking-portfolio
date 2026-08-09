'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import type { ReactElement } from 'react';
import SceneManager from '@/canvas/SceneManager';

export default function EngineCanvas(): ReactElement {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{
          fov: 50,
          near: 0.1,
          far: 200,
          position: [0, 0.2, 8],
        }}
        shadows={false}
        frameloop="always"
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <SceneManager />
        </Suspense>
      </Canvas>
    </div>
  );
}