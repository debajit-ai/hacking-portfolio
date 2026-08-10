'use client';

import { ReactElement, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AICoreVisual from './AICoreVisual';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTED_QUESTIONS = [
    "What is SingularityHorizon Technologies?",
    "What is OrionHelix AI?",
    "Who is Debajit Goswami?",
    "Are you the primary OrionHelix AI?",
];

export default function OrionHelixAssistant(): ReactElement {
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Welcome to the OrionHelix AI Portfolio Intelligence Interface.\n\nI can help you explore SingularityHorizon Technologies Pvt. Ltd., OrionHelix AI, our technology direction, projects, and the work of Debajit Goswami, Founder & CEO.\n\nHow may I assist you?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg = { role: 'user' as const, content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const res = await fetch('/api/orionhelix/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) throw new Error('Failed to fetch');
            
            const data = await res.json();
            
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: error.name === 'AbortError'
                    ? "The connection timed out. Please try again."
                    : "I'm currently unable to access the core systems. Please try again later." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 flex h-[550px] max-h-[80vh] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="flex flex-col border-b border-white/[0.05] bg-black/60 px-5 py-4">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-3">
                                    <h3 className="font-mono text-sm font-semibold tracking-widest text-white">ORIONHELIX AI</h3>
                                    <div className="flex items-center space-x-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5">
                                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                                        <span className="text-[9px] font-bold tracking-wider text-cyan-300">ONLINE</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsExpanded(false)}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Portfolio Intelligence Interface</p>
                        </div>

                        {/* Disclosure Banner */}
                        <div className="border-b border-white/[0.02] bg-cyan-900/[0.02] px-4 py-2.5">
                            <p className="text-center text-[10px] italic text-slate-500 tracking-wide">
                                Portfolio demonstrator — not the primary OrionHelix AI system.
                            </p>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`mb-5 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[88%] rounded-xl px-4 py-3 text-sm font-light leading-relaxed whitespace-pre-wrap ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 border border-cyan-800/30 text-white rounded-br-sm' 
                                            : 'bg-white/[0.03] border border-white/[0.05] text-slate-300 rounded-bl-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="mb-5 flex justify-start">
                                    <div className="flex items-center space-x-3 rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3 rounded-bl-sm">
                                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-t-cyan-400 border-r-transparent border-b-cyan-400 border-l-transparent opacity-80" />
                                        <span className="font-mono text-[10px] tracking-widest text-cyan-400/80 animate-pulse">
                                            ORIONHELIX COMPUTING
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Questions */}
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 px-5 pb-4">
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-left text-[11px] text-slate-400 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-900/10 hover:text-cyan-100"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="border-t border-white/[0.05] bg-black/40 p-4">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                                className="flex items-center gap-3 relative"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Query OrionHelix..."
                                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] pl-4 pr-12 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 flex w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-all hover:bg-cyan-500/20 disabled:opacity-30 disabled:hover:bg-cyan-500/10"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="19" x2="12" y2="5"></line>
                                        <polyline points="5 12 12 5 19 12"></polyline>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Launcher Button */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="group focus:outline-none"
            >
                <AICoreVisual isExpanded={isExpanded} isThinking={isLoading} />
            </button>
        </div>
    );
}
