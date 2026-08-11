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
        transition: { duration: 1.0, ease: EASE },
    },
};

interface Philosophy {
    concept: string;
    description: string;
}

const PHILOSOPHIES: readonly Philosophy[] = [
    {
        concept: "INTELLIGENCE",
        description: "Systems should reason, adapt and evolve natively across domain boundaries."
    },
    {
        concept: "SYSTEMS",
        description: "Build interconnected architectures rather than isolated features and models."
    },
    {
        concept: "AUTONOMY",
        description: "Move AI beyond simple prompt-response mechanics toward useful, proactive intelligent action."
    },
    {
        concept: "SCALE",
        description: "Design every prototype with the future autonomous system architecture in mind."
    }
];

export default function FounderPhilosophy(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -50]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="philosophy"
            className="relative flex w-full min-h-[90vh] flex-col justify-center px-6 py-24 sm:py-32 md:px-16 lg:px-24"
        >
            <motion.div
                className="mx-auto w-full max-w-5xl"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="flex flex-col items-center text-center w-full"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-6">
                        <span className="h-px w-8 bg-cyan-900/50" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-500">
                            02 / Engineering Logic
                        </span>
                        <span className="h-px w-8 bg-cyan-900/50" />
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl"
                    >
                        How I Think
                    </motion.h2>

                    <motion.div
                        variants={containerVariants}
                        className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 w-full text-left"
                    >
                        {PHILOSOPHIES.map((item, idx) => (
                            <motion.div
                                key={item.concept}
                                variants={fadeUpVariants}
                                className="relative border-l border-white/10 pl-6 group transition-colors duration-500 hover:border-cyan-500/50"
                            >
                                <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-white/20 transition-colors duration-500 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                <h3 className="font-mono text-sm tracking-[0.2em] text-white">
                                    {item.concept}
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-slate-400 font-light">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
