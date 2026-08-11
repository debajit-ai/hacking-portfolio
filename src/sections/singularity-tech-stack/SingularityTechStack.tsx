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
            delayChildren: 0.2,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: EASE },
    },
};

const STACK_LAYERS = [
    { name: "AI / ML", desc: "Core intelligence and reasoning systems." },
    { name: "Intelligent Systems", desc: "Agentic orchestration and logic routing." },
    { name: "Data", desc: "Vector indexing and state persistence." },
    { name: "Backend", desc: "High-performance API and system logic." },
    { name: "Frontend", desc: "Cinematic interfaces and spatial UI." },
    { name: "Infrastructure", desc: "Scalable hosting and distributed compute." },
    { name: "Developer Tools", desc: "Rapid iteration and deployment workflows." }
];

export default function SingularityTechStack(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="technology-stack"
            className="relative flex w-full min-h-[120vh] flex-col justify-center px-6 py-36 md:px-16 lg:px-24 overflow-hidden"
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
                    className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full"
                >
                    <div className="flex-1 flex flex-col items-start w-full">
                        <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-6">
                            <span className="h-px w-8 bg-slate-600" />
                            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                                TECHNOLOGY STACK
                            </span>
                        </motion.div>

                        <motion.h2
                            variants={fadeUpVariants}
                            className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase mb-8"
                        >
                            The Systems<br/>I Build With
                        </motion.h2>

                        <motion.p
                            variants={fadeUpVariants}
                            className="max-w-md text-sm leading-relaxed text-slate-400 font-light"
                        >
                            I build interconnected intelligence platforms using a curated stack that prioritizes architectural purity, high performance, and rapid iteration.
                        </motion.p>
                    </div>

                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-y-0 left-8 w-[1px] bg-gradient-to-b from-transparent via-cyan-900/30 to-transparent" />
                        
                        <motion.div variants={containerVariants} className="flex flex-col gap-6 relative z-10 w-full pl-8">
                            {STACK_LAYERS.map((layer) => (
                                <motion.div
                                    key={layer.name}
                                    variants={fadeUpVariants}
                                    className="group relative flex items-center"
                                >
                                    <div className="absolute -left-10 h-3 w-3 rounded-full border border-white/20 bg-black group-hover:border-cyan-400 group-hover:bg-cyan-950 transition-all duration-300" />
                                    <div className="absolute -left-8 w-8 h-[1px] bg-white/5 group-hover:bg-cyan-900/50 transition-colors duration-300" />
                                    
                                    <div className="flex flex-col ml-4">
                                        <h3 className="text-sm font-semibold tracking-widest text-slate-200 uppercase group-hover:text-cyan-300 transition-colors duration-300">
                                            {layer.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-light mt-1">
                                            {layer.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
