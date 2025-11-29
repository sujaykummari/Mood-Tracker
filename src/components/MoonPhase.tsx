import { useEffect, useState } from 'react';
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

    // Improved logic: Use a pre-defined set of masks for the 8 phases
    const renderShadow = () => {
        const p = phase.toLowerCase();
        const r = 50; // Radius to cover full container
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
            className="position-relative w-100 d-flex flex-column align-items-center justify-content-center py-5"
        >
            {/* Moon Container */}
            <div className="position-relative rounded-circle overflow-hidden" style={{ width: '20rem', height: '20rem', boxShadow: '0 0 80px rgba(255,255,255,0.15)' }}>
                {/* Realistic Moon Image */}
                <img
                    src="/moon.png"
                    alt="Moon"
                    className="w-100 h-100 object-fit-cover"
                    style={{ transform: 'scale(1.1)' }}
                />

                {/* SVG Shadow Overlay */}
                <svg viewBox="0 0 100 100" className="position-absolute top-0 start-0 w-100 h-100 rounded-circle pe-none" style={{ mixBlendMode: 'multiply' }}>
                    {renderShadow()}
                </svg>
            </div>

            <div className="mt-4 text-center position-relative z-1">
                <h3 className="h2 fw-bold text-light text-uppercase mb-2" style={{ letterSpacing: '0.2em', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    {phase}
                </h3>
                <p className="small font-monospace text-uppercase tracking-widest opacity-75" style={{ color: '#2dd4bf', letterSpacing: '0.1em' }}>
                    Current Phase
                </p>
            </div>
        </motion.div>
    );
}
