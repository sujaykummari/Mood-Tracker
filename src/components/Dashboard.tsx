import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MoonPhase } from './MoonPhase';
import { Settings } from './Settings';
import { MoodFeedback } from './MoodFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';

/**
 * Props for the Dashboard component.
 */
interface DashboardProps {
    onNavigate: (view: 'journal' | 'breathing', params?: any) => void;
}

/**
 * Dashboard component.
 * The main hub of the application. Displays the Moon Phase and Mood Tracker.
 * Updated: Removed Quick Actions (now in NavBar), refined layout for "Premium" feel.
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
            className="min-h-screen flex flex-col items-center relative overflow-x-hidden"
        >
            {/* Header - Transparent & Minimal */}
            <header className="w-full max-w-lg flex justify-between items-center p-6 z-20 absolute top-0">
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

            <main className="w-full max-w-lg flex flex-col items-center z-10 pt-20 pb-10 px-6 space-y-12">
                {/* Moon Phase Section - Hero */}
                <section className="w-full flex justify-center">
                    <MoonPhase />
                </section>

                {/* Mood Tracker Section - Horizontal Scroll / Slider Feel */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">How are you feeling?</h3>
                        <span className="text-xs text-slate-500 font-mono">TODAY</span>
                    </div>

                    <div className="gravity-panel p-6 rounded-3xl w-full border border-white/5 bg-white/5 backdrop-blur-md">
                        <div className="flex justify-between items-center gap-2">
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
                                    <div className={`text-3xl sm:text-4xl p-3 rounded-2xl transition-all duration-300 ${selectedMood === item.emoji ? 'bg-white/10 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110 border border-nebula-400/50' : 'bg-transparent group-hover:bg-white/5'}`}>
                                        {item.emoji}
                                    </div>
                                    {selectedMood === item.emoji && (
                                        <motion.div
                                            layoutId="activeMoodIndicator"
                                            className="absolute -bottom-2 w-1 h-1 bg-nebula-400 rounded-full shadow-[0_0_10px_#818cf8]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Quote or Insight (Placeholder for Premium Feel) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center max-w-xs mx-auto"
                >
                    <p className="text-slate-500 text-sm font-light italic leading-relaxed">
                        "The cosmos is within us. We are made of star-stuff."
                    </p>
                    <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest">— Carl Sagan</p>
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
