import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Clock, Check, User } from 'lucide-react';

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
            className="min-vh-100 p-4 w-100 mx-auto d-flex flex-column"
            style={{ maxWidth: '672px' }}
        >
            <header className="d-flex align-items-center justify-content-between mb-5">
                <button
                    onClick={onBack}
                    className="btn btn-link text-secondary p-2 rounded-circle hover-text-white gravity-button"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="h5 fw-bold text-uppercase tracking-widest text-light mb-0">Settings</h2>
                <div style={{ width: '48px' }} /> {/* Spacer for centering */}
            </header>

            <div className="d-flex flex-column gap-4">
                {/* Notifications Section */}
                <div className="gravity-panel p-4 rounded-4">
                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom border-white border-opacity-10 pb-4">
                        <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary shadow-sm" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 className="h6 fw-bold text-light mb-0">Notifications</h3>
                            <p className="small text-secondary mb-0">Manage your daily check-in reminders</p>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-white border-opacity-10 bg-light bg-opacity-10">
                            <span className="fw-medium text-light">Enable Daily Reminders</span>
                            <button
                                onClick={() => setEnabled(!enabled)}
                                className="btn p-0 rounded-pill position-relative transition-all border-0"
                                style={{
                                    width: '3.5rem',
                                    height: '2rem',
                                    backgroundColor: enabled ? '#2dd4bf' : '#1e293b',
                                    boxShadow: enabled ? '0 0 15px rgba(45,212,191,0.4)' : 'none'
                                }}
                            >
                                <div
                                    className="position-absolute top-50 translate-middle-y bg-white rounded-circle shadow-sm transition-transform"
                                    style={{
                                        width: '1.5rem',
                                        height: '1.5rem',
                                        left: '0.25rem',
                                        transform: enabled ? 'translateX(1.5rem)' : 'translateX(0)'
                                    }}
                                />
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
                                    <label className="d-block small fw-bold text-secondary text-uppercase tracking-widest mb-2 d-flex align-items-center gap-2">
                                        <Clock size={14} />
                                        Reminder Time
                                    </label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="form-control gravity-input w-100 fs-5 text-center font-monospace tracking-widest"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Account Section (Visual Only for now) */}
                <div className="gravity-panel p-4 rounded-4 opacity-75">
                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom border-white border-opacity-10 pb-4">
                        <div className="p-2 rounded-circle bg-info bg-opacity-10 text-info" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="h6 fw-bold text-light mb-0">Account</h3>
                            <p className="small text-secondary mb-0">Manage your profile and data</p>
                        </div>
                    </div>
                    <div className="p-3 rounded-3 border border-white border-opacity-10 bg-light bg-opacity-10 text-secondary small text-center">
                        Signed in locally. Data is stored on this device.
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="btn w-100 gravity-button py-3 rounded-4 fw-bold text-light mt-4 d-flex align-items-center justify-content-center gap-2 text-uppercase small sticky-bottom shadow-lg backdrop-blur-xl"
                    style={{ bottom: '1.5rem', backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    {saved ? <Check size={18} className="text-info" style={{ color: '#2dd4bf' }} /> : null}
                    {saved ? 'Settings Saved' : 'Save Changes'}
                </button>
            </div>
        </motion.div>
    );
}
