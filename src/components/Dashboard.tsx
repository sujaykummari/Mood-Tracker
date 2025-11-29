import { useState } from 'react';
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
            className="min-vh-100 d-flex flex-column align-items-center position-relative overflow-hidden pb-5 mb-5"
        >
            {/* Header - Transparent & Minimal */}
            <header className="w-100 container-fluid d-flex justify-content-between align-items-center p-4 z-3" style={{ maxWidth: '600px' }}>
                <div className="d-flex flex-column">
                    <span className="small fw-bold text-secondary text-uppercase tracking-widest">Welcome Back</span>
                    <h1 className="h4 fw-bold text-light tracking-wide">
                        {user?.name}
                    </h1>
                </div>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="btn btn-link text-secondary p-2 rounded-circle hover-bg-light-10 transition-colors"
                        aria-label="Settings"
                    >
                        <SettingsIcon size={20} />
                    </button>
                    <button
                        onClick={signOut}
                        className="btn btn-link text-secondary p-2 rounded-circle hover-text-danger hover-bg-light-10 transition-colors"
                        aria-label="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="w-100 container-fluid d-flex flex-column align-items-center z-2 px-4 gap-4" style={{ maxWidth: '600px' }}>
                {/* Moon Phase Section - Hero */}
                <section className="w-100 d-flex justify-content-center py-2">
                    <MoonPhase />
                </section>

                {/* Mood Tracker Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-100"
                >
                    <div className="d-flex align-items-center justify-content-between mb-3 px-2">
                        <h3 className="small fw-bold text-uppercase tracking-widest text-secondary mb-0">How are you feeling?</h3>
                        <span className="text-muted font-monospace" style={{ fontSize: '10px' }}>TODAY</span>
                    </div>

                    <div className="gravity-panel p-3 rounded-4 w-100 border border-light border-opacity-10 bg-light bg-opacity-10 backdrop-blur-md">
                        <div className="d-flex justify-content-between align-items-center gap-1">
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
                                    className={`btn border-0 d-flex flex-column align-items-center gap-2 transition-all duration-300 position-relative p-2 rounded-3 ${selectedMood === item.emoji ? 'bg-light bg-opacity-10 translate-middle-y-1' : 'hover-bg-light-5'}`}
                                >
                                    <div className={`fs-2 transition-transform duration-300 ${selectedMood === item.emoji ? 'scale-110' : 'hover-scale-110'}`}>
                                        {item.emoji}
                                    </div>
                                    {selectedMood === item.emoji && (
                                        <motion.div
                                            layoutId="activeMoodIndicator"
                                            className="position-absolute bottom-0 w-1 h-1 bg-info rounded-circle shadow-sm"
                                            style={{ marginBottom: '-4px' }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Quick Actions Grid - RESTORED */}
                <div className="row w-100 g-3">
                    <div className="col-6">
                        <motion.button
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => onNavigate('journal')}
                            className="btn border-0 w-100 h-100 gravity-panel p-4 rounded-4 d-flex flex-column align-items-center gap-3 hover-bg-light-10 transition-all duration-300 active-scale-95 border border-light border-opacity-10"
                        >
                            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary hover-text-white hover-scale-110 transition-all duration-300 shadow-sm">
                                <BookOpen size={24} />
                            </div>
                            <span className="fw-bold text-secondary hover-text-white tracking-wide text-uppercase small">Journal</span>
                        </motion.button>
                    </div>

                    <div className="col-6">
                        <motion.button
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => onNavigate('breathing')}
                            className="btn border-0 w-100 h-100 gravity-panel p-4 rounded-4 d-flex flex-column align-items-center gap-3 hover-bg-light-10 transition-all duration-300 active-scale-95 border border-light border-opacity-10"
                        >
                            <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info hover-text-white hover-scale-110 transition-all duration-300 shadow-sm">
                                <Wind size={24} />
                            </div>
                            <span className="fw-bold text-secondary hover-text-white tracking-wide text-uppercase small">Breathe</span>
                        </motion.button>
                    </div>
                </div>

                {/* Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mx-auto pt-3"
                    style={{ maxWidth: '300px' }}
                >
                    <p className="text-secondary small fw-light fst-italic lh-base">
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
