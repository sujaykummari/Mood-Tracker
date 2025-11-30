import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CloudRain, Sun, Heart } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

interface GrowPlantProps {
    onBack: () => void;
}

export function GrowPlant({ onBack }: GrowPlantProps) {
    const { plantGrowth, addPoints } = useGamification();
    const [watered, setWatered] = useState(false);
    const [sunned, setSunned] = useState(false);
    const [loved, setLoved] = useState(false);

    const handleAction = (type: 'water' | 'sun' | 'love') => {
        if (type === 'water' && !watered) {
            setWatered(true);
            addPoints(10);
        }
        if (type === 'sun' && !sunned) {
            setSunned(true);
            addPoints(10);
        }
        if (type === 'love' && !loved) {
            setLoved(true);
            addPoints(10);
        }
    };

    // Use plantGrowth from context instead of local state
    const growth = plantGrowth;

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
                <h1 className="h5 ms-3 mb-0 fw-bold text-secondary text-uppercase tracking-widest">Grow A Plant</h1>
            </header>

            <div className="flex-1 d-flex flex-column align-items-center justify-content-center">
                <div className="position-relative mb-5" style={{ width: '200px', height: '300px' }}>
                    {/* Plant SVG Representation based on growth */}
                    <svg viewBox="0 0 200 300" className="w-100 h-100 overflow-visible">
                        {/* Pot */}
                        <path d="M50 250 L150 250 L140 300 L60 300 Z" fill="#8D6E63" />

                        {/* Stem */}
                        <motion.path
                            d={`M100 250 Q100 ${250 - growth * 2} 100 ${250 - growth * 2.5}`}
                            stroke="#4CAF50"
                            strokeWidth="4"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                        />

                        {/* Leaves - appear at certain growth stages */}
                        {growth > 20 && (
                            <motion.path d="M100 230 Q60 220 50 200 Q90 210 100 230" fill="#66BB6A" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                        )}
                        {growth > 40 && (
                            <motion.path d="M100 200 Q140 190 150 170 Q110 180 100 200" fill="#66BB6A" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                        )}
                        {growth > 60 && (
                            <motion.path d="M100 150 Q60 140 50 120 Q90 130 100 150" fill="#66BB6A" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                        )}

                        {/* Flower - appears at 80+ */}
                        {growth > 80 && (
                            <motion.circle cx="100" cy={250 - growth * 2.5} r="10" fill="#FFEB3B" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                        )}
                        {growth >= 100 && (
                            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                                <circle cx="100" cy="0" r="20" fill="#FFEB3B" />
                                <circle cx="100" cy="-25" r="10" fill="#FFF" />
                                <circle cx="125" cy="0" r="10" fill="#FFF" />
                                <circle cx="100" cy="25" r="10" fill="#FFF" />
                                <circle cx="-125" cy="0" r="10" fill="#FFF" />
                            </motion.g>
                        )}
                    </svg>
                </div>

                <p className="text-center text-secondary mb-5" style={{ maxWidth: '300px' }}>
                    {growth < 100 ? "Nurture your plant with small acts of kindness." : "Your plant is fully grown and beautiful!"}
                </p>

                <div className="d-flex gap-4">
                    <button
                        onClick={() => handleAction('water')}
                        disabled={watered}
                        className={`btn gravity-button p-4 rounded-circle d-flex flex-column align-items-center gap-2 ${watered ? 'opacity-50' : ''}`}
                    >
                        <CloudRain size={24} className="text-info" />
                        <span className="small">Water</span>
                    </button>
                    <button
                        onClick={() => handleAction('sun')}
                        disabled={sunned}
                        className={`btn gravity-button p-4 rounded-circle d-flex flex-column align-items-center gap-2 ${sunned ? 'opacity-50' : ''}`}
                    >
                        <Sun size={24} className="text-warning" />
                        <span className="small">Sun</span>
                    </button>
                    <button
                        onClick={() => handleAction('love')}
                        disabled={loved}
                        className={`btn gravity-button p-4 rounded-circle d-flex flex-column align-items-center gap-2 ${loved ? 'opacity-50' : ''}`}
                    >
                        <Heart size={24} className="text-danger" />
                        <span className="small">Love</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
