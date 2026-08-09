"use client";

import { useEffect, useState, type ReactElement } from "react";
import {
  motion,
  useAnimation,
  useReducedMotion,
} from "framer-motion";

const REVEAL_DURATION = 1.6;
const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HIGHLIGHT_DURATION = 1.1;
const HIGHLIGHT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const DEFAULT_SCAN_DELAY = 0.3;

type RevealPhase = "idle" | "scanning" | "highlighting" | "settled";

export interface ScanRevealTextProps {
    text: string;
    className?: string;
    scanDelay?: number;
    onRevealComplete?: () => void;
}

export default function ScanRevealText({
    text,
    className,
    scanDelay = DEFAULT_SCAN_DELAY,
    onRevealComplete,
}: ScanRevealTextProps): ReactElement {
    const prefersReducedMotion = useReducedMotion();
    const [phase, setPhase] = useState<RevealPhase>("idle");
    const clipControls = useAnimation();
const scanControls = useAnimation();
const highlightControls = useAnimation();

    useEffect(() => {
        let isMounted = true;

        async function playSequence(): Promise<void> {
            if (prefersReducedMotion) {
                clipControls.set({ clipPath: "inset(0 0% 0 0)" });
                if (isMounted) setPhase("settled");
                onRevealComplete?.();
                return;
            }

            if (isMounted) setPhase("scanning");

            await new Promise<void>((resolve) =>
                setTimeout(resolve, scanDelay * 1000)
            );

            await Promise.all([
                clipControls.start({
                    clipPath: "inset(0 0% 0 0)",
                    transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE },
                }),
                scanControls.start({
                    left: "104%",
                    opacity: [0, 1, 1, 0],
                    transition: {
                        left: { duration: REVEAL_DURATION, ease: REVEAL_EASE },
                        opacity: {
                            duration: REVEAL_DURATION,
                            times: [0, 0.08, 0.86, 1],
                            ease: "linear",
                        },
                    },
                }),
            ]);

            if (!isMounted) return;
            setPhase("highlighting");

            await highlightControls.start({
                backgroundPositionX: ["-140%", "240%"],
                transition: { duration: HIGHLIGHT_DURATION, ease: HIGHLIGHT_EASE },
            });

            if (!isMounted) return;
            setPhase("settled");
            onRevealComplete?.();
        }

        void playSequence();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showHighlight = phase === "highlighting" || phase === "settled";

    return (
        <span className={`relative inline-block ${className ?? ""}`}>
            <motion.span
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={clipControls}
                className="relative inline-block bg-clip-text text-transparent"
                style={{
                    backgroundImage:
                        "linear-gradient(180deg, #ffffff 0%, #e2e8f0 45%, #ffffff 55%, #cbd5e1 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                }}
            >
                {text}

                {showHighlight && (
                    <motion.span
                        aria-hidden="true"
                        initial={{ backgroundPositionX: "-140%" }}
                        animate={highlightControls}
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundImage:
                                "linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.95) 49%, rgba(186,230,253,0.7) 53%, transparent 60%)",
                            backgroundSize: "55% 100%",
                            backgroundRepeat: "no-repeat",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                            mixBlendMode: "screen",
                        }}
                    >
                        {text}
                    </motion.span>
                )}
            </motion.span>

            {phase === "scanning" && (
                <motion.span
                    aria-hidden="true"
                    initial={{ left: "-6%", opacity: 0 }}
                    animate={scanControls}
                    className="pointer-events-none absolute top-0 h-full w-[4%]"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.9) 50%, rgba(186,230,253,0.4) 68%, transparent 100%)",
                        filter: "blur(1px)",
                        mixBlendMode: "screen",
                    }}
                />
            )}
        </span>
    );
}