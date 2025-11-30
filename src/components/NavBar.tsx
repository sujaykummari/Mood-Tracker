
import { Home, BookOpen, Wind, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavBarProps {
    currentView: string;
    onNavigate: (view: any) => void;
}

export function NavBar({ currentView, onNavigate }: NavBarProps) {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'panic', icon: AlertCircle, label: 'Panic' },
        { id: 'journal', icon: BookOpen, label: 'Journal' },
        { id: 'breathing', icon: Wind, label: 'Breathe' },
        // Settings is usually top-right or a separate tab, but for bottom nav it fits well as a 4th item or we keep it in header.
        // Let's keep Settings in the header as per standard iOS apps, or add it here if we want a "Profile" tab.
        // For now, let's stick to the main 3 actions + maybe a "Profile/Settings" tab if we want to move it from the header.
        // The plan said "Home, Journal, Breathe". Let's stick to that for the main nav.
    ];

    return (
        <div className="position-fixed bottom-0 start-0 end-0 z-3 p-3 pb-4 d-flex justify-content-center pe-none">
            <div className="pe-auto gravity-panel rounded-pill px-4 py-3 d-flex align-items-center gap-4 shadow-lg position-relative">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const isPanic = item.id === 'panic';

                    if (isPanic) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="btn rounded-circle p-0 d-flex align-items-center justify-content-center position-relative transition-transform hover-scale-110"
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    marginTop: '-32px',
                                    background: 'linear-gradient(135deg, #FFB7B2, #ECA869)',
                                    boxShadow: '0 8px 24px rgba(255, 183, 178, 0.4), 0 0 0 8px rgba(255, 183, 178, 0.15)',
                                    border: '4px solid var(--surface)'
                                }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <item.icon size={32} className="text-white" strokeWidth={2.5} />
                                </motion.div>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`btn btn-link text-decoration-none p-0 position-relative d-flex flex-column align-items-center gap-1 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-secondary'
                                }`}
                            style={{ color: isActive ? 'var(--primary)' : undefined }}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="position-absolute bottom-0 translate-middle-x start-50"
                                    style={{ width: '4px', height: '4px', backgroundColor: 'var(--primary)', borderRadius: '50%', marginBottom: '-8px', boxShadow: '0 0 8px var(--primary)' }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
