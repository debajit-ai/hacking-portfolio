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

                <div className="relative mx-auto flex max-w-4xl flex-col items-center pt-10">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]" />

                    {/* Central Vertical Flow Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-900/40 to-transparent" />
                    
                    {/* Animated Data Packets */}
                    <motion.div 
                        animate={{ y: [0, 500] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-1/2 h-16 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50"
                    />

                    {companyKnowledge.aiPlatform.architecture.map((node, index) => (
                        <motion.div
                            key={node}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative z-10 my-4 flex w-full items-center justify-center"
                        >
                            <div className="group relative flex w-80 items-center justify-between border border-white/10 bg-black/60 px-6 py-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/40 hover:bg-cyan-950/20">
                                {/* Technical decorative corners */}
                                <div className="absolute -left-[1px] -top-[1px] h-2 w-2 border-l border-t border-cyan-500/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b border-r border-cyan-500/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                
                                <span className="font-mono text-xs text-slate-500">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                
                                <span className="font-mono text-sm tracking-[0.2em] text-slate-200 transition-colors duration-500 group-hover:text-cyan-400">
                                    {node}
                                </span>
                                
                                {/* Connection Node Dots */}
                                <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/50 bg-black" />
                                <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-500/50 bg-black" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
