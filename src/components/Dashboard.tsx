import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MoodFeedback } from './MoodFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings as SettingsIcon, BookOpen, Wind } from 'lucide-react';

// Import Plant Assets
import plantAnxious from '../assets/plant_anxious_1764418244120.png';
import plantLow from '../assets/plant_low_1764418262198.png';
import plantNeutral from '../assets/plant_neutral_1764418276589.png';
import plantCalm from '../assets/plant_calm_1764418294562.png';
import plantHappy from '../assets/plant_happy_1764418309016.png';

interface DashboardProps {
    onNavigate: (view: 'journal' | 'breathing' | 'panic' | 'settings', params?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
    const { user, signOut } = useAuth();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [showMoodFeedback, setShowMoodFeedback] = useState(false);

    // Load saved mood
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const savedMood = localStorage.getItem(`mood_${today}`);
        if (savedMood) {
            setSelectedMood(savedMood);
        }
    }, []);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`mood_${today}`, mood);
        setShowMoodFeedback(true);
    };

    // Determine Plant Image based on Mood
    const getPlantImage = () => {
        switch (selectedMood) {
            case '😔': return plantLow; // Low
            case '😐': return plantNeutral; // Okay
            case '🙂': return plantCalm; // Good
            case '😊': return plantCalm; // Great (share calm state or make happy distinct)
            case '🤩': return plantHappy; // Peak
            default: return plantNeutral; // Default/Neutral state
        }
    };

    // Determine Plant Message
    const getPlantMessage = () => {
        if (!selectedMood) return "How are you feeling today?";
        switch (selectedMood) {
            case '😔': return "It's okay to wilt sometimes. Rain helps us grow.";
            case '😐': return "One day at a time. You're doing okay.";
            case '🙂': return "Growing steady and strong.";
            case '😊': return "Soaking up the sunshine!";
            case '🤩': return "Blooming beautifully!";
            default: return "You're growing, even on hard days.";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-vh-100 d-flex flex-column align-items-center position-relative overflow-hidden pb-5 mb-5"
        >
            {/* Header */}
            <header className="w-100 container-fluid d-flex justify-content-between align-items-center p-4 z-3" style={{ maxWidth: '600px' }}>
                <div className="d-flex flex-column">
                    <span className="small fw-bold text-secondary text-uppercase tracking-widest">Welcome Back</span>
                    <h1 className="h4 fw-bold text-primary tracking-wide">
                        {user?.name} 🌿
                    </h1>
                </div>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => onNavigate('settings')}
                        className="btn btn-link text-secondary p-2 rounded-circle hover-bg-light-10 transition-colors"
                    >
                        <SettingsIcon size={20} />
                    </button>
                    <button
                        onClick={signOut}
                        className="btn btn-link text-secondary p-2 rounded-circle hover-text-danger hover-bg-light-10 transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="w-100 container-fluid d-flex flex-column align-items-center z-2 px-4 gap-4" style={{ maxWidth: '600px' }}>

                {/* Plant Section - The Garden */}
                <section className="w-100 d-flex flex-column align-items-center py-4 position-relative">
                    <motion.div
                        key={selectedMood || 'neutral'}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="position-relative z-1"
                    >
                        <img
                            src={getPlantImage()}
                            alt="Your growth plant"
                            className="img-fluid drop-shadow-lg"
                            style={{ maxHeight: '280px', filter: 'drop-shadow(0 10px 20px rgba(165, 138, 239, 0.2))' }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        key={`msg-${selectedMood}`}
                        className="mt-4 text-center gravity-panel px-4 py-2 rounded-pill bg-white bg-opacity-80 backdrop-blur-sm border border-white"
                    >
                        <p className="mb-0 text-secondary fw-medium small">
                            {getPlantMessage()}
                        </p>
                    </motion.div>
                </section>

                {/* Mood Tracker Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-100"
                >
                    <div className="gravity-panel p-3 rounded-4 w-100 border border-white bg-white bg-opacity-50">
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
                                    className={`btn border-0 d-flex flex-column align-items-center gap-2 transition-all duration-300 position-relative p-2 rounded-3 ${selectedMood === item.emoji ? 'bg-primary bg-opacity-10 translate-middle-y-1' : 'hover-bg-light-5'}`}
                                >
                                    <div className={`fs-2 transition-transform duration-300 ${selectedMood === item.emoji ? 'scale-110' : 'hover-scale-110'}`}>
                                        {item.emoji}
                                    </div>
                                    {selectedMood === item.emoji && (
                                        <motion.div
                                            layoutId="activeMoodIndicator"
                                            className="position-absolute bottom-0 w-1 h-1 rounded-circle shadow-sm"
                                            style={{ marginBottom: '-4px', backgroundColor: 'var(--primary)' }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Quick Actions Grid */}
                <div className="row w-100 g-3">
                    <div className="col-6">
                        <motion.button
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => onNavigate('journal')}
                            className="btn border-0 w-100 h-100 gravity-panel p-4 rounded-4 d-flex flex-column align-items-center gap-3 hover-bg-light-10 transition-all duration-300 active-scale-95 border border-white bg-white"
                        >
                            <div className="p-3 rounded-circle bg-opacity-10 hover-text-white hover-scale-110 transition-all duration-300 shadow-sm" style={{ backgroundColor: 'rgba(165, 138, 239, 0.1)', color: 'var(--primary)' }}>
                                <BookOpen size={24} />
                            </div>
                            <span className="fw-bold text-secondary hover-text-primary tracking-wide text-uppercase small">Journal</span>
                        </motion.button>
                    </div>

                    <div className="col-6">
                        <motion.button
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => onNavigate('breathing')}
                            className="btn border-0 w-100 h-100 gravity-panel p-4 rounded-4 d-flex flex-column align-items-center gap-3 hover-bg-light-10 transition-all duration-300 active-scale-95 border border-white bg-white"
                        >
                            <div className="p-3 rounded-circle bg-opacity-10 hover-text-white hover-scale-110 transition-all duration-300 shadow-sm" style={{ backgroundColor: 'rgba(129, 140, 248, 0.1)', color: '#818cf8' }}>
                                <Wind size={24} />
                            </div>
                            <span className="fw-bold text-secondary hover-text-primary tracking-wide text-uppercase small">Breathe</span>
                        </motion.button>
                    </div>
                </div>
            </main>

            <AnimatePresence>
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
