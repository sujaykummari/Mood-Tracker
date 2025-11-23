import React from 'react';
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="gravity-panel p-8 rounded-3xl max-w-sm w-full relative text-center border-aurora-500/20 shadow-[0_0_50px_rgba(45,212,191,0.1)]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="text-7xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{mood}</div>

                <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-aurora-400 to-nebula-400 uppercase tracking-widest">
                    {feedback.title}
                </h2>

                <p className="text-slate-300 leading-relaxed mb-8 font-light">
                    {feedback.message}
                </p>

                <button
                    onClick={() => onStartBreathing(feedback.techniqueId)}
                    className="w-full gravity-button py-4 rounded-xl font-bold text-starlight flex items-center justify-center gap-3 group uppercase tracking-wider text-sm"
                >
                    <Wind size={18} className="text-aurora-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Start {feedback.techniqueName}</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
