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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: EASE },
    },
};

const TIMELINE = [
    { stage: "FOUNDATION" },
    { stage: "EXPLORATION" },
    { stage: "SINGULARITY HORIZON" },
    { stage: "ORIONHELIX" },
    { stage: "SYSTEM ARCHITECTURE" },
    { stage: "INTELLIGENCE PLATFORM" },
    { stage: "THE HORIZON" }
];

export default function BuildTimeline(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="build-timeline"
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
                    className="flex flex-col items-center w-full text-center"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-16">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            BUILD / TIMELINE
                        </span>
                        <span className="h-px w-8 bg-slate-600" />
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        className="relative flex flex-col md:flex-row items-center justify-between w-full mx-auto"
                    >
                        {/* Connecting Line (Horizontal on md+, Vertical on small) */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] md:w-full md:h-[1px] md:top-1/2 md:left-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 z-0" />
                        
                        {TIMELINE.map((item) => (
                            <motion.div
                                key={item.stage}
                                variants={fadeUpVariants}
                                className="relative z-10 flex flex-col items-center group py-8 md:py-0 w-full"
                            >
                                <div className="h-2 w-2 rounded-full bg-white/30 mb-4 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300" />
                                <div className="flex flex-col items-center bg-black/60 backdrop-blur-sm px-4 py-2 rounded-md border border-transparent group-hover:border-cyan-900/50 transition-colors duration-300">
                                    <span className="text-[10px] md:text-xs font-medium tracking-widest text-slate-300 uppercase text-center group-hover:text-white transition-colors">
                                        {item.stage}
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
