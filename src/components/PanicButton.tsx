import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Wind, Brain, ShieldCheck, Heart, Coffee, BookOpen, Volume2, VolumeX, ChevronRight, ChevronLeft, Globe } from 'lucide-react';
import { Breathing } from './Breathing';

interface PanicButtonProps {
    onBack: () => void;
}

type PanicStep = 'initial' | 'calm_statements' | 'face_statements' | 'grounding_prompt' | 'breathing' | 'complete';
type Language = 'en' | 'hi' | 'te' | 'kn' | 'ta' | 'ml';

const LANGUAGES: { id: Language; label: string; voiceCode: string }[] = [
    { id: 'en', label: 'English', voiceCode: 'en-IN' },
    { id: 'hi', label: 'Hindi', voiceCode: 'hi-IN' },
    { id: 'te', label: 'Telugu', voiceCode: 'te-IN' },
    { id: 'kn', label: 'Kannada', voiceCode: 'kn-IN' },
    { id: 'ta', label: 'Tamil', voiceCode: 'ta-IN' },
    { id: 'ml', label: 'Malayalam', voiceCode: 'ml-IN' },
];

export function PanicButton({ onBack }: PanicButtonProps) {
    const [step, setStep] = useState<PanicStep>('initial');
    const [statementIndex, setStatementIndex] = useState(0);
    const [language, setLanguage] = useState<Language>('en');
    const [isPlaying, setIsPlaying] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Initialize Speech Synthesis
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    // Stop speech when component unmounts or step changes
    useEffect(() => {
        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, [step]);

    const speakText = (text: string) => {
        if (!synthRef.current) return;

        // Cancel existing speech
        synthRef.current.cancel();

        if (isPlaying) {
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find the correct voice
        const voices = synthRef.current.getVoices();
        const targetLang = LANGUAGES.find(l => l.id === language);
        if (targetLang) {
            const voice = voices.find(v => v.lang.includes(targetLang.voiceCode));
            if (voice) utterance.voice = voice;
        }

        // Fallback to English if specific language voice not found, but try to use an Indian English voice if available
        if (!utterance.voice && language !== 'en') {
            const enVoice = voices.find(v => v.lang.includes('en-IN'));
            if (enVoice) utterance.voice = enVoice;
        }

        utterance.rate = 0.9; // Slightly slower for calming effect
        utterance.pitch = 1.0;

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        setIsPlaying(true);
        synthRef.current.speak(utterance);
    };

    // Path 1: "Help me feel safe" (Expanded)
    const calmStatements = [
        "You are safe here. Take a moment to just be.",
        "This feeling is uncomfortable, but it is not dangerous.",
        "Your body is just trying to protect you. Thank it, and let it know you are safe.",
        "You don't need to fix anything right now. Just breathe.",
        "Imagine a wave washing over you, cool and calming.",
        "Ground yourself in this moment. You are here, right now.",
        "This will pass. It always does.",
        "You are stronger than this feeling.",
        "Soft belly, soft jaw. Let the tension melt away.",
        "You are doing a great job handling this."
    ];

    // Path 2: "I'm ready to face this" (Expanded)
    const faceStatements = [
        "Your heart is beating fast because your body is preparing you for action.",
        "This is just adrenaline. It feels intense, but it cannot hurt you.",
        "You are strong enough to handle this feeling. Let it wash through you.",
        "Ride the wave. Don't fight it. Let it crash and fade.",
        "You have survived this before, and you will again.",
        "Face the feelings. They lose their power when you look at them.",
        "You are in control. Not the anxiety.",
        "Breathe into the intensity. Expand around it.",
        "This is a false alarm. You are safe.",
        "You are brave. You are capable. You are okay."
    ];

    const currentStatements = step === 'calm_statements' ? calmStatements : faceStatements;

    const handleNext = () => {
        if (statementIndex < currentStatements.length - 1) {
            setStatementIndex(prev => prev + 1);
            setIsPlaying(false);
            if (synthRef.current) synthRef.current.cancel();
        } else {
            if (step === 'calm_statements') {
                setStep('grounding_prompt');
            } else {
                setStep('complete');
            }
        }
    };

    const handlePrev = () => {
        if (statementIndex > 0) {
            setStatementIndex(prev => prev - 1);
            setIsPlaying(false);
            if (synthRef.current) synthRef.current.cancel();
        }
    };

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
            <div className="p-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <button
                        onClick={onBack}
                        className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="h5 ms-3 mb-0 text-uppercase tracking-widest fw-bold text-secondary opacity-75">Panic Support</h1>
                </div>

                {/* Language Selector */}
                <div className="dropdown">
                    <button
                        className="btn btn-sm gravity-button d-flex align-items-center gap-2 text-secondary"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={(e) => {
                            // Simple toggle for demo if bootstrap js isn't fully loaded, 
                            // but ideally use a custom dropdown or standard select
                            const nextIndex = (LANGUAGES.findIndex(l => l.id === language) + 1) % LANGUAGES.length;
                            setLanguage(LANGUAGES[nextIndex].id);
                        }}
                    >
                        <Globe size={16} />
                        <span className="text-uppercase">{language}</span>
                    </button>
                </div>
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
                                <ShieldCheck size={64} className="text-primary mb-3" />
                                <h2 className="h3 fw-bold text-primary mb-2">You are safe.</h2>
                                <p className="text-secondary">What do you need right now?</p>
                            </div>

                            <button
                                onClick={handleStartCalm}
                                className="btn gravity-panel p-4 text-start d-flex align-items-center gap-4 group hover-bg-light-10"
                            >
                                <div className="p-3 rounded-circle bg-opacity-10 text-primary group-hover-bg-opacity-20 transition-all" style={{ backgroundColor: 'rgba(255, 183, 178, 0.2)', color: '#FFB7B2' }}>
                                    <Heart size={32} fill="#FFB7B2" />
                                </div>
                                <div>
                                    <h3 className="h6 fw-bold text-primary mb-1">Help me feel safe ❤️</h3>
                                    <p className="small text-secondary mb-0">Gentle reassurance & grounding</p>
                                </div>
                            </button>

                            <button
                                onClick={handleStartFace}
                                className="btn gravity-panel p-4 text-start d-flex align-items-center gap-4 group hover-bg-light-10"
                            >
                                <div className="p-3 rounded-circle bg-opacity-10 text-warning group-hover-bg-opacity-20 transition-all" style={{ backgroundColor: 'rgba(255, 217, 114, 0.2)', color: '#ECA869' }}>
                                    <Brain size={32} />
                                </div>
                                <div>
                                    <h3 className="h6 fw-bold text-primary mb-1">I'm ready — let's face this 💪</h3>
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
                            className="text-center px-4 w-100"
                            style={{ maxWidth: '500px' }}
                        >
                            <div className="gravity-panel p-5 mb-5 position-relative">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={statementIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="h4 fw-medium text-primary lh-base mb-0"
                                    >
                                        {currentStatements[statementIndex]}
                                    </motion.p>
                                </AnimatePresence>

                                <button
                                    onClick={() => speakText(currentStatements[statementIndex])}
                                    className={`btn btn-link position-absolute top-0 end-0 m-3 p-2 rounded-circle ${isPlaying ? 'text-primary' : 'text-secondary'}`}
                                >
                                    {isPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                            </div>

                            {/* Navigation Controls */}
                            <div className="d-flex align-items-center justify-content-between gap-3">
                                <button
                                    onClick={handlePrev}
                                    disabled={statementIndex === 0}
                                    className="btn gravity-button p-3 rounded-circle disabled:opacity-50"
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                {/* Progress Dots */}
                                <div className="d-flex gap-2">
                                    {currentStatements.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-circle transition-all ${i === statementIndex ? 'bg-primary' : 'bg-secondary bg-opacity-20'}`}
                                            style={{ width: '8px', height: '8px' }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="btn gravity-button p-3 rounded-circle"
                                >
                                    <ChevronRight size={24} />
                                </button>
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
                            <h3 className="h5 text-uppercase tracking-widest text-primary mb-4">Let's Ground</h3>
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
                                    <Coffee size={20} className="text-primary" />
                                    <span className="text-primary">Try a grounding activity</span>
                                </button>

                                <button
                                    onClick={() => setStep('breathing')}
                                    className="btn gravity-panel p-3 text-start d-flex align-items-center gap-3"
                                >
                                    <Wind size={20} className="text-primary" />
                                    <span className="text-primary">Listen to audio guide</span>
                                </button>

                                <button
                                    onClick={onBack}
                                    className="btn gravity-panel p-3 text-start d-flex align-items-center gap-3"
                                >
                                    <BookOpen size={20} className="text-primary" />
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
