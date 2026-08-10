import type { ReactElement } from 'react';

import BackgroundEngine from '@/components/background/BackgroundEngine';
import EngineCanvas from '@/canvas/EngineCanvas';
import Navbar from '@/components/navigation/Navbar';

import Hero from '@/sections/hero/hero';
import Manifesto from '@/sections/manifesto/Manifesto';
import Vision from '@/sections/Vision/Vision';
import OrionShowcase from '@/sections/orion-showcase/OrionShowcase';
import IntelligenceArchitecture from '@/sections/intelligence-architecture/IntelligenceArchitecture';
import Technology from '@/sections/technology/Technology';
import Projects from '@/sections/projects/Projects';
import CompanyPrinciples from '@/sections/principles/CompanyPrinciples';
import Journey from '@/sections/journey/Journey';
import Roadmap from '@/sections/roadmap/Roadmap';
import Contact from '@/sections/contact/Contact';

export default function Page(): ReactElement {
    return (
        <>
            <BackgroundEngine />

            <EngineCanvas />

            <Navbar />

            <main className="relative z-10">
                <Hero />
                <Manifesto />
                <Vision />
                <OrionShowcase />
                <IntelligenceArchitecture />
                <Technology />
                <Projects />
                <CompanyPrinciples />
                <Journey />
                <Roadmap />
                <Contact />
            </main>
        </>
    );
}