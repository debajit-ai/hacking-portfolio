"use client";

import { type ReactElement } from "react";

/**
 * BackgroundEngine — Minimal CSS atmospheric base.
 *
 * The 3D environment (particles, fog, structures) now lives entirely
 * in the Three.js canvas. This component provides only:
 * - Deep black base color
 * - Subtle SVG noise texture
 * - CSS cinematic vignette
 *
 * No duplicate particle systems or heavy CSS animations.
 */

const NOISE_BACKGROUND_IMAGE =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function BackgroundEngine(): ReactElement {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {/* Deep atmospheric base — PITCH BLACK */}
            <div aria-hidden="true" className="absolute inset-0 bg-[#000000]" />

            {/* Micro noise grain */}
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: NOISE_BACKGROUND_IMAGE,
                    backgroundRepeat: "repeat",
                }}
            />

            {/* Cinematic vignette */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
                }}
            />
        </div>
    );
}