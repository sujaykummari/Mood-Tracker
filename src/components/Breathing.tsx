import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Wind, Volume2, VolumeX } from 'lucide-react';

interface BreathingProps {
    onBack: () => void;
    initialTechnique?: string;
}

/**
 * Definition of a breathing technique.
 */
type Technique = {
    id: string;
    name: string;
    description: string;
    pattern: number[]; // [inhale, hold, exhale, hold] in milliseconds
    color: string;
};

/**
 * Library of available breathing techniques.
 */
const TECHNIQUES: Record<string, Technique> = {
    'relax': {
        id: 'relax',
        name: '4-7-8 Breathing',
        description: 'Deep relaxation. Inhale 4s, Hold 7s, Exhale 8s.',
        pattern: [4000, 7000, 8000, 0],
        color: 'from-nebula-500 to-plasma-500'
    },
    'focus': {
        id: 'focus',
        name: 'Box Breathing',
        description: 'Focus and clarity. Equal 4s phases.',
        pattern: [4000, 4000, 4000, 4000],
        color: 'from-aurora-500 to-emerald-500'
    },
    'balance': {
        id: 'balance',
        name: 'Equal Breathing',
        description: 'Balance and calm. Inhale 4s, Exhale 4s.',
        pattern: [4000, 0, 4000, 0],
        color: 'from-blue-500 to-cyan-500'
    },
    'calm': {
        id: 'calm',
        name: 'Pursed Lip',
        description: 'Relieves shortness of breath.',
        pattern: [2000, 0, 4000, 0],
        color: 'from-rose-500 to-pink-500'
    },
    'energy': {
        id: 'energy',
        name: 'Lion\'s Breath',
        description: 'Energizing breath.',
        pattern: [3000, 0, 1000, 0],
        color: 'from-orange-500 to-amber-500'
    },
    'anxiety': {
        id: 'anxiety',
        name: 'Resonance',
        description: 'Reduces anxiety.',
        pattern: [5000, 0, 5000, 0],
        color: 'from-violet-500 to-fuchsia-500'
    }
};

/**
 * Breathing component.
 * Facilitates guided breathing exercises with visual animations and generative audio.
 */
