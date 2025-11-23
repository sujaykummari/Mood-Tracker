import React, { useEffect, useState } from 'react';
import { Moon } from 'lunarphase-js';
import { motion } from 'framer-motion';

/**
 * MoonPhase component.
 * Displays the current lunar phase using dynamic SVG visualizations.
 * Features a 3D floating effect and neon glow for the "Antigravity" aesthetic.
 */
export function MoonPhase() {
    const [phase, setPhase] = useState('');

    // Calculate lunar phase on mount
    useEffect(() => {
        try {
            const now = new Date();
            const currentPhase = Moon.lunarPhase(now);
            console.log('Moon Phase Calculated:', currentPhase);
            setPhase(currentPhase);
        } catch (error) {
            console.error('Error calculating moon phase:', error);
            setPhase('Full Moon'); // Fallback
        }
    }, []);

    /**
     * Renders the appropriate SVG for the current moon phase.
     * Uses a "holographic" style with cyan/slate colors.
     */
    const renderMoonVisual = () => {
        const p = (phase || '').toLowerCase();

        // Common SVG props - Using explicit pixel values for viewBox but responsive CSS classes
        // Removed drop-shadow from SVG itself to prevent clipping, moved to container or handled differently
        const svgClass = "w-32 h-32 sm:w-40 sm:h-40";
        const moonColor = "#e2e8f0"; // Slate 200
        const shadowColor = "#0f172a"; // Slate 900 (Void)
        const glowColor = "#2dd4bf"; // Teal 400

        // Helper for the glow ring
        const GlowRing = () => (
            <circle cx="50" cy="50" r="48" fill="none" stroke={glowColor} strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray="4 4" className="animate-spin-slow" />
        );

        let content;

        if (p.includes('new')) {
            content = (
                <>
                    <GlowRing />
                    <circle cx="50" cy="50" r="45" fill={shadowColor} stroke={moonColor} strokeWidth="0.5" strokeOpacity="0.2" />
                </>
            );
        } else if (p.includes('full')) {
            content = (
                <>
                    <GlowRing />
                    <circle cx="50" cy="50" r="45" fill={moonColor} />
                    <circle cx="30" cy="30" r="5" fill="rgba(0,0,0,0.1)" />
                    <circle cx="70" cy="60" r="8" fill="rgba(0,0,0,0.1)" />
                </>
            );
        } else if (p.includes('waxing crescent')) {
            content = (
                <>
                    <GlowRing />
                    <path d="M50 5 A45 45 0 1 1 50 95 A45 45 0 0 0 50 5" fill={moonColor} transform="rotate(-20 50 50)" />
                </>
            );
        } else if (p.includes('waning crescent')) {
            content = (
                <>
                    <GlowRing />
                    <path d="M50 5 A45 45 0 1 0 50 95 A45 45 0 0 1 50 5" fill={moonColor} transform="rotate(20 50 50)" />
                </>
            );
        } else if (p.includes('first quarter')) {
            content = (
                <>
                    <GlowRing />
                    <path d="M50 5 A45 45 0 0 1 50 95 L 50 5" fill={moonColor} />
                    <path d="M50 5 A45 45 0 0 0 50 95 L 50 5" fill={shadowColor} stroke={moonColor} strokeWidth="0.5" strokeOpacity="0.2" />
                </>
            );
        } else if (p.includes('last quarter')) {
            content = (
                <>
                    <GlowRing />
                    <path d="M50 5 A45 45 0 0 0 50 95 L 50 5" fill={moonColor} />
                    <path d="M50 5 A45 45 0 0 1 50 95 L 50 5" fill={shadowColor} stroke={moonColor} strokeWidth="0.5" strokeOpacity="0.2" />
                </>
            );
        } else if (p.includes('waxing gibbous')) {
            content = (
                <>
                    <GlowRing />
                    <circle cx="50" cy="50" r="45" fill={moonColor} />
                    <ellipse cx="50" cy="50" rx="25" ry="45" fill={shadowColor} fillOpacity="0.8" transform="translate(-15 0)" />
                </>
            );
        } else if (p.includes('waning gibbous')) {
            content = (
                <>
                    <GlowRing />
                    <circle cx="50" cy="50" r="45" fill={moonColor} />
                    <ellipse cx="50" cy="50" rx="25" ry="45" fill={shadowColor} fillOpacity="0.8" transform="translate(15 0)" />
                </>
            );
        } else {
            // Default fallback
            content = (
                <>
                    <GlowRing />
                    <circle cx="50" cy="50" r="45" fill={moonColor} fillOpacity="0.9" />
                </>
            );
        }

        return (
            <svg viewBox="0 0 100 100" className={svgClass} style={{ overflow: 'visible' }}>
                {content}
            </svg>
        );
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative group w-full flex justify-center"
        >
            {/* 3D Floating Container */}
            <div className="gravity-panel p-8 rounded-full flex flex-col items-center justify-center text-center relative animate-float">

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-aurora-500/10 to-transparent opacity-50 rounded-full" />

                <div className="mb-4 relative z-10 transform group-hover:scale-105 transition-transform duration-700 ease-out">
                    {renderMoonVisual()}
                </div>

                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-starlight tracking-widest uppercase drop-shadow-md min-h-[1.75rem]">
                        {phase || 'Loading...'}
                    </h3>
                    <div className="h-0.5 w-8 bg-aurora-500/50 mx-auto mt-2 rounded-full" />
                </div>
            </div>
        </motion.div>
    );
}
