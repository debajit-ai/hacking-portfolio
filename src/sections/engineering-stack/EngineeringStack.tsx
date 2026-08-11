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

interface TechStackCategory {
    title: string;
    items: string[];
}

const STACK_CATEGORIES: readonly TechStackCategory[] = [
    {
        title: "AI & Intelligence",
        items: [
            "LLM Systems",
            "Retrieval-Augmented Generation (RAG)",
            "Vector Embeddings",
            "Multimodal AI Architectures",
            "Agentic Orchestration"
        ]
    },
    {
        title: "Systems & Backend",
        items: [
            "Python",
            "Node.js",
            "High-Throughput APIs",
            "Vector & Relational Databases",
            "Distributed Backend Architecture"
        ]
    },
    {
        title: "Experience & Interfaces",
        items: [
            "React & Next.js",
            "TypeScript",
            "Three.js & WebGL",
            "Spatial 3D Environments",
            "Framer Motion"
        ]
    }
];

export default function EngineeringStack(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -40]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="engineering-stack"
            className="relative flex w-full min-h-screen flex-col px-6 py-28 sm:py-36 md:px-16 lg:px-24"
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
                    className="flex flex-col items-start w-full"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            04 / Engineering Stack
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        Technical Architecture
                    </motion.h2>
                    
                    <motion.p
                        variants={fadeUpVariants}
                        className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-light"
                    >
                        The structural foundation powering Singularity Horizon. A precise selection of technologies engineered for scalable multimodal intelligence.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3 w-full"
                    >
                        {STACK_CATEGORIES.map((category) => (
                            <motion.div
                                key={category.title}
                                variants={fadeUpVariants}
                                className="flex flex-col"
                            >
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="h-2 w-2 bg-sky-500/50" />
                                    <h3 className="font-mono text-sm uppercase tracking-widest text-sky-400">
                                        {category.title}
                                    </h3>
                                </div>
                                <ul className="flex flex-col gap-4 border-l border-white/10 pl-6">
                                    {category.items.map((item) => (
                                        <li key={item} className="text-sm font-light text-slate-300 transition-colors duration-300 hover:text-white">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
