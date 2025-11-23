import React from 'react';
import { Home, BookOpen, Wind, Settings } from 'lucide-react';
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
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none flex justify-center">
            <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex items-center gap-8 shadow-2xl">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`relative flex flex-col items-center gap-1 transition-colors duration-300 ${isActive ? 'text-aurora-400' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute -bottom-2 w-1 h-1 bg-aurora-400 rounded-full shadow-[0_0_8px_#2dd4bf]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
