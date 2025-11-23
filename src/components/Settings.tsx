import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Clock, Check, Shield, User, Smartphone } from 'lucide-react';

/**
 * Props for the Settings component.
 */
interface SettingsProps {
    onBack: () => void;
}

/**
 * Settings component.
 * Allows users to configure application settings (e.g., daily reminders).
 * Redesigned with "Antigravity" aesthetic but professional copy.
 * Expanded to a wider, full-page layout.
 */
export function Settings({ onBack }: SettingsProps) {
    const [enabled, setEnabled] = useState(false);
    const [time, setTime] = useState('09:00');
    const [saved, setSaved] = useState(false);

    // Load settings from local storage
    useEffect(() => {
        const savedEnabled = localStorage.getItem('reminder_enabled');
        const savedTime = localStorage.getItem('reminder_time');
        if (savedEnabled) setEnabled(JSON.parse(savedEnabled));
        if (savedTime) setTime(savedTime);
    }, []);

    /**
     * Saves the settings and requests notification permission if enabled.
     */
    const handleSave = () => {
        localStorage.setItem('reminder_enabled', JSON.stringify(enabled));
        localStorage.setItem('reminder_time', time);

        if (enabled) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Settings Updated', {
                        body: `Daily reminder set for ${time}`,
                    });
                }
            });
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="min-h-screen p-6 w-full max-w-2xl mx-auto flex flex-col"
        >
            <header className="flex items-center justify-between mb-10">
                <button
                    onClick={onBack}
                    className="p-3 gravity-button rounded-full text-slate-300 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold uppercase tracking-widest text-starlight">Settings</h2>
                <div className="w-12" /> {/* Spacer for centering */}
            </header>

            <div className="space-y-6">
                {/* Notifications Section */}
                <div className="gravity-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                        <div className="p-3 rounded-full bg-nebula-500/10 text-nebula-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-starlight">Notifications</h3>
                            <p className="text-sm text-slate-400">Manage your daily check-in reminders</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="font-medium text-slate-300">Enable Daily Reminders</span>
                            <button
                                onClick={() => setEnabled(!enabled)}
                                className={`w-14 h-8 rounded-full transition-all duration-300 relative ${enabled ? 'bg-aurora-500 shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'bg-slate-800'}`}
                            >
                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <AnimatePresence>
                            {enabled && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Clock size={14} />
                                        Reminder Time
                                    </label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="gravity-input w-full text-xl tracking-widest text-center font-mono"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Account Section (Visual Only for now) */}
                <div className="gravity-panel p-8 rounded-3xl opacity-80">
                    <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                        <div className="p-3 rounded-full bg-plasma-500/10 text-plasma-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-starlight">Account</h3>
                            <p className="text-sm text-slate-400">Manage your profile and data</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 text-sm text-center">
                        Signed in locally. Data is stored on this device.
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full gravity-button py-5 rounded-xl font-bold text-starlight mt-8 flex items-center justify-center gap-2 group uppercase tracking-wider text-sm sticky bottom-6 shadow-xl backdrop-blur-xl bg-black/50"
                >
                    {saved ? <Check size={18} className="text-aurora-400" /> : null}
                    {saved ? 'Settings Saved' : 'Save Changes'}
                </button>
            </div>
        </motion.div>
    );
}
