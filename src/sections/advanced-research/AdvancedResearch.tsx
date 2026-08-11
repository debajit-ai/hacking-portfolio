'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import type { ReactElement } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
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

const RESEARCH_AREAS = [
    { title: "Artificial Intelligence", status: "RESEARCH" },
    { title: "AI/ML Engineering", status: "IN DEVELOPMENT" },
    { title: "Reasoning Systems", status: "EXPERIMENTAL" },
    { title: "Agentic AI", status: "EXPLORING" },
    { title: "Context Engineering", status: "RESEARCH" },
    { title: "Multimodal Intelligence", status: "EXPERIMENTAL" },
    { title: "Intelligent Systems", status: "IN DEVELOPMENT" },
    { title: "AI Infrastructure", status: "EXPLORING" },
    { title: "Human-AI Interaction", status: "RESEARCH" }
];

export default function AdvancedResearch(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="advanced-research"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-36 md:px-16 lg:px-24"
        >
            <motion.div
                className="mx-auto w-full max-w-6xl"
                style={{ opacity: contentOpacity }}
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
                            RESEARCH / 01
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl uppercase"
                    >
                        Where Intelligence<br />Becomes Engineering
                    </motion.h2>

                    <motion.div
                        variants={containerVariants}
                        className="mt-24 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                    >
                        {RESEARCH_AREAS.map((area, idx) => (
                            <motion.div
                                key={area.title}
                                variants={fadeUpVariants}
                                className="group relative flex flex-col items-start"
                            >
                                <div className="mb-4 text-[10px] font-mono text-cyan-500/70 tracking-widest">
                                    {(idx + 1).toString().padStart(3, '0')}
                                </div>
                                <h3 className="text-sm font-semibold text-white tracking-wide uppercase mb-3 group-hover:text-cyan-300 transition-colors duration-500">
                                    {area.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={`h-1.5 w-1.5 rounded-full ${area.status === 'RESEARCH' ? 'bg-orange-500' : area.status === 'EXPERIMENTAL' ? 'bg-cyan-400' : 'bg-slate-400'} animate-pulse`} />
                                    <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500">
                                        {area.status}
                                    </span>
                                </div>
                                <div className="absolute -left-3 top-0 h-full w-[1px] bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
