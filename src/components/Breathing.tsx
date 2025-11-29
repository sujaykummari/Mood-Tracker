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

    // Audio Context Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Initialize Audio Context
    useEffect(() => {
        // We create the context but don't start it yet.
        // Browsers require a user gesture to resume/start the context.
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
            await ensureAudioContext(); // Critical fix: Resume context

            // If already playing, don't restart
            if (oscillatorRef.current) return;

            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime); // A3 base

            gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, audioCtxRef.current.currentTime + 1); // Slightly louder

            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);

            osc.start();
            oscillatorRef.current = osc;
            gainNodeRef.current = gain;
        } else {
            if (gainNodeRef.current && audioCtxRef.current) {
                // Smooth fade out
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

        // Smooth frequency transitions
        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(osc.frequency.value, now);

        if (phase === 'Inhale') {
            osc.frequency.linearRampToValueAtTime(330, now + technique.pattern[0] / 1000); // Rise to E4
        } else if (phase === 'Exhale') {
            osc.frequency.linearRampToValueAtTime(220, now + technique.pattern[2] / 1000); // Fall to A3
        }
        // Hold maintains current frequency
    }, [phase, isActive, isMuted, technique]);

    // Handle Play/Pause Click
    const handleTogglePlay = async () => {
        const nextState = !isActive;
        setIsActive(nextState);

        if (nextState) {
            await ensureAudioContext(); // Ensure context is ready
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

    // Breathing cycle logic
    useEffect(() => {
        if (!isActive) {
            setPhase('Ready');
            toggleAudio(false);
            return;
        }

        let mounted = true;
        const { pattern } = technique;

        const cycle = async () => {
            if (!mounted || !isActive) return;

            setPhase('Inhale');
            await new Promise(r => setTimeout(r, pattern[0]));

            if (mounted && isActive && pattern[1] > 0) {
                setPhase('Hold');
                await new Promise(r => setTimeout(r, pattern[1]));
            }

            if (mounted && isActive) {
                setPhase('Exhale');
                await new Promise(r => setTimeout(r, pattern[2]));
            }

            if (mounted && isActive && pattern[3] > 0) {
                setPhase('Hold');
                await new Promise(r => setTimeout(r, pattern[3]));
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
            relax: 'linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5))',
            focus: 'linear-gradient(135deg, rgba(45, 212, 191, 0.5), rgba(16, 185, 129, 0.5))',
            balance: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(6, 182, 212, 0.5))',
            calm: 'linear-gradient(135deg, rgba(244, 63, 94, 0.5), rgba(236, 72, 153, 0.5))',
            energy: 'linear-gradient(135deg, rgba(249, 115, 22, 0.5), rgba(245, 158, 11, 0.5))',
            anxiety: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(217, 70, 239, 0.5))',
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
                        className="btn gravity-button rounded-pill px-3 py-2 small font-monospace text-uppercase tracking-widest d-flex align-items-center gap-2 border-0"
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
                        <h2 className="h5 fw-bold mb-4 text-primary text-uppercase tracking-widest border-bottom border-primary border-opacity-10 pb-3">Exercises</h2>
                        <div className="d-flex flex-column gap-3">
                            {Object.values(TECHNIQUES).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setTechnique(t);
                                        setShowLibrary(false);
                                    }}
                                    className={`btn w-100 p-4 rounded-4 text-start transition-all border-start border-4 gravity-panel ${technique.id === t.id ? 'border-info bg-light bg-opacity-10' : 'border-transparent'}`}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h3 className={`h6 fw-bold mb-0 transition-colors ${technique.id === t.id ? 'text-info' : 'text-primary'}`}>{t.name}</h3>
                                        {technique.id === t.id && <div className="rounded-circle bg-info shadow-sm" style={{ width: '8px', height: '8px' }} />}
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
                            <h2 className="h3 fw-bold mb-2 text-primary text-uppercase tracking-widest">{technique.name}</h2>
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
                                className="rounded-circle border border-2 border-primary border-opacity-10 d-flex align-items-center justify-content-center gravity-panel position-relative z-1 shadow-lg backdrop-blur-xl"
                                style={{ width: '192px', height: '192px' }}
                            >
                                <motion.span
                                    key={phase}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h3 fw-light text-uppercase text-primary mb-0"
                                    style={{ letterSpacing: '0.3em' }}
                                >
                                    {phase}
                                </motion.span>
                            </motion.div>
                        </div>

                        <button
                            onClick={handleTogglePlay}
                            className="btn gravity-button px-5 py-3 rounded-4 d-flex align-items-center gap-3 small fw-bold text-uppercase tracking-widest text-primary"
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
