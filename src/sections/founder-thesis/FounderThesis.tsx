'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import type { ReactElement } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
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

export default function FounderThesis(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="founder-thesis"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-36 md:px-16 lg:px-24 bg-black/20"
        >
            <motion.div
                className="mx-auto w-full max-w-3xl"
                style={{ opacity: contentOpacity }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="flex flex-col items-center text-center w-full"
                >
                    <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-10">
                        <span className="h-px w-8 bg-slate-600" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                            WHY I BUILD
                        </span>
                        <span className="h-px w-8 bg-slate-600" />
                    </motion.div>

                    <motion.h2
                        variants={fadeUpVariants}
                        className="text-2xl md:text-3xl font-light tracking-wide text-white leading-relaxed mb-12"
                    >
                        "The next generation of computing will not simply execute instructions. It will understand context, reason across information, and increasingly act with intent."
                    </motion.h2>

                    <motion.p
                        variants={fadeUpVariants}
                        className="text-sm font-light text-slate-400 uppercase tracking-widest"
                    >
                        I am building toward that future through Singularity Horizon and OrionHelix.
                    </motion.p>
                </motion.div>
            </motion.div>
        </section>
    );
}
