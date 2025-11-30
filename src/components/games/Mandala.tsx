import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface MandalaProps {
    onBack: () => void;
}

const COLORS = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F0E68C', '#D8BFD8'];

export function Mandala({ onBack }: MandalaProps) {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [fills, setFills] = useState<Record<string, string>>({});

    const handleFill = (id: string) => {
        setFills(prev => ({ ...prev, [id]: selectedColor }));
    };

    const handleReset = () => setFills({});

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-vh-100 w-100 d-flex flex-column p-4"
            style={{ background: 'var(--bg-app)' }}
        >
            <header className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <button onClick={onBack} className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="h5 ms-3 mb-0 fw-bold text-secondary text-uppercase tracking-widest">Mandala</h1>
                </div>
                <button onClick={handleReset} className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button">
                    <RefreshCw size={20} />
                </button>
            </header>

            <div className="flex-1 d-flex flex-column align-items-center justify-content-center gap-5">
                <div className="position-relative" style={{ width: '300px', height: '300px' }}>
                    <svg viewBox="0 0 100 100" className="w-100 h-100 drop-shadow-lg">
                        {/* Simple Mandala Pattern */}
                        <circle cx="50" cy="50" r="48" fill="#FFF" stroke="#E0E0E0" strokeWidth="0.5" />

                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <g key={i} transform={`rotate(${angle} 50 50)`}>
                                <path
                                    d="M50 50 Q60 30 50 10 Q40 30 50 50"
                                    fill={fills[`petal-outer-${i}`] || '#FFF'}
                                    stroke="#E0E0E0"
                                    strokeWidth="0.5"
                                    onClick={() => handleFill(`petal-outer-${i}`)}
                                    className="cursor-pointer transition-colors hover-opacity-80"
                                />
                                <path
                                    d="M50 50 Q55 40 50 30 Q45 40 50 50"
                                    fill={fills[`petal-inner-${i}`] || '#FFF'}
                                    stroke="#E0E0E0"
                                    strokeWidth="0.5"
                                    onClick={() => handleFill(`petal-inner-${i}`)}
                                    className="cursor-pointer transition-colors hover-opacity-80"
                                />
                            </g>
                        ))}

                        <circle
                            cx="50" cy="50" r="10"
                            fill={fills['center'] || '#FFF'}
                            stroke="#E0E0E0"
                            strokeWidth="0.5"
                            onClick={() => handleFill('center')}
                            className="cursor-pointer transition-colors hover-opacity-80"
                        />
                    </svg>
                </div>

                {/* Color Palette */}
                <div className="d-flex gap-3 bg-white p-3 rounded-pill shadow-sm">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`btn rounded-circle p-0 transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary' : 'hover-scale-110'}`}
                            style={{ width: '32px', height: '32px', backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
