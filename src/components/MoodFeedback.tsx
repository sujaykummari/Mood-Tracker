import { motion } from 'framer-motion';
import { X, Wind, CloudRain, Minus, Sun, Sparkles, Zap } from 'lucide-react';

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
     * Returns feedback data based on the mood key.
     * @param m - The mood key.
     */
    const getFeedback = (m: string) => {
        switch (m) {
            case 'low': return {
                title: "It's okay to feel low",
                message: "Everyone has these days. Let's try a focus exercise to gently lift your energy.",
                techniqueId: 'focus',
                techniqueName: 'Box Breathing',
                Icon: CloudRain,
                color: 'text-secondary'
            };
            case 'neutral': return {
                title: "Feeling neutral?",
                message: "That's a stable place to be. Let's maintain this balance.",
                techniqueId: 'balance',
                techniqueName: 'Equal Breathing',
                Icon: Minus,
                color: 'text-info'
            };
            case 'good': return {
                title: "Good to see you",
                message: "Glad you're feeling okay. A quick breathing session can help ground you.",
                techniqueId: 'relax',
                techniqueName: '4-7-8 Breathing',
                Icon: Sun,
                color: 'text-warning'
            };
            case 'great': return {
                title: "That's wonderful!",
                message: "Happiness is great. Let's take a moment to savor this feeling.",
                techniqueId: 'relax',
                techniqueName: '4-7-8 Breathing',
                Icon: Sparkles,
                color: 'text-primary'
            };
            case 'peak': return {
                title: "You're glowing!",
                message: "High energy is a gift! Let's channel it into something positive.",
                techniqueId: 'balance',
                techniqueName: 'Equal Breathing',
                Icon: Zap,
                color: 'text-warning'
            };
            default: return {
                title: "Checking in",
                message: "Taking a moment to breathe is always a good idea.",
                techniqueId: 'relax',
                techniqueName: 'Relaxation',
                Icon: Wind,
                color: 'text-primary'
            };
        }
    };

    const feedback = getFeedback(mood);
    const Icon = feedback.Icon;

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
                className="gravity-panel p-5 rounded-5 w-100 position-relative text-center border border-primary border-opacity-25 shadow-lg"
                style={{ maxWidth: '24rem', boxShadow: '0 0 50px rgba(167, 139, 250, 0.1)' }}
            >
                <button
                    onClick={onClose}
                    className="btn btn-link position-absolute top-0 end-0 m-3 p-2 rounded-circle text-secondary hover-text-white"
                >
                    <X size={20} />
                </button>

                <div className={`display-1 mb-4 d-flex justify-content-center ${feedback.color}`} style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
                    <Icon size={64} />
                </div>

                <h2 className="h4 fw-bold mb-3 text-uppercase tracking-widest" style={{ background: 'linear-gradient(to right, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {feedback.title}
                </h2>

                <p className="text-secondary mb-5 fw-light lh-base">
                    {feedback.message}
                </p>

                <button
                    onClick={() => onStartBreathing(feedback.techniqueId)}
                    className="btn w-100 gravity-button py-3 rounded-4 fw-bold text-light d-flex align-items-center justify-content-center gap-2 text-uppercase small tracking-wider group"
                >
                    <Wind size={18} className="text-primary transition-transform" style={{ color: '#a78bfa' }} />
                    <span>Start {feedback.techniqueName}</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
