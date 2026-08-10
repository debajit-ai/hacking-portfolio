'use client';

import { ReactElement } from 'react';
import { motion } from 'framer-motion';

interface Props {
    isExpanded: boolean;
    isThinking?: boolean;
}

export default function AICoreVisual({ isExpanded, isThinking = false }: Props): ReactElement {
    return (
        <motion.div 
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden transition-colors duration-700 hover:border-cyan-500/50"
            animate={{
                scale: isExpanded ? 1.05 : 1,
            }}
            transition={{ duration: 0.4 }}
        >
            {/* Ambient Background Glow */}
            <motion.div 
                animate={{ 
                    opacity: isThinking ? 0.6 : (isExpanded ? 0.4 : [0.1, 0.3, 0.1]),
                    scale: isThinking ? 1.2 : 1
                }}
                transition={{ duration: isThinking ? 1 : 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.3),transparent_70%)]" 
            />

            {/* Robot Head Geometry (Obsidian Metallic) */}
            <motion.div 
                className="relative z-10 flex flex-col items-center justify-center mt-1"
                animate={{
                    y: isExpanded ? -1 : [0, -1, 0], // Subtle breathing
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Upper Head Plate */}
                <div className="h-2 w-5 bg-gradient-to-b from-white/20 to-white/5 rounded-t-lg border-t border-white/30" />
                
                {/* Main Face Plate */}
                <div className="relative flex h-5 w-7 flex-col items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-b-md border-b border-x border-white/10 shadow-inner">
                    
                    {/* Optical Visor / Eyes */}
                    <div className="flex w-full items-center justify-center space-x-1 px-1">
                        {/* Left Eye */}
                        <motion.div 
                            className="h-1 w-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"
                            animate={{
                                opacity: isThinking ? [1, 0.5, 1] : 1,
                                scaleY: isThinking ? 1 : [1, 0.1, 1, 1, 1, 1, 1] // Occasional blink
                            }}
                            transition={{ 
                                opacity: { duration: 0.5, repeat: Infinity },
                                scaleY: { duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.05, 0.1, 0.2, 0.5, 0.8, 1] } 
                            }}
                        />
                        {/* Right Eye */}
                        <motion.div 
                            className="h-1 w-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"
                            animate={{
                                opacity: isThinking ? [1, 0.5, 1] : 1,
                                scaleY: isThinking ? 1 : [1, 0.1, 1, 1, 1, 1, 1] // Occasional blink sync
                            }}
                            transition={{ 
                                opacity: { duration: 0.5, repeat: Infinity },
                                scaleY: { duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.05, 0.1, 0.2, 0.5, 0.8, 1] } 
                            }}
                        />
                    </div>

                    {/* Lower Jaw Detail */}
                    <div className="absolute bottom-1 h-[1px] w-3 bg-white/10" />
                </div>
            </motion.div>

            {/* Thinking State Particles / Orbital Rings */}
            {isThinking && (
                <>
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-1 z-0 rounded-full border border-dashed border-cyan-500/40 opacity-70"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 z-0 rounded-full border border-dotted border-white/20 opacity-50"
                    />
                </>
            )}
        </motion.div>
    );
}
