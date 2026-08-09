import { useMemo } from 'react';
import {
    EffectComposer,
    Bloom,
    Noise,
    ToneMapping
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * PostProcessing — Extremely subtle cinematic polish.
 *
 * "Why does this look so good?" — not — "Wow, lots of effects."
 *
 * Only:
 * - Very subtle bloom (emissive energy catch)
 * - Tone mapping (cinematic color response)
 * - Micro film grain (organic texture)
 *
 * NO chromatic aberration, NO heavy glow, NO gaming effects.
 */
export default function PostProcessing() {
    return (
        <EffectComposer multisampling={2}>
            <Bloom
                intensity={0.15}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.05}
                blendFunction={BlendFunction.SCREEN}
            />
            <ToneMapping />
            <Noise
                premultiply
                blendFunction={BlendFunction.SOFT_LIGHT}
                opacity={0.025}
            />
        </EffectComposer>
    );
}