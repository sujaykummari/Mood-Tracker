import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * SignIn component.
 * Provides a form for users to enter their name and email to start the session.
 * Features the "Antigravity" aesthetic with floating elements and neon glows.
 */
export function SignIn() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { signIn } = useAuth();

    /**
     * Handles form submission.
     * @param e - Form event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            signIn(name, email);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-nebula-500/20 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-aurora-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="gravity-panel p-10 sm:p-12 rounded-[2rem] max-w-md w-full relative z-10"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 mb-6 border border-white/10"
                    >
                        <Sparkles className="text-aurora-400" size={24} />
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-starlight to-slate-400 tracking-tight">
                        Mood Tracker
                    </h2>
                    <p className="text-slate-400 font-light tracking-wide">Welcome back to your center.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="gravity-input w-full"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="gravity-input w-full"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full gravity-button py-4 rounded-xl font-bold text-starlight mt-8 tracking-wider uppercase text-sm group"
                    >
                        <span className="relative z-10 group-hover:text-white transition-colors">Sign In</span>
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
