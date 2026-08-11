'use client';

import { useRef } from 'react';
import Image from 'next/image';
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

export default function FounderProfile(): ReactElement {
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
            id="founder-profile"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-28 sm:py-36 md:px-16 lg:px-24"
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
                    className="flex flex-col lg:flex-row items-start lg:items-center gap-16 lg:gap-24 w-full"
                >
                    {/* Founder Details */}
                    <div className="flex-1">
                        <motion.div variants={fadeUpVariants} className="flex items-center gap-3">
                            <span className="h-px w-8 bg-slate-600" />
                            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                                09 / Leadership
                            </span>
                        </motion.div>

                        <motion.h2
                            variants={fadeUpVariants}
                            className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl uppercase"
                        >
                            Debajit Goswami
                        </motion.h2>

                        <motion.div variants={fadeUpVariants} className="mt-4 flex flex-col gap-1">
                            <h3 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Founder &amp; CEO</h3>
                            <h4 className="font-mono text-xs tracking-widest text-slate-500 uppercase">Singularity Horizon Technologies Pvt. Ltd.</h4>
                        </motion.div>
                        
                        <motion.div
                            variants={fadeUpVariants}
                            className="mt-10 flex flex-col gap-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-light"
                        >
                            <p>
                                Specializing in AI/ML engineering and deep-tech entrepreneurship, focused on architecting intelligent software systems that break away from legacy stateless models.
                            </p>
                            <p>
                                Currently leading AI research and product development to build OrionHelix AI—an advanced reasoning ecosystem designed for continuous context and autonomous agency.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUpVariants} className="mt-12 flex flex-wrap gap-3">
                            {["AI/ML Engineering", "Deep-Tech Entrepreneurship", "AI Research", "Intelligent Systems"].map((tag) => (
                                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-xs text-slate-400">
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Cinematic Visual Element */}
                    <motion.div 
                        variants={fadeUpVariants}
                        className="relative hidden lg:flex h-96 w-96 flex-shrink-0 items-center justify-center rounded-full border border-white/5 bg-black/50"
                    >
                        <Image 
                            src="/images/debajit-goswami.jpg" 
                            alt="Debajit Goswami" 
                            fill
                            sizes="384px"
                            className="object-cover rounded-full"
                        />
                        <div className="absolute inset-4 rounded-full border border-sky-900/30 pointer-events-none" />
                        <div className="absolute inset-12 rounded-full border border-white/[0.02] pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-sky-900/10 to-transparent rounded-full pointer-events-none" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
