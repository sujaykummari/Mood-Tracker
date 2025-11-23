import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Wind, Volume2, VolumeX } from 'lucide-react';

/**
 * Props for the Breathing component.
 */
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
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    // Start/Stop Audio
    const toggleAudio = (start: boolean) => {
        if (isMuted || !audioCtxRef.current) return;

        if (start) {
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime); // A3 base

            gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, audioCtxRef.current.currentTime + 1);

            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);

            osc.start();
            oscillatorRef.current = osc;
            gainNodeRef.current = gain;
        } else {
            if (gainNodeRef.current && audioCtxRef.current) {
                gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
                setTimeout(() => {
                    if (oscillatorRef.current) {
                        oscillatorRef.current.stop();
                        oscillatorRef.current.disconnect();
                    }
                }, 500);
            }
        }
    };

    // Modulate Audio based on Phase
    useEffect(() => {
        if (!isActive || isMuted || !oscillatorRef.current || !audioCtxRef.current) return;

        const now = audioCtxRef.current.currentTime;
        const osc = oscillatorRef.current;

        if (phase === 'Inhale') {
            osc.frequency.linearRampToValueAtTime(330, now + technique.pattern[0] / 1000); // Rise to E4
        } else if (phase === 'Exhale') {
            osc.frequency.linearRampToValueAtTime(220, now + technique.pattern[2] / 1000); // Fall to A3
        }
        // Hold maintains current frequency
    }, [phase, isActive, isMuted, technique]);

    // Handle Mute Toggle
    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
        if (!isMuted) {
            // Muting: stop audio immediately
            toggleAudio(false);
        } else if (isActive) {
            // Unmuting while active: start audio
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

        toggleAudio(true);

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

    return (
        <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className="min-h-screen p-6 max-w-md mx-auto flex flex-col items-center relative overflow-hidden"
        >
            <header className="w-full flex items-center justify-between mb-8 z-20">
                <button
                    onClick={onBack}
                    className="p-3 gravity-button rounded-full text-slate-300 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={handleMuteToggle}
                        className="p-3 gravity-button rounded-full text-slate-300 hover:text-white"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button
                        onClick={() => {
                            setShowLibrary(!showLibrary);
                            setIsActive(false);
                        }}
                        className="px-4 py-2 gravity-button rounded-full text-xs font-mono uppercase tracking-widest flex items-center gap-2"
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
                        className="w-full space-y-4 pb-20 overflow-y-auto"
                    >
                        <h2 className="text-xl font-bold mb-6 text-starlight uppercase tracking-widest border-b border-white/10 pb-4">Exercises</h2>
                        {Object.values(TECHNIQUES).map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTechnique(t);
                                    setShowLibrary(false);
                                }}
                                className={`w-full p-5 rounded-2xl gravity-panel text-left transition-all hover:bg-white/5 group border-l-4 ${technique.id === t.id ? 'border-l-aurora-400 bg-white/5' : 'border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-200 group-hover:text-aurora-400 transition-colors">{t.name}</h3>
                                    {technique.id === t.id && <div className="w-2 h-2 rounded-full bg-aurora-400 shadow-[0_0_10px_#2dd4bf]" />}
                                </div>
                                <p className="text-xs text-slate-400 font-mono leading-relaxed">{t.description}</p>
                            </button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex-1 flex flex-col items-center justify-center w-full"
                    >
                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-2xl font-bold mb-2 text-starlight uppercase tracking-widest">{technique.name}</h2>
                            <p className="text-slate-400 font-mono text-xs max-w-[250px] mx-auto">{technique.description}</p>
                        </div>

                        <div className="relative flex items-center justify-center mb-16">
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
                                className={`w-64 h-64 rounded-full bg-gradient-to-br ${technique.color} blur-[60px] absolute`}
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
                                className="w-48 h-48 rounded-full border-2 border-white/10 flex items-center justify-center gravity-panel relative z-10 shadow-2xl backdrop-blur-xl"
                            >
                                <motion.span
                                    key={phase}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl font-light tracking-[0.3em] uppercase text-starlight"
                                >
                                    {phase}
                                </motion.span>
                            </motion.div>
                        </div>

                        <button
                            onClick={() => setIsActive(!isActive)}
                            className="gravity-button px-12 py-5 rounded-2xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest group"
                        >
                            {isActive ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
