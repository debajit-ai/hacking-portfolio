import type { ThreeElements } from '@react-three/fiber';

import ObsidianCore from './ObsidianCore';
import MobiusRing from './MobiusRing';

export default function AICore(
    props: ThreeElements['group']
) {
    return (
        <group {...props}>
            <MobiusRing />
            <ObsidianCore />
        </group>
    );
}