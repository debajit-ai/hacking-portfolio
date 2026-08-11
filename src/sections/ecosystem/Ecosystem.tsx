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
            delayChildren: 0.08,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.85, ease: EASE },
    },
};

interface EcosystemCategory {
    title: string;
    description: string;
}

const ECOSYSTEM_CATEGORIES: readonly EcosystemCategory[] = [
    {
        title: "AI Systems",
        description: "Foundational intelligence engines engineered for complex logic resolution."
    },
    {
        title: "Autonomous Intelligence",
        description: "Self-orchestrating agents capable of multi-step execution and environment adaptation."
    },
    {
        title: "Multimodal Intelligence",
        description: "Unified architectures synthesizing code, geometry, language, and vision natively."
    },
    {
        title: "Intelligent Software Systems",
        description: "Enterprise-grade environments running persistent, continuous-context workflows."
    },
    {
        title: "Experimental AI Research",
        description: "Prototyping future cognitive models and non-linear memory structures."
    }
];

export default function Ecosystem(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [80, 0, 0, -40]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="ecosystem"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-28 sm:py-36 md:px-16 lg:px-24 lg:py-44"
        >
            <motion.div
                className="mx-auto w-full max-w-6xl"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="flex flex-col items-start"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            01 / What I'm Building
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        Active Ecosystem
                    </motion.h2>

                    <motion.p
                        variants={fadeUpVariants}
                        className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-light"
                    >
                        Singularity Horizon Technologies Pvt. Ltd. is engineering a comprehensive technology ecosystem, with a primary focus on the development of <span className="font-semibold text-white">ORIONHELIX AI</span>.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
                    >
                        {ECOSYSTEM_CATEGORIES.map((cat, idx) => (
                            <motion.div
                                key={cat.title}
                                variants={fadeUpVariants}
                                className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02]"
                            >
                                <div className="mb-4 text-xs font-mono text-slate-500 opacity-60">
                                    {String(idx + 1).padStart(2, '0')}
                                </div>
                                <h3 className="text-lg font-medium text-white group-hover:text-cyan-400 transition-colors duration-500">
                                    {cat.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-400 font-light">
                                    {cat.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
