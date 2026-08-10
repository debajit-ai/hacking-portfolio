'use client';

import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { companyKnowledge } from '@/data/companyKnowledge';

export default function Roadmap(): ReactElement {
    return (
        <section 
            id="roadmap" 
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
                            Strategic Roadmap
                        </h2>
                    </motion.div>
                </div>

                <div className="relative mx-auto max-w-4xl">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-0 bottom-0 w-[1px] bg-white/10 md:left-1/2 md:-translate-x-1/2" />

                    {companyKnowledge.roadmap.map((item, index) => (
                        <motion.div
                            key={item.phase}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className={`relative mb-16 flex flex-col md:flex-row ${
                                index % 2 === 0 ? "md:flex-row-reverse" : ""
                            }`}
                        >
                            {/* Connector Node */}
                            <div className="absolute left-[24px] top-1 h-2 w-2 rounded-full border border-cyan-500 bg-black md:left-1/2 md:-translate-x-1/2" />

                            <div className="pl-16 md:w-1/2 md:pl-0 md:px-12">
                                <div className={`flex flex-col ${index % 2 === 0 ? "md:items-start md:text-left" : "md:items-end md:text-right"}`}>
                                    <span className="mb-2 font-mono text-xs tracking-widest text-cyan-500">
                                        {item.phase}
                                    </span>
                                    <h3 className="mb-3 text-xl font-medium text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-slate-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
