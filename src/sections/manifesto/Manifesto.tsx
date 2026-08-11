'use client';

import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { companyKnowledge } from '@/data/companyKnowledge';

export default function Manifesto(): ReactElement {
    return (
        <section 
            id="manifesto" 
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-32"
        >
            {/* Minimalist Grid Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-6 flex items-center justify-center space-x-4"
                    >
                        <div className="h-[1px] w-12 bg-cyan-500/50" />
                        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">Company Manifesto</span>
                        <div className="h-[1px] w-12 bg-cyan-500/50" />
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="max-w-4xl font-serif text-3xl font-light leading-snug text-white sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        Engineering the infrastructure for <span className="font-medium italic text-cyan-50">continuous context</span> and <span className="font-medium italic text-cyan-50">high-dimensional perception</span>.
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="mt-12 max-w-2xl text-lg font-light leading-relaxed text-slate-300 md:text-xl"
                    >
                        {companyKnowledge.company.manifesto}
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
