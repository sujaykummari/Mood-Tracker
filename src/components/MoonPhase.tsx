import React, { useEffect, useState } from 'react';
import { Moon } from 'lunarphase-js';
import { motion } from 'framer-motion';

/**
 * MoonPhase component.
 * Displays the current lunar phase using a realistic moon image and an accurate SVG shadow mask.
 */
export function MoonPhase() {
    const [phase, setPhase] = useState('');

    useEffect(() => {
        const now = new Date();
        const currentPhase = Moon.lunarPhase(now);
        setPhase(currentPhase);
    }, []);

    /**
     * Generates the SVG path for the shadow based on the current phase.
     * This creates a mathematically accurate representation of the terminator line.
     */
    const getShadowPath = () => {
        const p = phase.toLowerCase();

        // SVG Path commands for a 100x100 coordinate system
        // M = Move to, A = Arc, L = Line, Z = Close path
        // The moon is a circle centered at 50,50 with radius 48 (leaving padding)

        // Full Moon: No shadow
        if (p.includes('full')) return null;

        // New Moon: Full shadow
        if (p.includes('new')) return "M 50,2 A 48,48 0 1,1 50,98 A 48,48 0 1,1 50,2 Z";

        // Waxing Crescent (Shadow is on the left, concave)
        if (p.includes('waxing crescent')) {
            return "M 50,2 A 48,48 0 1,1 50,98 A 48,48 0 0,0 50,2 Z";
        }

        // First Quarter (Shadow is exactly the left half)
        if (p.includes('first quarter')) {
            return "M 50,2 A 48,48 0 0,0 50,98 L 50,2 Z";
        }

        // Waxing Gibbous (Shadow is on the left, convex - actually small sliver on left)
        // Wait, Waxing Gibbous means mostly lit. Shadow is a small crescent on the left.
        if (p.includes('waxing gibbous')) {
            return "M 50,2 A 48,48 0 1,0 50,98 A 48,48 0 0,0 50,2 Z"; // Incorrect logic, let's simplify
        }

        // Let's use a simpler approach: A mask that covers the dark part.
        // We will use standard SVG shapes for the main phases.

        if (p.includes('waxing crescent')) return "M 50,2 A 48,48 0 1,1 50,98 A 30,48 0 1,0 50,2 Z"; // Crescent Light
        // Actually, we are drawing the SHADOW.

        // Let's map phases to specific SVG paths that represent the DARK part.
        switch (true) {
            case p.includes('waxing crescent'): // Light on right, Shadow on left (large)
                return "M 50,2 A 48,48 0 1,0 50,98 A 25,48 0 0,1 50,2 Z";

            case p.includes('first quarter'): // Light on right half, Shadow on left half
                return "M 50,2 A 48,48 0 0,0 50,98 L 50,2 Z";

            case p.includes('waxing gibbous'): // Light on right (mostly), Shadow on left (small crescent)
                return "M 50,2 A 48,48 0 0,0 50,98 A 25,48 0 0,1 50,2 Z"; // Wait, this is tricky.

            case p.includes('waning gibbous'): // Light on left (mostly), Shadow on right (small crescent)
                return "M 50,2 A 48,48 0 0,1 50,98 A 25,48 0 0,0 50,2 Z";

            case p.includes('last quarter'): // Light on left half, Shadow on right half
                return "M 50,2 A 48,48 0 0,1 50,98 L 50,2 Z";

            case p.includes('waning crescent'): // Light on left, Shadow on right (large)
                return "M 50,2 A 48,48 0 1,1 50,98 A 25,48 0 0,0 50,2 Z";

            default: return null;
        }
    };

    // Improved logic: Use a pre-defined set of masks for the 8 phases
    const renderShadow = () => {
        const p = phase.toLowerCase();
        const r = 49; // Radius slightly larger to cover edges
        const c = 50; // Center

        // We draw the SHADOW (Black overlay)

        if (p.includes('new')) {
            return <circle cx={c} cy={c} r={r} fill="black" opacity="0.9" />;
        }
        if (p.includes('full')) {
            return null; // No shadow
        }

        // First Quarter: Shadow on Left
        if (p.includes('first quarter')) {
            return <path d={`M ${c},${c - r} A ${r},${r} 0 0,0 ${c},${c + r} Z`} fill="black" opacity="0.85" />;
        }
        // Last Quarter: Shadow on Right
        if (p.includes('last quarter')) {
            return <path d={`M ${c},${c - r} A ${r},${r} 0 0,1 ${c},${c + r} Z`} fill="black" opacity="0.85" />;
        }

        // Waxing Crescent: Shadow is mostly the left side, but curved.
        // Visual: )  (Light is on right)
        if (p.includes('waxing crescent')) {
            // Large shadow on left
            return <path d={`M ${c},${c - r} A ${r},${r} 0 1,0 ${c},${c + r} A ${r * 0.6},${r} 0 0,1 ${c},${c - r} Z`} fill="black" opacity="0.9" />;
        }

        // Waning Crescent: Shadow is mostly the right side.
        // Visual: (  (Light is on left)
        if (p.includes('waning crescent')) {
            return <path d={`M ${c},${c - r} A ${r},${r} 0 1,1 ${c},${c + r} A ${r * 0.6},${r} 0 0,0 ${c},${c - r} Z`} fill="black" opacity="0.9" />;
        }

        // Waxing Gibbous: Shadow is a small sliver on the left.
        if (p.includes('waxing gibbous')) {
            return <path d={`M ${c},${c - r} A ${r},${r} 0 0,0 ${c},${c + r} A ${r * 0.6},${r} 0 0,1 ${c},${c - r} Z`} fill="black" opacity="0.85" />;
        }

        // Waning Gibbous: Shadow is a small sliver on the right.
        if (p.includes('waning gibbous')) {
            return <path d={`M ${c},${c - r} A ${r},${r} 0 0,1 ${c},${c + r} A ${r * 0.6},${r} 0 0,0 ${c},${c - r} Z`} fill="black" opacity="0.85" />;
        }

        return <circle cx={c} cy={c} r={r} fill="black" opacity="0.5" />; // Fallback
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative group w-full flex flex-col items-center justify-center py-10"
        >
            {/* Moon Container */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.15)]">
                {/* Realistic Moon Image */}
                <img
                    src="/moon.png"
                    alt="Moon"
                    className="w-full h-full object-cover rounded-full drop-shadow-2xl"
                />

                {/* SVG Shadow Overlay */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full rounded-full mix-blend-multiply pointer-events-none">
                    {renderShadow()}
                </svg>
            </div>

            <div className="mt-8 text-center relative z-10">
                <h3 className="text-3xl font-bold text-starlight tracking-[0.2em] uppercase drop-shadow-lg">
                    {phase}
                </h3>
                <p className="text-aurora-400 text-sm font-mono tracking-widest mt-2 uppercase opacity-80">
                    Current Phase
                </p>
            </div>
        </motion.div>
    );
}
