'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import type { ReactElement } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ProjectData {
    id: string;
    title: string;
    tech: string;
    status: string;
    description: string;
}

const PROJECTS: readonly ProjectData[] = [
    {
        id: "01",
        title: "OrionHelix AI Core",
        tech: "Neural Continuum / Rust / WebGL",
        status: "Active Deployment",
        description: "The flagship enterprise intelligence substrate. A unified reasoning engine capable of dynamic multimodal synthesis without static context limitations."
    },
    {
        id: "02",
        title: "Singularity Sub-Agents",
        tech: "Distributed Topology / Python / gRPC",
        status: "Beta Testing",
        description: "Autonomous task-resolution networks. Agents spawn, evaluate, and collapse based on deterministic safety loops and real-time environment feedback."
    },
    {
        id: "03",
        title: "Observer State Architecture",
        tech: "Vector Synthesis / React / TypeScript",
        status: "Production",
        description: "A continuous spatial memory interface, mapping non-linear agent thoughts into human-observable 3D coordinate spaces."
    }
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const labelVariants: Variants = {
    hidden: { opacity: 0, z: -100, y: 20 },
    visible: {
        opacity: 1,
        z: 0,
        y: 0,
        transition: { duration: 0.9, ease: EASE },
    },
};

const panelLeftVariants: Variants = {
    hidden: { opacity: 0, x: -100, rotateY: 15, z: -50 },
    visible: {
        opacity: 1,
        x: 0,
        rotateY: 0,
        z: 0,
        transition: { duration: 1.2, ease: EASE },
    },
};

const panelRightVariants: Variants = {
    hidden: { opacity: 0, x: 100, rotateY: -15, z: -50 },
    visible: {
        opacity: 1,
        x: 0,
        rotateY: 0,
        z: 0,
        transition: { duration: 1.2, ease: EASE },
    },
};

export default function Projects(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentZ = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [-200, 0, 0, 0]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <section
            ref={sectionRef}
            id="projects"
            className="relative flex w-full min-h-[150vh] flex-col px-6 py-36 md:px-16 lg:px-24"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                className="mx-auto w-full max-w-6xl sticky top-32"
                style={{ opacity: contentOpacity, z: contentZ, transformStyle: "preserve-3d" }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                    className="flex flex-col items-start w-full"
                >
                    <motion.div variants={labelVariants} className="flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            06 / Active Initiatives
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={labelVariants}
                        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        Active Projects
                    </motion.h2>

                    <div className="mt-16 grid grid-cols-1 gap-12 w-full lg:grid-cols-2 lg:gap-8">
                        {PROJECTS.map((project, idx) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <motion.div
                                    key={project.id}
                                    variants={isEven ? panelLeftVariants : panelRightVariants}
                                    className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8 backdrop-blur-md transition-all duration-700 hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(56,189,248,0.1)]"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                                        <span className="font-mono text-3xl font-bold text-slate-700 transition-colors duration-500 group-hover:text-sky-400">
                                            {project.id}
                                        </span>
                                        <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] uppercase tracking-widest text-sky-300">
                                            {project.status}
                                        </span>
                                    </div>
                                    <h3 className="mt-6 text-2xl font-semibold text-white">
                                        {project.title}
                                    </h3>
                                    <h4 className="mt-2 text-[11px] font-mono uppercase tracking-widest text-slate-400">
                                        {project.tech}
                                    </h4>
                                    <p className="mt-5 text-sm leading-relaxed text-slate-400 font-light">
                                        {project.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
