import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cloud, Sun, Star, Heart } from 'lucide-react';

interface CloudSwipeProps {
    onBack: () => void;
}

export function CloudSwipe({ onBack }: CloudSwipeProps) {
    const [clouds, setClouds] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

    const handleSwipe = (id: number) => {
        setClouds(prev => prev.filter(c => c !== id));
    };

    const handleReset = () => {
        setClouds([1, 2, 3, 4, 5, 6, 7, 8]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-vh-100 w-100 d-flex flex-column p-4 position-relative overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)' }}
        >
            <header className="d-flex align-items-center mb-4 z-10 position-relative">
                <button onClick={onBack} className="btn btn-link text-white p-2 rounded-circle hover-bg-white-10">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="h5 ms-3 mb-0 fw-bold text-white text-uppercase tracking-widest">Cloud Swipe</h1>
            </header>

            {/* Hidden Treasures in Background */}
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="text-warning">
                    <Sun size={120} />
                </motion.div>
                <div className="position-absolute top-20 start-20 text-white opacity-50"><Star size={40} /></div>
                <div className="position-absolute bottom-20 end-20 text-danger opacity-50"><Heart size={40} /></div>
            </div>

            <div className="flex-1 position-relative z-10 w-100 h-100">
                <AnimatePresence>
                    {clouds.map((id) => (
                        <motion.div
                            key={id}
                            initial={{ x: Math.random() * 200 - 100, y: Math.random() * 400 - 200, opacity: 0 }}
                            animate={{ x: Math.random() * 50 - 25, y: Math.random() * 50 - 25, opacity: 0.9 }}
                            exit={{ x: 200, opacity: 0, scale: 0.5 }}
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            onDragEnd={() => handleSwipe(id)}
                            className="position-absolute cursor-grab active-cursor-grabbing text-white"
                            style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`
                            }}
                        >
                            <Cloud size={100 + Math.random() * 50} fill="white" className="drop-shadow-md" />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {clouds.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="position-absolute top-50 start-50 translate-middle text-center"
                    >
                        <h2 className="h4 text-white fw-bold mb-4">The sky is clear!</h2>
                        <button onClick={handleReset} className="btn btn-white text-primary rounded-pill px-4 py-2 fw-bold shadow-sm">
                            Bring Clouds Back
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
