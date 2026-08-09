"use client";

import { useRef } from "react";
import { type ReactElement } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface OrionCapability {
    code: string;
    title: string;
    description: string;
}

const CAPABILITIES: readonly OrionCapability[] = [
    {
        code: "01 / ADAPT",
        title: "Adaptive Intelligence",
        description:
            "Continuously calibrates computational depth and reasoning paths in real time based on task context and complexity.",
    },
    {
        code: "02 / SYNTHESIS",
        title: "Multimodal Reasoning",
        description:
            "Processes structured data, code, perception streams, and symbolic logic within a single unified latent spectrum.",
    },
    {
        code: "03 / AGENTIC",
        title: "Autonomous Systems",
        description:
            "Orchestrates dynamic sub-agents with self-evaluating safety loops and multi-step executive decision pipelines.",
    },
    {
        code: "04 / CONTINUUM",
        title: "Continuous Context",
        description:
            "Eliminates static context windows through persistent memory synthesis and real-time state synchronization.",
    },
    {
        code: "05 / SCALE",
        title: "Enterprise Intelligence",
        description:
            "Engineered for high-volume enterprise deployment with deterministic governance and distributed cluster acceleration.",
    },
] as const;

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

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.75, ease: EASE },
    },
};

function CapabilityCard({ code, title, description }: OrionCapability): ReactElement {
    return (
        <motion.div
            variants={cardVariants}
            className="group relative rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 backdrop-blur-sm transition-all duration-500 hover:border-white/15 hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(56,189,248,0.04)]"
        >
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{code}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700 transition-colors duration-500 group-hover:bg-sky-400 group-hover:shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-white sm:text-lg">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm font-light">
                {description}
            </p>
        </motion.div>
    );
}

export default function OrionShowcase(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [100, 0, 0, -50]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const titleScale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

    return (
        <section
            ref={sectionRef}
            id="orion-showcase"
            className="relative isolate overflow-hidden px-6 py-28 sm:py-36 lg:px-16 lg:py-44 min-h-screen"
        >
            <motion.div
                className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="lg:col-span-7"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            02 / Flagship Technology Platform
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                        style={{ scale: titleScale }}
                    >
                        ORIONHELIX AI
                    </motion.h2>

                    <motion.p
                        variants={fadeUpVariants}
                        className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-light"
                    >
                        OrionHelix AI is an operating substrate for artificial intelligence — a system engineered to reason with the unified coherence of a single mind across high-dimensional domain boundaries.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        {CAPABILITIES.map((cap) => (
                            <CapabilityCard
                                key={cap.title}
                                code={cap.code}
                                title={cap.title}
                                description={cap.description}
                            />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right side — 3D core visualization frame */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="lg:col-span-5 flex justify-center"
                >
                    {/* The AI Core 3D object provides the visual here via the canvas layer */}
                    <div className="relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center">
                        {/* Subtle target reticle */}
                        <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
                        <div className="absolute inset-8 rounded-full border border-white/[0.03]" />
                        <div className="absolute inset-16 rounded-full border border-white/[0.02]" />

                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 h-5 w-5 border-t border-l border-white/10" />
                        <div className="absolute top-0 right-0 h-5 w-5 border-t border-r border-white/10" />
                        <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-white/10" />
                        <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-white/10" />

                        {/* HUD label */}
                        <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-slate-600">
                            OrionHelix Core // Active
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}