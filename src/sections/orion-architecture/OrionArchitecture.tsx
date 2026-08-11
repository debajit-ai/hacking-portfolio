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

const ARCHITECTURE_FLOW = [
    { label: "INPUT", desc: "Multimodal ingestion pipeline.", status: "CURRENT" },
    { label: "PERCEPTION", desc: "Contextual feature extraction.", status: "CURRENT" },
    { label: "CONTEXT", desc: "Persistent state management.", status: "EXPERIMENTAL" },
    { label: "REASONING", desc: "Non-linear logic routing.", status: "EXPERIMENTAL" },
    { label: "MEMORY", desc: "High-dimensional state persistence.", status: "FUTURE DIRECTION" },
    { label: "KNOWLEDGE", desc: "Dynamic ontology synthesis.", status: "FUTURE DIRECTION" },
    { label: "ACTION", desc: "Deterministic interface actuation.", status: "EXPERIMENTAL" },
    { label: "ITERATION", desc: "Feedback-driven weight modulation.", status: "FUTURE DIRECTION" }
];

export default function OrionArchitecture(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="orion-architecture"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-36 md:px-16 lg:px-24"
        >
            <motion.div
                className="mx-auto w-full max-w-4xl"
                style={{ opacity: contentOpacity }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="flex flex-col items-center w-full text-center"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center justify-center gap-3 w-full mb-6">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-500/70">
                            HOW I THINK
                        </span>
                        <span className="h-px w-8 bg-slate-600" />
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="text-2xl font-bold tracking-widest text-white sm:text-3xl md:text-4xl uppercase mb-16"
                    >
                        Intelligence Architecture
                    </motion.h2>

                    <motion.div
                        variants={containerVariants}
                        className="relative flex flex-col items-center w-full max-w-xl mx-auto"
                    >
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/5 -translate-x-1/2 z-0" />
                        
                        {ARCHITECTURE_FLOW.map((step, idx) => (
                            <motion.div
                                key={step.label}
                                variants={fadeUpVariants}
                                className="relative z-10 flex flex-col items-center group w-full mb-8 last:mb-0"
                            >
                                <div className="bg-black border border-white/10 rounded-sm px-6 py-3 min-w-[280px] transition-colors duration-500 group-hover:border-cyan-500/30 group-hover:bg-cyan-950/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-xs font-mono font-semibold tracking-widest text-white group-hover:text-cyan-300 transition-colors">
                                            {step.label}
                                        </h3>
                                        <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">
                                            {step.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-light tracking-wide text-left mt-2">
                                        {step.desc}
                                    </p>
                                </div>
                                {idx < ARCHITECTURE_FLOW.length - 1 && (
                                    <div className="h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent my-1 opacity-50" />
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
