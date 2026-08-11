import type { ReactElement } from 'react';

import BackgroundEngine from '@/components/background/BackgroundEngine';
import EngineCanvas from '@/canvas/EngineCanvas';
import Navbar from '@/components/navigation/Navbar';

import Hero from '@/sections/hero/hero';
import Ecosystem from '@/sections/ecosystem/Ecosystem';
import Manifesto from '@/sections/manifesto/Manifesto';
import FounderPhilosophy from '@/sections/founder-philosophy/FounderPhilosophy';
import OrionShowcase from '@/sections/orion-showcase/OrionShowcase';
import EngineeringStack from '@/sections/engineering-stack/EngineeringStack';
import IntelligenceArchitecture from '@/sections/intelligence-architecture/IntelligenceArchitecture';
import Technology from '@/sections/technology/Technology';
import Projects from '@/sections/projects/Projects';
import ResearchLab from '@/sections/research-lab/ResearchLab';
import CompanyPrinciples from '@/sections/principles/CompanyPrinciples';
import Journey from '@/sections/journey/Journey';
import FounderProfile from '@/sections/founder-profile/FounderProfile';
import Roadmap from '@/sections/roadmap/Roadmap';
import Contact from '@/sections/contact/Contact';

// --- NEW SECTIONS ---
import AdvancedResearch from '@/sections/advanced-research/AdvancedResearch';
import OrionArchitecture from '@/sections/orion-architecture/OrionArchitecture';
import SingularityTechStack from '@/sections/singularity-tech-stack/SingularityTechStack';
import ExperimentalSystems from '@/sections/experimental-systems-new/ExperimentalSystems';
import BuildTimeline from '@/sections/build-timeline/BuildTimeline';
import FounderThesis from '@/sections/founder-thesis/FounderThesis';
import CurrentFocus from '@/sections/current-focus/CurrentFocus';
import BuildProof from '@/sections/build-proof/BuildProof';
import BuildWithMe from '@/sections/build-with-me/BuildWithMe';
import TheHorizon from '@/sections/the-horizon/TheHorizon';

export default function Page(): ReactElement {
    return (
        <>
            <BackgroundEngine />

            <EngineCanvas />

            <Navbar />

            <main className="relative z-10">
                <Hero />
                <Ecosystem />
                <Manifesto />
                <FounderPhilosophy />
                <FounderThesis />
                <OrionShowcase />
                <EngineeringStack />
                <SingularityTechStack />
                <IntelligenceArchitecture />
                <OrionArchitecture />
                <Technology />
                <AdvancedResearch />
                <ExperimentalSystems />
                <Projects />
                <BuildProof />
                <ResearchLab />
                <BuildTimeline />
                <CompanyPrinciples />
                <Journey />
                <CurrentFocus />
                <FounderProfile />
                <Roadmap />
                <BuildWithMe />
                <Contact />
                <TheHorizon />
            </main>
        </>
    );
}