export function Breathing({ onBack, initialTechnique }: BreathingProps) {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('Ready');
    const [technique, setTechnique] = useState<Technique>(
        initialTechnique && TECHNIQUES[initialTechnique] ? TECHNIQUES[initialTechnique] : TECHNIQUES['relax']
    );
    const [showLibrary, setShowLibrary] = useState(!initialTechnique);
    const [isMuted, setIsMuted] = useState(false);
    const [timer, setTimer] = useState(0); // Countdown timer state

    // Audio Context Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Initialize Audio Context
    useEffect(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    // Ensure Audio Context is Running on User Interaction
    const ensureAudioContext = async () => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }
    };

    // Start/Stop Audio
    const toggleAudio = async (start: boolean) => {
        if (isMuted || !audioCtxRef.current) return;

        if (start) {
            await ensureAudioContext();

            if (oscillatorRef.current) return;

            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime); // A3 base

            gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, audioCtxRef.current.currentTime + 1);

            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);

            osc.start();
            oscillatorRef.current = osc;
            gainNodeRef.current = gain;
        } else {
            if (gainNodeRef.current && audioCtxRef.current) {
                gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
                gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioCtxRef.current.currentTime);
                gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);

                setTimeout(() => {
                    if (oscillatorRef.current) {
                        oscillatorRef.current.stop();
                        oscillatorRef.current.disconnect();
                        oscillatorRef.current = null;
                    }
                    if (gainNodeRef.current) {
                        gainNodeRef.current.disconnect();
                        gainNodeRef.current = null;
                    }
                }, 500);
            }
        }
    };

    // Modulate Audio based on Phase
    useEffect(() => {
        if (!isActive || isMuted || !oscillatorRef.current || !audioCtxRef.current || !gainNodeRef.current) return;

        const now = audioCtxRef.current.currentTime;
        const osc = oscillatorRef.current;

        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(osc.frequency.value, now);

        if (phase === 'Inhale') {
            osc.frequency.linearRampToValueAtTime(330, now + technique.pattern[0] / 1000); // Rise to E4
        } else if (phase === 'Exhale') {
            osc.frequency.linearRampToValueAtTime(220, now + technique.pattern[2] / 1000); // Fall to A3
        }
    }, [phase, isActive, isMuted, technique]);

    // Handle Play/Pause Click
    const handleTogglePlay = async () => {
        const nextState = !isActive;
        setIsActive(nextState);

        if (nextState) {
            await ensureAudioContext();
            toggleAudio(true);
        } else {
            toggleAudio(false);
        }
    };

    // Handle Mute Toggle
    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
        if (!isMuted) {
            toggleAudio(false);
        } else if (isActive) {
            toggleAudio(true);
        }
    };

    // Breathing cycle logic with countdown
    useEffect(() => {
        if (!isActive) {
            setPhase('Ready');
            setTimer(0);
            toggleAudio(false);
            return;
        }

        let mounted = true;
        const { pattern } = technique;

        const runPhase = async (phaseName: string, duration: number) => {
            if (!mounted || !isActive) return;
            setPhase(phaseName);

            const seconds = Math.ceil(duration / 1000);
            for (let i = 1; i <= seconds; i++) {
                if (!mounted || !isActive) return;
                setTimer(i);
                await new Promise(r => setTimeout(r, 1000));
            }
        };

        const cycle = async () => {
            if (!mounted || !isActive) return;

            await runPhase('Inhale', pattern[0]);

            if (mounted && isActive && pattern[1] > 0) {
                await runPhase('Hold', pattern[1]);
            }

            if (mounted && isActive) {
                await runPhase('Exhale', pattern[2]);
            }

            if (mounted && isActive && pattern[3] > 0) {
                await runPhase('Hold', pattern[3]);
            }

            if (mounted && isActive) cycle();
        };

        cycle();
        return () => {
            mounted = false;
            toggleAudio(false);
        };
    }, [isActive, technique]);

    // Map technique IDs to gradient styles
    const getTechniqueStyle = (techId: string) => {
        const gradients: Record<string, string> = {
            relax: 'linear-gradient(135deg, rgba(167, 139, 250, 0.5), rgba(129, 140, 248, 0.5))', // Lavender/Periwinkle
            focus: 'linear-gradient(135deg, rgba(52, 211, 153, 0.5), rgba(16, 185, 129, 0.5))', // Sage/Emerald
            balance: 'linear-gradient(135deg, rgba(129, 140, 248, 0.5), rgba(56, 189, 248, 0.5))', // Periwinkle/Sky
            calm: 'linear-gradient(135deg, rgba(244, 114, 182, 0.5), rgba(251, 113, 133, 0.5))', // Pink/Rose
            energy: 'linear-gradient(135deg, rgba(251, 191, 36, 0.5), rgba(245, 158, 11, 0.5))', // Gold/Amber
            anxiety: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(167, 139, 250, 0.5))', // Violet/Lavender
        };
        return gradients[techId] || gradients.relax;
    };

    return (
        <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className="min-vh-100 p-4 mx-auto d-flex flex-column align-items-center position-relative overflow-hidden"
            style={{ maxWidth: '480px' }}
        >
            <header className="w-100 d-flex align-items-center justify-content-between mb-5 z-3">
                <button
                    onClick={onBack}
                    className="btn btn-link text-secondary p-2 rounded-circle hover-text-white gravity-button"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="d-flex gap-2">
                    <button
                        onClick={handleMuteToggle}
                        className="btn btn-link text-secondary p-2 rounded-circle hover-text-white gravity-button"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button
                        onClick={() => {
                            setShowLibrary(!showLibrary);
                            setIsActive(false);
                        }}
                        className="btn btn-outline-light rounded-pill px-3 py-2 small font-monospace text-uppercase tracking-widest d-flex align-items-center gap-2 gravity-button border-0"
                    >
                        <Wind size={14} />
                        {showLibrary ? 'Close' : 'Exercises'}
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {showLibrary ? (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-100 pb-5 overflow-auto"
                        style={{ maxHeight: '80vh' }}
                    >
                        <h2 className="h5 fw-bold mb-4 text-light text-uppercase tracking-widest border-bottom border-white border-opacity-10 pb-3">Exercises</h2>
                        <div className="d-flex flex-column gap-3">
                            {Object.values(TECHNIQUES).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setTechnique(t);
                                        setShowLibrary(false);
                                    }}
                                    className={`btn w-100 p-4 rounded-4 text-start transition-all border-start border-4 gravity-panel ${technique.id === t.id ? 'border-primary bg-light bg-opacity-10' : 'border-transparent'}`}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h3 className={`h6 fw-bold mb-0 transition-colors ${technique.id === t.id ? 'text-primary' : 'text-light'}`}>{t.name}</h3>
                                        {technique.id === t.id && <div className="rounded-circle bg-primary shadow-sm" style={{ width: '8px', height: '8px' }} />}
                                    </div>
                                    <p className="small text-secondary font-monospace mb-0 lh-base">{t.description}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex-1 d-flex flex-column align-items-center justify-content-center w-100"
                    >
                        <div className="text-center mb-5 position-relative z-1">
                            <h2 className="h3 fw-bold mb-2 text-light text-uppercase tracking-widest">{technique.name}</h2>
                            <p className="text-secondary font-monospace small mx-auto" style={{ maxWidth: '250px' }}>{technique.description}</p>
                        </div>

                        <div className="position-relative d-flex align-items-center justify-content-center mb-5">
                            {/* Animated Background Glow - Energy Field */}
                            <motion.div
                                animate={{
                                    scale: isActive ? [1, 1.6, 1.6, 1] : 1,
                                    opacity: isActive ? [0.2, 0.5, 0.5, 0.2] : 0.2
                                }}
                                transition={{
                                    duration: technique.pattern.reduce((a, b) => a + b, 0) / 1000,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="rounded-circle position-absolute"
                                style={{
                                    width: '256px',
                                    height: '256px',
                                    background: getTechniqueStyle(technique.id),
                                    filter: 'blur(60px)'
                                }}
                            />

                            {/* Breathing Circle - HUD Ring */}
                            <motion.div
                                animate={{
                                    scale: isActive ? (phase === 'Inhale' ? 1.4 : phase === 'Exhale' ? 1 : 1.4) : 1,
                                    borderColor: isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'
                                }}
                                transition={{
                                    duration: isActive ? (phase === 'Inhale' ? technique.pattern[0] : technique.pattern[2]) / 1000 : 0.5,
                                    ease: "easeInOut"
                                }}
                                className="rounded-circle border border-2 border-white border-opacity-10 d-flex flex-column align-items-center justify-content-center gravity-panel position-relative z-1 shadow-lg backdrop-blur-xl"
                                style={{ width: '192px', height: '192px' }}
                            >
                                <motion.span
                                    key={phase}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h3 fw-light text-uppercase text-light mb-0"
                                    style={{ letterSpacing: '0.3em' }}
                                >
                                    {phase}
                                </motion.span>
                                {isActive && (
                                    <motion.span
                                        key={timer}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="display-4 fw-bold text-white mt-2"
                                        style={{ textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}
                                    >
                                        {timer}
                                    </motion.span>
                                )}
                            </motion.div>
                        </div>

                        <button
                            onClick={handleTogglePlay}
                            className="btn gravity-button px-5 py-3 rounded-4 d-flex align-items-center gap-3 small fw-bold text-uppercase tracking-widest text-light"
                        >
                            {isActive ? <Pause size={18} /> : <Play size={18} className="ms-1" />}
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
