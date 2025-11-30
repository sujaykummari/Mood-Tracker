import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';

interface HeartGlowProps {
    onBack: () => void;
}

export function HeartGlow({ onBack }: HeartGlowProps) {
    const [isHolding, setIsHolding] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-vh-100 w-100 d-flex flex-column p-4"
            style={{ background: 'var(--bg-app)' }}
        >
            <header className="d-flex align-items-center mb-4">
                <button onClick={onBack} className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="h5 ms-3 mb-0 fw-bold text-secondary text-uppercase tracking-widest">Heart Glow</h1>
            </header>

            <div className="flex-1 d-flex flex-column align-items-center justify-content-center">
                <motion.div
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    animate={{
                        scale: isHolding ? 1.5 : 1,
                        filter: isHolding ? 'drop-shadow(0 0 50px rgba(255, 107, 107, 0.8))' : 'drop-shadow(0 0 10px rgba(255, 107, 107, 0.2))',
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="cursor-pointer"
                >
                    <Heart size={120} fill="#FF6B6B" stroke="none" />
                </motion.div>

                <p className="text-center text-secondary mt-5 opacity-75">
                    Hold the heart to make it glow.
                </p>
            </div>
        </motion.div>
    );
}
