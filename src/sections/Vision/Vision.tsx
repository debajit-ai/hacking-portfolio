'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import type { ReactElement } from 'react';

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.14,
            delayChildren: 0.1,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.95,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
};

export default function Vision(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    // Content enters from depth and exits upward
    const contentY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -40]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="mission"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-28 sm:py-36 md:px-16 lg:px-24 lg:py-44"
        >
            <motion.div
                className="mx-auto w-full max-w-6xl"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="flex flex-col items-start"
                >
                    {/* Section Label */}
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            01 / Manifesto &amp; Vision
                        </span>
                    </motion.div>

                    {/* Main Cinematic Statement */}
                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-8 max-w-5xl text-3xl font-semibold leading-[1.12] tracking-tight text-slate-100 sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        We are not building another AI.{' '}
                        <span className="bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent font-bold">
                            We are building the Multiverse of Artificial Intelligence.
                        </span>
                    </motion.h2>

                    {/* Supporting Narrative */}
                    <motion.p
                        variants={fadeUpVariants}
                        className="mt-10 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl font-light"
                    >
                        Singularity Horizon Technologies exists to architect intelligent systems that collaborate, evolve, and reason beyond the static boundaries of legacy machine learning. OrionHelix AI represents the foundational core of this continuous paradigm shift.
                    </motion.p>

                    {/* Pillar Badges */}
                    <motion.div
                        variants={fadeUpVariants}
                        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full border-t border-white/10 pt-10"
                    >
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">ARCHITECTURAL PARADIGM</span>
                            <p className="mt-2 text-sm font-medium text-slate-200">Unified Neural Continua</p>
                        </div>
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">FOUNDATIONAL ENGINE</span>
                            <p className="mt-2 text-sm font-medium text-slate-200">OrionHelix Core Architecture</p>
                        </div>
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">CORPORATE HORIZON</span>
                            <p className="mt-2 text-sm font-medium text-slate-200">Singularity Horizon Technologies</p>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}