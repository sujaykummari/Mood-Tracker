import { motion } from 'framer-motion';
import { X, Wind } from 'lucide-react';

/**
 * Props for the MoodFeedback component.
 */
interface MoodFeedbackProps {
    mood: string;
    onClose: () => void;
    onStartBreathing: (techniqueId: string) => void;
}

/**
 * MoodFeedback component.
 * Displays a modal with personalized feedback based on the selected mood.
 * Uses a "holographic" glass style.
 */
export function MoodFeedback({ mood, onClose, onStartBreathing }: MoodFeedbackProps) {

    /**
     * Returns feedback data based on the mood emoji.
     * @param m - The mood emoji.
     */
    const getFeedback = (m: string) => {
        switch (m) {
            case '😔': return {
                title: "It's okay to feel low",
                message: "Everyone has these days. Let's try a focus exercise to gently lift your energy.",
                techniqueId: 'focus',
                techniqueName: 'Box Breathing'
            };
            case '😐': return {
                title: "Feeling neutral?",
                message: "That's a stable place to be. Let's maintain this balance.",
                techniqueId: 'balance',
                techniqueName: 'Equal Breathing'
            };
            case '🙂': return {
                title: "Good to see you",
                message: "Glad you're feeling okay. A quick breathing session can help ground you.",
                techniqueId: 'relax',
                techniqueName: '4-7-8 Breathing'
            };
            case '😊': return {
                title: "That's wonderful!",
                message: "Happiness is great. Let's take a moment to savor this feeling.",
                techniqueId: 'relax',
                techniqueName: '4-7-8 Breathing'
            };
            case '🤩': return {
                title: "You're glowing!",
                message: "High energy is a gift! Let's channel it into something positive.",
                techniqueId: 'balance',
                techniqueName: 'Equal Breathing'
            };
            default: return {
                title: "Checking in",
                message: "Taking a moment to breathe is always a good idea.",
                techniqueId: 'relax',
                techniqueName: 'Relaxation'
            };
        }
    };

    const feedback = getFeedback(mood);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center p-3"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="gravity-panel p-5 rounded-5 w-100 position-relative text-center border border-info border-opacity-25 shadow-lg"
                style={{ maxWidth: '24rem', boxShadow: '0 0 50px rgba(45,212,191,0.1)' }}
            >
                <button
                    onClick={onClose}
                    className="btn btn-link position-absolute top-0 end-0 m-3 p-2 rounded-circle text-secondary hover-text-white"
                >
                    <X size={20} />
                </button>

                <div className="display-1 mb-4" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>{mood}</div>

                <h2 className="h4 fw-bold mb-3 text-uppercase tracking-widest" style={{ background: 'linear-gradient(to right, #2dd4bf, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {feedback.title}
                </h2>

                <p className="text-secondary mb-5 fw-light lh-base">
                    {feedback.message}
                </p>

                <button
                    onClick={() => onStartBreathing(feedback.techniqueId)}
                    className="btn w-100 gravity-button py-3 rounded-4 fw-bold text-light d-flex align-items-center justify-content-center gap-2 text-uppercase small tracking-wider group"
                >
                    <Wind size={18} className="text-info transition-transform" style={{ color: '#2dd4bf' }} />
                    <span>Start {feedback.techniqueName}</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
