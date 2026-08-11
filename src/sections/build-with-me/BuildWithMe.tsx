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

const OPPORTUNITIES = [
    { title: "ENGINEERING", desc: "For deeply technical builders focused on autonomous systems." },
    { title: "AI RESEARCH", desc: "For academic and independent researchers exploring cognitive architectures." },
    { title: "TECHNOLOGY COLLABORATION", desc: "For organizations seeking to integrate deterministic reasoning capabilities." },
    { title: "STRATEGIC PROJECTS", desc: "For long-term capital and infrastructure alignment." },
    { title: "DEEP-TECH OPPORTUNITIES", desc: "For visionary alignment in the next generation of computing." }
];

export default function BuildWithMe(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="build-with-me"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-36 md:px-16 lg:px-24 bg-black/40"
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
                    className="flex flex-col items-center text-center w-full"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-10">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            Connect
                        </span>
                        <span className="h-px w-8 bg-slate-600" />
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl uppercase mb-8"
                    >
                        Build With Me
                    </motion.h2>

                    <motion.p
                        variants={fadeUpVariants}
                        className="max-w-2xl text-sm leading-relaxed text-slate-400 font-light mb-16"
                    >
                        I am building serious systems and open to serious collaboration.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        className="w-full flex flex-col gap-6 max-w-2xl"
                    >
                        {OPPORTUNITIES.map((opp) => (
                            <motion.div
                                key={opp.title}
                                variants={fadeUpVariants}
                                className="group flex flex-col items-center justify-center p-6 border border-white/5 bg-black/40 backdrop-blur-md hover:bg-cyan-950/20 hover:border-cyan-900/50 transition-colors duration-500 rounded-sm cursor-pointer"
                            >
                                <h3 className="text-sm font-mono tracking-widest text-slate-200 uppercase mb-2 group-hover:text-cyan-400 transition-colors">
                                    {opp.title}
                                </h3>
                                <p className="text-xs font-light text-slate-500">
                                    {opp.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
