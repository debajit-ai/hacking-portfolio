'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import ScanRevealText from '@/components/animations/ScanRevealText';
import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
};

const phrases = [
    'Building OrionHelix AI',
    'The Multiverse of Artificial Intelligence',
    'Engineering Autonomous Intelligence',
    'Building the Future',
] as const;

const TYPING_SPEED = 45;
const DELETING_SPEED = 25;
const HOLD_TIME = 1800;
const PAUSE_TIME = 300;

function useTerminalTyping(words: readonly string[]): string {
    const [wordIndex, setWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            if (displayText === '') {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
            } else {
                timer = setTimeout(() => {
                    setDisplayText(currentWord.slice(0, displayText.length - 1));
                }, DELETING_SPEED);
            }
        } else {
            if (displayText === currentWord) {
                timer = setTimeout(() => setIsDeleting(true), HOLD_TIME);
            } else {
                timer = setTimeout(() => {
                    setDisplayText(currentWord.slice(0, displayText.length + 1));
                }, TYPING_SPEED);
            }
        }

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, wordIndex, words]);

    return displayText;
}

export default function Hero(): ReactElement {
    const typedText = useTerminalTyping(phrases);
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    // As user scrolls down, Hero content fades and lifts
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

    return (
        <section ref={sectionRef} className="relative flex min-h-[120vh] items-center pt-20 pb-16">
            <motion.div
                className="mx-auto flex w-full max-w-7xl px-6 sm:px-8 md:px-16 lg:px-24"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <div className="w-full max-w-4xl lg:max-w-5xl">

                    {/* Sub-header / Role Tag */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        variants={fadeUp}
                        className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 sm:text-sm"
                    >
                        <span>Founder &amp; CEO</span>
                        <span className="h-1 w-1 rounded-full bg-slate-600" />
                        <span className="text-slate-300">Singularity Horizon Technologies Pvt. Ltd.</span>
                    </motion.div>

                    {/* Name Title — single-line on desktop */}
                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.15,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none"
                    >
                        <ScanRevealText text="Debajit Goswami" className="whitespace-nowrap inline-block" />
                    </motion.h1>

                    {/* Architectural Platform Statement */}
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        custom={0.3}
                        variants={fadeUp}
                        className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl font-light"
                    >
                        Building <span className="font-medium text-white">ORIONHELIX AI</span> — the Multiverse of Artificial Intelligence at <span className="text-slate-200">Singularity Horizon Technologies Pvt. Ltd.</span>
                    </motion.p>

                    {/* Terminal Prompt */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={0.42}
                        variants={fadeUp}
                        className="mt-6 flex h-8 items-center font-mono text-sm text-slate-400 sm:text-base md:text-lg"
                    >
                        <span className="text-slate-600 mr-2">&gt;</span>
                        <span className="text-slate-200">{typedText}</span>

                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="ml-1 inline-block h-4 w-[2px] bg-slate-200"
                        />
                    </motion.div>

                    {/* CTA Actions */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={0.6}
                        variants={fadeUp}
                        className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
                    >
                        <a
                            href="#orion-showcase"
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/90 bg-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-slate-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                        >
                            <span>Explore OrionHelix AI</span>
                        </a>

                        <a
                            href="#mission"
                            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/[0.06] hover:text-white"
                        >
                            Read Manifesto
                        </a>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-20 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500"
                    >
                        <motion.span
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="inline-block h-6 w-[1px] bg-slate-600"
                        />
                        <span>Scroll to enter</span>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    );
}