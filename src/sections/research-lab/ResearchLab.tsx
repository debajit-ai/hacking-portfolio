'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import type { ReactElement } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: EASE },
    },
};

interface ResearchArea {
    title: string;
    description: string;
}

const RESEARCH_AREAS: readonly ResearchArea[] = [
    {
        title: "AI Agents",
        description: "Autonomous agents capable of goal-driven planning, tool usage, and environment interaction."
    },
    {
        title: "Multimodal Reasoning",
        description: "Architectures that synthesize and reason across text, image, and spatial data simultaneously."
    },
    {
        title: "RAG Systems",
        description: "Advanced Retrieval-Augmented Generation using high-dimensional vector embeddings."
    },
    {
        title: "Computer Vision",
        description: "Real-time perception algorithms for spatial awareness and object recognition."
    },
    {
        title: "AI Cybersecurity",
        description: "Red-teaming and defensive mechanisms to secure autonomous AI deployments."
    }
];

export default function ResearchLab(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [150, 0, 0, -50]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="research-lab"
            className="relative flex w-full min-h-[120vh] flex-col justify-center px-6 py-36 md:px-16 lg:px-24"
        >
            <motion.div
                className="mx-auto w-full max-w-6xl sticky top-40"
                style={{ opacity: contentOpacity, y: contentY }}
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
                            07 / Experimental Systems
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl uppercase"
                    >
                        Singularity Lab
                    </motion.h2>
                    
                    <motion.p
                        variants={fadeUpVariants}
                        className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-light"
                    >
                        The experimental research division exploring non-linear intelligent topologies before commercial production integration.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        className="mt-20 flex flex-wrap gap-4 w-full"
                    >
                        {RESEARCH_AREAS.map((area) => (
                            <motion.div
                                key={area.title}
                                variants={fadeUpVariants}
                                className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-white/[0.05] bg-black/40 p-6 md:p-8 backdrop-blur-md transition-all duration-500 hover:border-cyan-500/30 hover:bg-cyan-950/10 min-w-[280px] max-w-[400px] flex-1"
                            >
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl transition-all duration-500 group-hover:bg-cyan-400/10" />
                                
                                <h3 className="relative z-10 text-xl font-semibold text-white transition-colors duration-500 group-hover:text-cyan-300">
                                    {area.title}
                                </h3>
                                <p className="relative z-10 mt-3 text-sm font-light leading-relaxed text-slate-400">
                                    {area.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
