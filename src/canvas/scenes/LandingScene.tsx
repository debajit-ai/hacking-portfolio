import MainCamera from '@/canvas/cameras/MainCamera';
import MainLighting from '../lights/MainLighting';
import AICore from '../objects/ai-core/AICore';
import Atmosphere from '@/canvas/environment/Atmosphere';
import PostProcessing from '@/canvas/postprocessing/PostProcessing';

export default function LandingScene() {
    return (
        <>
            <MainCamera />
            <MainLighting />
            <Atmosphere />
            <AICore />
            <PostProcessing />
        </>
    );
}