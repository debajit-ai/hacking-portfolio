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
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: EASE },
    },
};

const TELEMETRY_DATA = [
    { label: "ORIONHELIX AI", status: "IN DEVELOPMENT", type: "pending" },
    { label: "AI SYSTEMS", status: "ACTIVE", type: "active" },
    { label: "RESEARCH", status: "ONGOING", type: "developing" },
    { label: "ENGINEERING", status: "ACTIVE", type: "active" },
    { label: "SINGULARITY HORIZON", status: "BUILDING", type: "developing" }
];

export default function CurrentFocus(): ReactElement {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            id="current-focus"
            className="relative flex w-full min-h-screen flex-col justify-center px-6 py-36 md:px-16 lg:px-24"
        >
            <motion.div
                className="mx-auto w-full max-w-3xl"
                style={{ opacity: contentOpacity }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="flex flex-col w-full font-mono text-xs md:text-sm tracking-widest uppercase border border-white/10 bg-black/60 backdrop-blur-md p-8 md:p-12 rounded-sm"
                >
                    <motion.div variants={fadeUpVariants} className="flex justify-between items-end border-b border-white/20 pb-4 mb-8">
                        <div>
                            <span className="text-cyan-600 block mb-1">DEBAJIT GOSWAMI</span>
                            <span className="text-white font-bold">FOUNDER / BUILDER</span>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 block mb-1">STATUS</span>
                            <span className="text-slate-300">CURRENT FOCUS</span>
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-4">
                        {TELEMETRY_DATA.map((item) => (
                            <motion.div
                                key={item.label}
                                variants={fadeUpVariants}
                                className="flex justify-between items-center group"
                            >
                                <span className="text-slate-400 group-hover:text-white transition-colors duration-300">
                                    {item.label}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="hidden sm:inline-block text-slate-600">........................</span>
                                    <div className="flex items-center gap-2 min-w-[120px] justify-end">
                                        <span className={`h-1.5 w-1.5 rounded-full ${
                                            item.type === 'active' ? 'bg-cyan-400 animate-pulse' : 
                                            item.type === 'developing' ? 'bg-orange-400' : 'bg-slate-500'
                                        }`} />
                                        <span className={`${
                                            item.type === 'active' ? 'text-cyan-400' : 
                                            item.type === 'developing' ? 'text-orange-400' : 'text-slate-500'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
