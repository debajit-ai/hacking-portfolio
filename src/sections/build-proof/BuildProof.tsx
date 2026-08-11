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

const WORK_CATEGORIES = [
    { title: "AI Systems", focus: "Architecture & Cognitive Theory" },
    { title: "Software Projects", focus: "Full-Stack Development" },
    { title: "Technical Prototypes", focus: "Proof of Concept Construction" },
    { title: "Research Experiments", focus: "Non-linear capability testing" },
    { title: "Engineering Systems", focus: "Robust infrastructure design" },
    { title: "Hackathon Work", focus: "Rapid problem solving" },
    { title: "OrionHelix Development", focus: "Core Intelligence Layer" }
];

export default function BuildProof(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="build-proof"
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
                            Build
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl uppercase mb-6"
                    >
                        What I Have<br/>Actually Built
                    </motion.h2>

                    <motion.p
                        variants={fadeUpVariants}
                        className="max-w-2xl text-base leading-relaxed text-slate-400 font-light mb-16"
                    >
                        Credibility comes from execution. These are the areas where I actively engineer and iterate on technical solutions.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
                    >
                        {WORK_CATEGORIES.map((category) => (
                            <motion.div
                                key={category.title}
                                variants={fadeUpVariants}
                                className="group flex flex-col items-start"
                            >
                                <div className="h-[1px] w-full bg-white/10 mb-4 group-hover:bg-cyan-500/50 transition-colors duration-500" />
                                <h3 className="text-sm font-semibold tracking-wide text-white uppercase group-hover:text-cyan-300 transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-xs font-mono text-slate-500 mt-2 tracking-widest uppercase">
                                    {category.focus}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
