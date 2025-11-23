import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MoonPhase } from './MoonPhase';
import { Settings } from './Settings';
import { MoodFeedback } from './MoodFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings as SettingsIcon, BookOpen, Wind } from 'lucide-react';

/**
 * Props for the Dashboard component.
 */
interface DashboardProps {
    onNavigate: (view: 'journal' | 'breathing', params?: any) => void;
}

/**
 * Dashboard component.
 * The main hub of the application. Displays the Moon Phase, Mood Tracker, and Quick Actions.
 * RESTORED: Quick Action Cards for Journal and Breathe.
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
            className="min-h-screen flex flex-col items-center relative overflow-x-hidden pb-32" // Added padding for scroll
        >
            {/* Header - Transparent & Minimal */}
            <header className="w-full max-w-lg flex justify-between items-center p-6 z-20">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome Back</span>
                    <h1 className="text-xl font-bold text-starlight tracking-wide">
                        {user?.name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Settings"
                    >
                        <SettingsIcon size={20} />
                    </button>
                    <button
                        onClick={signOut}
                        className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                        aria-label="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="w-full max-w-lg flex flex-col items-center z-10 px-6 space-y-8">
                {/* Moon Phase Section - Hero */}
                <section className="w-full flex justify-center py-4">
                    <MoonPhase />
                </section>

                {/* Mood Tracker Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">How are you feeling?</h3>
                        <span className="text-[10px] text-slate-500 font-mono">TODAY</span>
                    </div>

                    <div className="gravity-panel p-4 rounded-3xl w-full border border-white/5 bg-white/5 backdrop-blur-md">
                        <div className="flex justify-between items-center gap-1">
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
                                    className={`flex flex-col items-center gap-2 transition-all duration-300 group relative p-2 rounded-xl ${selectedMood === item.emoji ? 'bg-white/10 -translate-y-1' : 'hover:bg-white/5'}`}
                                >
                                    <div className={`text-2xl sm:text-3xl transition-transform duration-300 ${selectedMood === item.emoji ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.emoji}
                                    </div>
                                    {selectedMood === item.emoji && (
                                        <motion.div
                                            layoutId="activeMoodIndicator"
                                            className="absolute -bottom-1 w-1 h-1 bg-nebula-400 rounded-full shadow-[0_0_10px_#818cf8]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Quick Actions Grid - RESTORED */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => onNavigate('journal')}
                        className="gravity-panel p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all duration-300 group active:scale-95 border border-white/5 hover:border-plasma-400/30"
                    >
                        <div className="p-4 rounded-full bg-plasma-500/10 text-plasma-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(192,132,252,0.1)]">
                            <BookOpen size={24} />
                        </div>
                        <span className="font-bold text-slate-300 group-hover:text-white tracking-wide uppercase text-xs">Journal</span>
                    </motion.button>

                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => onNavigate('breathing')}
                        className="gravity-panel p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all duration-300 group active:scale-95 border border-white/5 hover:border-aurora-400/30"
                    >
                        <div className="p-4 rounded-full bg-aurora-500/10 text-aurora-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                            <Wind size={24} />
                        </div>
                        <span className="font-bold text-slate-300 group-hover:text-white tracking-wide uppercase text-xs">Breathe</span>
                    </motion.button>
                </div>

                {/* Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center max-w-xs mx-auto pt-4"
                >
                    <p className="text-slate-500 text-xs font-light italic leading-relaxed">
                        "The cosmos is within us. We are made of star-stuff."
                    </p>
                </motion.div>
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
