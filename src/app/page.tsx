import type { ReactElement } from 'react';

import BackgroundEngine from '@/components/background/BackgroundEngine';
import EngineCanvas from '@/canvas/EngineCanvas';
import Navbar from '@/components/navigation/Navbar';

import Hero from '@/sections/hero/hero';
import Vision from '@/sections/Vision/Vision';
import OrionShowcase from '@/sections/orion-showcase/OrionShowcase';
import Technology from '@/sections/technology/Technology';
import Projects from '@/sections/projects/Projects';
import Journey from '@/sections/journey/Journey';
import Contact from '@/sections/contact/Contact';

export default function Page(): ReactElement {
    return (
        <>
            <BackgroundEngine />

            <EngineCanvas />

            <Navbar />

            <main className="relative z-10">
                <Hero />

                <Vision />

                <OrionShowcase />

                <Technology />

                <Projects />

                <Journey />

                <Contact />
            </main>
        </>
    );
}