import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Calendar } from 'lucide-react';

/**
 * Props for the Journal component.
 */
interface JournalProps {
    onBack: () => void;
}

/**
 * Journal component.
 * Allows users to write and save daily journal entries.
 * Redesigned with "Antigravity" aesthetic: glass panels, mono fonts.
 */
export function Journal({ onBack }: JournalProps) {
    const [entry, setEntry] = useState('');
    const [saved, setSaved] = useState(false);

    // Load saved entry for today
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const savedEntry = localStorage.getItem(`journal_${today}`);
        if (savedEntry) setEntry(savedEntry);
    }, []);

    /**
     * Saves the current entry to local storage.
     */
    const handleSave = () => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`journal_${today}`, entry);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="min-h-screen p-6 max-w-md mx-auto flex flex-col"
        >
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="p-3 gravity-button rounded-full text-slate-300 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-bold uppercase tracking-widest text-starlight">Journal</h2>
                <button
                    onClick={handleSave}
                    className={`p-3 rounded-full transition-all duration-300 ${saved ? 'bg-aurora-500/20 text-aurora-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'gravity-button text-nebula-400 hover:text-white'}`}
                >
                    <Save size={24} />
                </button>
            </header>

            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-slate-400 px-2 border-b border-white/5 pb-4">
                    <Calendar size={16} />
                    <span className="text-xs font-mono uppercase tracking-widest">{dateStr}</span>
                </div>

                <div className="flex-1 gravity-panel rounded-3xl p-1 relative overflow-hidden border-white/5">
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder="Write your thoughts here..."
                        className="w-full h-full bg-transparent border-none p-6 text-lg leading-relaxed focus:outline-none resize-none placeholder:text-slate-600 text-slate-200 font-sans"
                        spellCheck={false}
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                        {entry.length} chars
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
