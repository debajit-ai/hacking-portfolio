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

interface TechPillar {
    num: string;
    title: string;
    subtitle: string;
    description: string;
}

const PILLARS: readonly TechPillar[] = [
    {
        num: "01",
        title: "Autonomous Compute Pipeline",
        subtitle: "High-Throughput Inference Engine",
        description:
            "Engineered to execute dynamic sub-agent topologies with deterministic latency and automatic state resolution across multi-node environments.",
    },
    {
        num: "02",
        title: "Real-Time Context Synchronization",
        subtitle: "Non-Linear Vector Memory",
        description:
            "Synthesizes cross-session state, environmental parameters, and domain graphs without artificial context boundary truncation.",
    },
    {
        num: "03",
        title: "Safety & Governance Guardrails",
        subtitle: "Self-Validating Policy Loops",
        description:
            "Monitors output fidelity, alignment boundaries, and compliance constraints concurrently with active generative reasoning.",
    },
];

export default function Technology(): ReactElement {
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
            id="technology"
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
                            03 / Engineering &amp; Architecture
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        Architectural Pillars
                    </motion.h2>

                    <motion.p
                        variants={fadeUpVariants}
                        className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-light"
                    >
                        Every subsystem in OrionHelix AI is designed with extreme rigor, ensuring scalable intelligence execution across complex enterprise workloads.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 w-full"
                    >
                        {PILLARS.map((pillar) => (
                            <motion.div
                                key={pillar.num}
                                variants={fadeUpVariants}
                                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/15 hover:bg-white/[0.03] hover:shadow-[0_0_50px_rgba(56,189,248,0.04)]"
                            >
                                <span className="font-mono text-2xl font-bold text-slate-600 transition-colors duration-500 group-hover:text-sky-400 group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                                    {pillar.num}
                                </span>
                                <h3 className="mt-4 text-xl font-semibold text-white">
                                    {pillar.title}
                                </h3>
                                <h4 className="mt-1 text-xs font-mono uppercase tracking-widest text-slate-400">
                                    {pillar.subtitle}
                                </h4>
                                <p className="mt-4 text-xs leading-relaxed text-slate-400 sm:text-sm font-light">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
