'use client';

import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { companyKnowledge } from '@/data/companyKnowledge';

export default function IntelligenceArchitecture(): ReactElement {
    return (
        <section 
            id="intelligence-architecture" 
            className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-32"
        >
            <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-20 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl font-light tracking-tight text-white sm:text-4xl"
                    >
                        Intelligence Architecture
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="mt-4 text-base font-light text-slate-400"
                    >
                        The data flow topology of OrionHelix AI
                    </motion.p>
                </div>

                <div className="relative mx-auto flex max-w-3xl flex-col items-center">
                    {/* Central Vertical Flow Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent" />
                    
                    {companyKnowledge.aiPlatform.architecture.map((node, index) => (
                        <motion.div
                            key={node}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative z-10 my-6 flex w-full items-center justify-center"
                        >
                            <div className="group relative flex w-64 items-center justify-center rounded-sm border border-white/5 bg-black/40 px-6 py-4 backdrop-blur-md transition-colors duration-500 hover:border-cyan-500/30 hover:bg-white/[0.02]">
                                <span className="font-mono text-sm tracking-widest text-slate-300 transition-colors duration-500 group-hover:text-cyan-400">
                                    {node}
                                </span>
                                
                                {/* Node Dot */}
                                <div className="absolute -left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-cyan-500/30 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="absolute -right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-cyan-500/30 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
