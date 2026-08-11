'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import type { ReactElement } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.8,
            delayChildren: 0.2,
        },
    },
};

const textVariants: Variants = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 1.5, ease: EASE },
    },
};

export default function TheHorizon(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="the-horizon"
            className="relative flex w-full min-h-[150vh] flex-col justify-center px-6 py-36 md:px-16 lg:px-24"
        >
            <motion.div
                className="mx-auto w-full max-w-4xl sticky top-1/3"
                style={{ opacity: contentOpacity }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.4 }}
                    variants={containerVariants}
                    className="flex flex-col items-center text-center w-full gap-24"
                >
                    <motion.div variants={textVariants} className="flex flex-col items-center gap-4">
                        <h2 className="text-xl md:text-3xl font-light tracking-widest text-slate-300 uppercase">
                            The future of intelligence<br/>will not be a single model.
                        </h2>
                    </motion.div>

                    <motion.div variants={textVariants}>
                        <h2 className="text-xl md:text-3xl font-light tracking-widest text-slate-300 uppercase">
                            It will be an ecosystem.
                        </h2>
                    </motion.div>

                    <motion.div variants={textVariants}>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            ORIONHELIX
                        </h1>
                    </motion.div>

                    <motion.div variants={textVariants}>
                        <p className="text-sm md:text-base font-mono tracking-[0.3em] text-cyan-500/80 uppercase">
                            The horizon is not a destination.
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
