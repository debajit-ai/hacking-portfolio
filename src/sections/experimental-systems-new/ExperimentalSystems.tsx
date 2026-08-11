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

const EXPERIMENTS = [
    { id: "001", name: "Context Persistence", status: "RESEARCH" },
    { id: "002", name: "Agentic Reasoning", status: "PROTOTYPE" },
    { id: "003", name: "Multimodal Intelligence", status: "EXPERIMENTAL" },
    { id: "004", name: "AI-Native Interfaces", status: "IN DEVELOPMENT" }
];

export default function ExperimentalSystems(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="experimental-systems"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-36 md:px-16 lg:px-24"
        >
            <motion.div
                className="mx-auto w-full max-w-5xl"
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
                            Laboratory
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl uppercase mb-16"
                    >
                        Experimental Systems
                    </motion.h2>

                    <motion.div
                        variants={containerVariants}
                        className="w-full flex flex-col gap-4"
                    >
                        {EXPERIMENTS.map((exp) => (
                            <motion.div
                                key={exp.id}
                                variants={fadeUpVariants}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 transition-colors hover:border-cyan-500/30"
                            >
                                <div className="flex items-baseline gap-6 mb-2 sm:mb-0">
                                    <span className="text-xs font-mono tracking-widest text-cyan-700 group-hover:text-cyan-500 transition-colors">
                                        EXPERIMENT {exp.id}
                                    </span>
                                    <span className="text-lg font-medium tracking-wide text-white group-hover:text-cyan-100 transition-colors">
                                        {exp.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`h-1.5 w-1.5 rounded-full ${exp.status === 'RESEARCH' ? 'bg-orange-500' : exp.status === 'PROTOTYPE' ? 'bg-cyan-400' : 'bg-slate-400'} animate-pulse`} />
                                    <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500">
                                        {exp.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
