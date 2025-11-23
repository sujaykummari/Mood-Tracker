import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MoonPhase } from './MoonPhase';
import { Settings } from './Settings';
import { MoodFeedback } from './MoodFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Wind, BookOpen, Settings as SettingsIcon } from 'lucide-react';

/**
 * Props for the Dashboard component.
 */
interface DashboardProps {
    onNavigate: (view: 'journal' | 'breathing', params?: any) => void;
}

/**
 * Dashboard component.
 * The main hub of the application. Displays the Moon Phase, Mood Tracker, and Quick Actions.
 * Redesigned with the "Antigravity" aesthetic: centered, floating, and neon-accented.
 */
export function Dashboard({ onNavigate }: DashboardProps) {
    const { user, signOut } = useAuth();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showMoodFeedback, setShowMoodFeedback] = useState(false);

    /**
     * Handles mood selection.
     * Saves the mood to local storage and opens the feedback modal.
     * @param mood - The selected mood emoji.
     */
    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`mood_${today}`, mood);
        setShowMoodFeedback(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 relative overflow-x-hidden"
        >
            {/* Header */}
            <header className="w-full max-w-md flex justify-between items-center mb-12 z-20">
                <div>
                    <h1 className="text-3xl font-bold text-starlight tracking-tight drop-shadow-md">
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebula-400 to-aurora-400">{user?.name}</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-2">Your Daily Check-in</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-3 gravity-button rounded-full text-slate-300 hover:text-white"
                        aria-label="Settings"
                    >
                        <SettingsIcon size={20} />
                    </button>
                    <button
                        onClick={signOut}
                        className="p-3 gravity-button rounded-full text-slate-300 hover:text-red-400 hover:border-red-500/30"
                        aria-label="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="w-full max-w-md flex flex-col gap-10 z-10 pb-20">
                {/* Moon Phase Section - Floating in 3D */}
                <section className="w-full flex justify-center perspective-1000">
                    <MoonPhase />
                </section>

                {/* Mood Tracker Section - HUD Style */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="gravity-panel p-6 rounded-3xl w-full border-t border-white/10"
                >
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-center text-slate-400">How are you feeling?</h3>
                    <div className="flex justify-between items-end px-1 sm:px-4 gap-2">
                        {[
                            { emoji: '😔', label: 'Low' },
                            { emoji: '😐', label: 'Okay' },
                            { emoji: '🙂', label: 'Good' },
                            { emoji: '😊', label: 'Great' },
                            { emoji: '🤩', label: 'Peak' }
                        ].map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleMoodSelect(item.emoji)}
                                className={`flex flex-col items-center gap-3 transition-all duration-300 group relative ${selectedMood === item.emoji ? '-translate-y-2' : 'hover:-translate-y-1'}`}
                            >
                                <div className={`text-3xl sm:text-4xl p-3 sm:p-4 rounded-2xl transition-all duration-300 ${selectedMood === item.emoji ? 'bg-white/10 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110 border border-nebula-400/50' : 'bg-white/5 group-hover:bg-white/10 border border-transparent'}`}>
                                    {item.emoji}
                                </div>
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${selectedMood === item.emoji ? 'text-nebula-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {item.label}
                                </span>
                                {selectedMood === item.emoji && (
                                    <motion.div
                                        layoutId="activeMoodIndicator"
                                        className="absolute -bottom-2 w-1 h-1 bg-nebula-400 rounded-full shadow-[0_0_10px_#818cf8]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-5">
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => onNavigate('journal')}
                        className="gravity-panel p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/5 transition-all duration-300 group active:scale-95 border-l-4 border-l-transparent hover:border-l-plasma-400"
                    >
                        <div className="p-4 rounded-full bg-plasma-500/10 text-plasma-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(192,132,252,0.1)]">
                            <BookOpen size={28} />
                        </div>
                        <span className="font-bold text-slate-300 group-hover:text-white tracking-wide uppercase text-xs">Journal</span>
                    </motion.button>

                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => onNavigate('breathing')}
                        className="gravity-panel p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/5 transition-all duration-300 group active:scale-95 border-l-4 border-l-transparent hover:border-l-aurora-400"
                    >
                        <div className="p-4 rounded-full bg-aurora-500/10 text-aurora-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                            <Wind size={28} />
                        </div>
                        <span className="font-bold text-slate-300 group-hover:text-white tracking-wide uppercase text-xs">Breathe</span>
                    </motion.button>
                </div>
            </main>

            <AnimatePresence>
                {showSettings && <Settings onBack={() => setShowSettings(false)} />}
                {showMoodFeedback && selectedMood && (
                    <MoodFeedback
                        mood={selectedMood}
                        onClose={() => setShowMoodFeedback(false)}
                        onStartBreathing={(techniqueId) => {
                            setShowMoodFeedback(false);
                            onNavigate('breathing', { initialTechnique: techniqueId });
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
