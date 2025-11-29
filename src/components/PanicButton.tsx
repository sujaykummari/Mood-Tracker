import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Wind, Brain, ShieldCheck, Heart, Coffee, BookOpen } from 'lucide-react';
import { Breathing } from './Breathing';

interface PanicButtonProps {
    onBack: () => void;
}

type PanicStep = 'initial' | 'calm_statements' | 'face_statements' | 'grounding_prompt' | 'breathing' | 'complete';

export function PanicButton({ onBack }: PanicButtonProps) {
    const [step, setStep] = useState<PanicStep>('initial');
    const [statementIndex, setStatementIndex] = useState(0);

    // Path 1: "Help me feel okay"
    const calmStatements = [
        "You are safe here.",
        "This feeling is uncomfortable, but it will pass.",
        "Your body is just trying to protect you.",
        "You don't need to fix anything right now.",
        "Just breathe. You are okay."
    ];

    // Path 2: "I'm ready to face this"
    const faceStatements = [
        "Your heart is beating fast because your body is preparing you.",
        "You are strong enough to handle this feeling.",
        "This is just adrenaline. It cannot hurt you.",
        "Ride the wave. It will crash soon.",
        "You have survived this before, and you will again."
    ];

    // Auto-advance statements
    useEffect(() => {
        if (step === 'calm_statements' || step === 'face_statements') {
            const statements = step === 'calm_statements' ? calmStatements : faceStatements;
            if (statementIndex < statements.length) {
                const timer = setTimeout(() => {
                    setStatementIndex(prev => prev + 1);
                }, 4000); // 4 seconds per statement
                return () => clearTimeout(timer);
            } else {
                // After statements, move to next step
                if (step === 'calm_statements') {
                    setStep('grounding_prompt');
                } else {
                    setStep('complete');
                }
            }
        }
    }, [step, statementIndex]);

    const handleStartCalm = () => {
        setStatementIndex(0);
        setStep('calm_statements');
    };

    const handleStartFace = () => {
        setStatementIndex(0);
        setStep('face_statements');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-vh-100 w-100 position-fixed top-0 start-0 z-50 d-flex flex-column"
            style={{ background: 'var(--bg-app)' }}
        >
            {/* Header */}
            <div className="p-4 d-flex align-items-center">
                <button
                    onClick={onBack}
                    className="btn btn-link text-secondary p-2 rounded-circle hover-text-white gravity-button"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="h5 ms-3 mb-0 text-uppercase tracking-widest fw-bold text-secondary opacity-75">Panic Support</h1>
            </div>

            {/* Content */}
            <div className="flex-1 d-flex flex-column align-items-center justify-content-center p-4 overflow-auto">
                <AnimatePresence mode="wait">
                    {step === 'initial' && (
                        <motion.div
                            key="initial"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="d-flex flex-column gap-4 w-100"
                            style={{ maxWidth: '400px' }}
                        >
                            <div className="text-center mb-5">
                                <ShieldCheck size={64} className="text-info mb-3" />
                                <h2 className="h3 fw-bold text-primary mb-2">You are safe.</h2>
                                <p className="text-secondary">What do you need right now?</p>
                            </div>

                            <button
                                onClick={handleStartCalm}
                                className="btn gravity-panel p-4 text-start d-flex align-items-center gap-4 group"
                            >
                                <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info group-hover-bg-opacity-20 transition-all">
                                    <Heart size={32} />
                                </div>
                                <div>
                                    <h3 className="h6 fw-bold text-primary mb-1">Help me feel okay</h3>
                                    <p className="small text-secondary mb-0">Gentle reassurance & grounding</p>
                                </div>
                            </button>

                            <button
                                onClick={handleStartFace}
                                className="btn gravity-panel p-4 text-start d-flex align-items-center gap-4 group"
                            >
                                <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning group-hover-bg-opacity-20 transition-all">
                                    <Brain size={32} />
                                </div>
                                <div>
                                    <h3 className="h6 fw-bold text-primary mb-1">I'm ready to face this</h3>
                                    <p className="small text-secondary mb-0">Empowerment & strength</p>
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {(step === 'calm_statements' || step === 'face_statements') && (
                        <motion.div
                            key="statements"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center px-4"
                            style={{ maxWidth: '500px' }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={statementIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="h3 fw-light text-primary lh-base mb-0"
                                >
                                    {(step === 'calm_statements' ? calmStatements : faceStatements)[Math.min(statementIndex, (step === 'calm_statements' ? calmStatements : faceStatements).length - 1)]}
                                </motion.p>
                            </AnimatePresence>

                            {/* Progress indicator */}
                            <div className="d-flex justify-content-center gap-2 mt-5">
                                {(step === 'calm_statements' ? calmStatements : faceStatements).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-circle transition-all ${i === statementIndex ? 'bg-primary' : 'bg-secondary bg-opacity-25'}`}
                                        style={{ width: '8px', height: '8px' }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 'grounding_prompt' && (
                        <motion.div
                            key="grounding"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                            style={{ maxWidth: '400px' }}
                        >
                            <h3 className="h5 text-uppercase tracking-widest text-info mb-4">Let's Ground</h3>
                            <div className="gravity-panel p-5 mb-4">
                                <p className="h4 text-primary mb-4">Name 3 things you can see.</p>
                                <p className="h4 text-primary mb-0">Name 2 things you can touch.</p>
                            </div>
                            <button
                                onClick={() => setStep('complete')}
                                className="btn btn-primary-soft rounded-pill px-5 py-3"
                            >
                                I've done it
                            </button>
                        </motion.div>
                    )}

                    {step === 'breathing' && (
                        <div className="w-100 h-100">
                            <Breathing
                                onBack={() => setStep('complete')}
                                initialTechnique="relax"
                            />
                        </div>
                    )}

                    {step === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center w-100"
                            style={{ maxWidth: '400px' }}
                        >
                            <div className="mb-4 text-success">
                                <CheckCircle size={80} />
                            </div>
                            <h2 className="h2 fw-bold text-primary mb-3">You did great.</h2>
                            <p className="text-secondary mb-5">The panic will pass — and you’re safe.</p>

                            <div className="d-flex flex-column gap-3">
                                <button
                                    onClick={() => setStep('grounding_prompt')}
                                    className="btn gravity-panel p-3 text-start d-flex align-items-center gap-3"
                                >
                                    <Coffee size={20} className="text-info" />
                                    <span className="text-primary">Try a grounding activity</span>
                                </button>

                                <button
                                    onClick={() => setStep('breathing')}
                                    className="btn gravity-panel p-3 text-start d-flex align-items-center gap-3"
                                >
                                    <Wind size={20} className="text-info" />
                                    <span className="text-primary">Listen to audio guide</span>
                                </button>

                                <button
                                    onClick={onBack}
                                    className="btn gravity-panel p-3 text-start d-flex align-items-center gap-3"
                                >
                                    <BookOpen size={20} className="text-info" />
                                    <span className="text-primary">Continue to journal or exit</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
