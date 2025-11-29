
import { Home, BookOpen, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavBarProps {
    currentView: string;
    onNavigate: (view: any) => void;
}

export function NavBar({ currentView, onNavigate }: NavBarProps) {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'journal', icon: BookOpen, label: 'Journal' },
        { id: 'breathing', icon: Wind, label: 'Breathe' },
        // Settings is usually top-right or a separate tab, but for bottom nav it fits well as a 4th item or we keep it in header.
        // Let's keep Settings in the header as per standard iOS apps, or add it here if we want a "Profile" tab.
        // For now, let's stick to the main 3 actions + maybe a "Profile/Settings" tab if we want to move it from the header.
        // The plan said "Home, Journal, Breathe". Let's stick to that for the main nav.
    ];

    return (
        <div className="position-fixed bottom-0 start-0 end-0 z-3 p-3 pb-4 d-flex justify-content-center pe-none">
            <div className="pe-auto gravity-panel rounded-pill px-4 py-3 d-flex align-items-center gap-4 shadow-lg">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`btn btn-link text-decoration-none p-0 position-relative d-flex flex-column align-items-center gap-1 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-secondary'
                                }`}
                            style={{ color: isActive ? '#a78bfa' : undefined }} // Custom color for active state to match lavender
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="position-absolute bottom-0 translate-middle-x start-50"
                                    style={{ width: '4px', height: '4px', backgroundColor: '#a78bfa', borderRadius: '50%', marginBottom: '-8px', boxShadow: '0 0 8px #a78bfa' }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
