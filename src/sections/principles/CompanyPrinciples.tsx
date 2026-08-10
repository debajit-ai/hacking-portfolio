'use client';

import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { companyKnowledge } from '@/data/companyKnowledge';

export default function CompanyPrinciples(): ReactElement {
    return (
        <section 
            id="principles" 
            className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-32"
        >
            <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-24 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
                            Company Principles
                        </h2>
                    </motion.div>
                </div>

                <div className="grid gap-12 md:grid-cols-3">
                    {companyKnowledge.company.principles.map((principle, index) => (
                        <motion.div
                            key={principle.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-y-6 -inset-x-4 z-0 scale-95 bg-white/[0.02] opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl" />
                            <div className="relative z-10">
                                <div className="mb-6 flex h-10 w-10 items-center justify-center border border-white/10 bg-black text-xs font-mono text-slate-400 transition-colors duration-500 group-hover:border-cyan-500/50 group-hover:text-cyan-400">
                                    0{index + 1}
                                </div>
                                <h3 className="mb-4 text-lg font-medium text-white">
                                    {principle.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-400">
                                    {principle.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
