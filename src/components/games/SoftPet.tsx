import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';

import { useGamification } from '../../context/GamificationContext';

interface SoftPetProps {
    onBack: () => void;
}

export function SoftPet({ onBack }: SoftPetProps) {
    const { addPoints } = useGamification();
    const [isPetting, setIsPetting] = useState(false);

    const handlePet = () => {
        setIsPetting(true);
        addPoints(1); // Small reward for petting
        setTimeout(() => setIsPetting(false), 500);
    };

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
                <h1 className="h5 ms-3 mb-0 fw-bold text-secondary text-uppercase tracking-widest">Soft Pet</h1>
            </header>

            <div className="flex-1 d-flex flex-column align-items-center justify-content-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePet}
                    className="position-relative cursor-pointer"
                    style={{ width: '200px', height: '200px' }}
                >
                    {/* Simple SVG Bear */}
                    <svg viewBox="0 0 200 200" className="w-100 h-100 overflow-visible">
                        {/* Ears */}
                        <circle cx="50" cy="60" r="30" fill="#D7CCC8" />
                        <circle cx="150" cy="60" r="30" fill="#D7CCC8" />
                        <circle cx="50" cy="60" r="15" fill="#FFCCBC" />
                        <circle cx="150" cy="60" r="15" fill="#FFCCBC" />

                        {/* Head */}
                        <circle cx="100" cy="100" r="80" fill="#D7CCC8" />

                        {/* Eyes */}
                        <circle cx="70" cy="90" r="8" fill="#5D4037" />
                        <circle cx="130" cy="90" r="8" fill="#5D4037" />

                        {/* Blush */}
                        <motion.circle
                            cx="60" cy="110" r="10" fill="#FFAB91" opacity="0.6"
                            animate={{ opacity: isPetting ? 1 : 0.6, scale: isPetting ? 1.2 : 1 }}
                        />
                        <motion.circle
                            cx="140" cy="110" r="10" fill="#FFAB91" opacity="0.6"
                            animate={{ opacity: isPetting ? 1 : 0.6, scale: isPetting ? 1.2 : 1 }}
                        />

                        {/* Snout */}
                        <ellipse cx="100" cy="120" rx="30" ry="20" fill="#EFEBE9" />
                        <circle cx="100" cy="115" r="8" fill="#5D4037" />
                        <path d="M100 123 L100 135 M90 135 Q100 145 110 135" stroke="#5D4037" strokeWidth="3" fill="none" />
                    </svg>

                    {/* Hearts animation on pet */}
                    {isPetting && (
                        <motion.div
                            initial={{ y: 0, opacity: 1, scale: 0 }}
                            animate={{ y: -50, opacity: 0, scale: 1.5 }}
                            transition={{ duration: 0.8 }}
                            className="position-absolute top-0 start-50 translate-middle text-danger"
                        >
                            <Heart fill="#FF5252" stroke="none" size={32} />
                        </motion.div>
                    )}
                </motion.div>

                <p className="text-center text-secondary mt-5">
                    Tap gently to pet.
                </p>
            </div>
        </motion.div>
    );
}
