'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import type { ReactElement } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Milestone {
    year: string;
    title: string;
    description: string;
}

const MILESTONES: readonly Milestone[] = [
    {
        year: "2024 - PRESENT",
        title: "Singularity Horizon Technologies",
        description: "Founded the flagship enterprise to engineer the next generation of multimodal reasoning architectures and continuous intelligence substrates."
    },
    {
        year: "2023 - 2024",
        title: "OrionHelix AI Framework",
        description: "Conceptualized and engineered the foundational OrionHelix system, establishing the core principles of continuous context and agentic topology."
    },
    {
        year: "2021 - 2023",
        title: "Advanced Systems Research",
        description: "Extensive development in WebGL, distributed computing, and generative models, laying the architectural groundwork for future AI platforms."
    }
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1.0, ease: EASE },
    },
};

export default function Journey(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    // Create a deep z-space effect as the user scrolls through the timeline
    const contentZ = useTransform(scrollYProgress, [0, 0.5, 1], [150, 0, 0]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <section
            ref={sectionRef}
            id="journey"
            className="relative flex w-full min-h-[130vh] flex-col px-6 py-36 md:px-16 lg:px-24"
            style={{ perspective: "1200px" }}
        >
            <motion.div
                className="mx-auto w-full max-w-4xl sticky top-32"
                style={{ opacity: contentOpacity, z: contentZ, transformStyle: "preserve-3d" }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="flex flex-col items-start w-full"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            05 / Organizational Trajectory
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        Founder Journey
                    </motion.h2>

                    <div className="mt-20 relative w-full border-l border-white/10 pl-8 ml-2 sm:ml-4">
                        {MILESTONES.map((milestone, idx) => (
                            <motion.div
                                key={milestone.year}
                                variants={fadeUpVariants}
                                className="relative mb-16 last:mb-0 group"
                            >
                                {/* Spatial Timeline Marker */}
                                <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border border-sky-400/30 bg-[#030406] shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-colors duration-500 group-hover:bg-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]" />
                                
                                <span className="text-xs font-mono uppercase tracking-widest text-sky-300">
                                    {milestone.year}
                                </span>
                                <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                                    {milestone.title}
                                </h3>
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 font-light">
                                    {milestone.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
