import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Heart, Sparkles, Sun, Cloud, Star } from 'lucide-react';

interface AffirmationsProps {
    onBack: () => void;
}

const AFFIRMATIONS = [
    "You are enough, just as you are.",
    "Breathe in calm, breathe out tension.",
    "This moment is a fresh start.",
    "You are safe and loved.",
    "Your feelings are valid.",
    "You are doing your best, and that is enough.",
    "Peace begins with a deep breath.",
    "You are stronger than you know.",
    "Let go of what you cannot control.",
    "You deserve kindness and compassion.",
    "Every day is a new opportunity to grow.",
    "You are capable of handling whatever comes your way.",
    "Trust the process of your life.",
    "You are surrounded by love and support.",
    "It is okay to rest.",
    "Your potential is limitless.",
    "You are worthy of happiness.",
    "Embrace the journey, not just the destination.",
    "You are a light in this world.",
    "Believe in yourself.",
    "You are free to be yourself.",
    "Your heart is open to receiving love.",
    "You are at peace with your past.",
    "You are creating a life you love.",
    "You are grateful for this moment.",
    "You are resilient and brave.",
    "You are gentle with yourself.",
    "You are allowed to take up space.",
    "You are listening to your body.",
    "You are nurturing your soul.",
    "You are connected to the universe.",
    "You are exactly where you need to be.",
    "You are learning and growing every day.",
    "You are forgiving yourself.",
    "You are choosing peace.",
    "You are radiating positive energy.",
    "You are attracting good things.",
    "You are worthy of your dreams.",
    "You are confident in your abilities.",
    "You are letting go of fear.",
    "You are embracing change.",
    "You are finding joy in the little things.",
    "You are patient with yourself.",
    "You are loved beyond measure.",
    "You are a masterpiece in progress.",
    "You are full of potential.",
    "You are guided by your intuition.",
    "You are safe to express your feelings.",
    "You are creating your own happiness.",
    "You are worthy of rest and relaxation.",
    "You are proud of how far you have come.",
    "You are open to new possibilities.",
    "You are trusting your journey.",
    "You are surrounded by abundance.",
    "You are a beautiful soul.",
    "You are making a difference.",
    "You are worthy of love and respect.",
    "You are choosing to be happy.",
    "You are letting go of negativity.",
    "You are focusing on the present moment.",
    "You are grateful for your body.",
    "You are kind to others and yourself.",
    "You are a magnet for miracles.",
    "You are worthy of success.",
    "You are embracing your uniqueness.",
    "You are filled with gratitude.",
    "You are creating a peaceful life.",
    "You are worthy of all good things.",
    "You are strong, capable, and resilient.",
    "You are loved for who you are.",
    "You are free to dream big.",
    "You are trusting the timing of your life.",
    "You are a source of love and light.",
    "You are worthy of inner peace.",
    "You are celebrating your small wins.",
    "You are letting go of perfectionism.",
    "You are embracing your imperfections.",
    "You are worthy of a beautiful life.",
    "You are choosing love over fear.",
    "You are connected to your inner wisdom.",
    "You are worthy of abundance.",
    "You are creating a life of purpose.",
    "You are grateful for the gift of life.",
    "You are gentle with your heart.",
    "You are worthy of healing.",
    "You are embracing your true self.",
    "You are filled with hope.",
    "You are worthy of compassion.",
    "You are creating a life of joy.",
    "You are trusting yourself.",
    "You are worthy of all the love in the world.",
    "You are a powerful creator.",
    "You are worthy of your own time and energy.",
    "You are choosing to see the good.",
    "You are worthy of feeling good.",
    "You are embracing the magic of life.",
    "You are worthy of your own love.",
    "You are enough, always."
];

export function Affirmations({ onBack }: AffirmationsProps) {
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * AFFIRMATIONS.length));
    const [direction, setDirection] = useState(1);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
            } while (nextIndex === prev);
            return nextIndex;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-vh-100 w-100 d-flex flex-column align-items-center justify-content-center p-4 position-relative overflow-hidden"
            style={{ background: 'var(--bg-app)' }}
        >
            {/* Soft Background Elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden pe-none">
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="position-absolute top-10 start-10 text-warning opacity-25"
                >
                    <Sun size={120} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="position-absolute bottom-20 end-10 text-primary opacity-25"
                >
                    <Cloud size={100} />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="position-absolute top-50 start-5 text-danger opacity-25"
                >
                    <Heart size={60} />
                </motion.div>
            </div>

            <header className="w-100 position-absolute top-0 start-0 p-4 d-flex align-items-center z-10">
                <button
                    onClick={onBack}
                    className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button"
                >
                    <ArrowLeft size={24} />
                </button>
            </header>

            <main className="d-flex flex-column align-items-center justify-content-center w-100 z-10" style={{ maxWidth: '600px' }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-center p-5"
                    >
                        <div className="mb-4 text-primary opacity-50">
                            <Sparkles size={32} />
                        </div>
                        <h2 className="display-5 fw-bold text-primary mb-4 lh-base" style={{ textShadow: '0 4px 12px rgba(165, 138, 239, 0.1)' }}>
                            "{AFFIRMATIONS[currentIndex]}"
                        </h2>
                    </motion.div>
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="btn btn-primary-soft rounded-pill px-5 py-3 mt-5 d-flex align-items-center gap-2 shadow-lg"
                >
                    <RefreshCw size={20} />
                    <span>New Affirmation</span>
                </motion.button>
            </main>
        </motion.div>
    );
}
