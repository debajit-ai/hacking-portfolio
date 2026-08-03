"use client";

import { Canvas } from "@react-three/fiber";

export default function EngineCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [0, 0, 6],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
    >
      <color attach="background" args={["#000000"]} />
    </Canvas>
  );
}