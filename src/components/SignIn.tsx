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
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 position-relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden z-n1">
                <div className="position-absolute top-25 start-25 rounded-circle blur-3xl opacity-25" style={{ width: '256px', height: '256px', background: '#6366f1', filter: 'blur(100px)' }} />
                <div className="position-absolute bottom-25 end-25 rounded-circle blur-3xl opacity-25" style={{ width: '256px', height: '256px', background: '#2dd4bf', filter: 'blur(100px)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="gravity-panel p-5 rounded-5 w-100 position-relative z-1"
                style={{ maxWidth: '450px' }}
            >
                <div className="text-center mb-5">
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="d-inline-flex align-items-center justify-center p-3 rounded-4 mb-4 border border-white border-opacity-10 bg-light bg-opacity-10"
                    >
                        <Sparkles className="text-info" size={24} />
                    </motion.div>
                    <h2 className="h1 fw-bold mb-2 text-light tracking-tight">
                        Mood Tracker
                    </h2>
                    <p className="text-secondary fw-light tracking-wide">Welcome back to your center.</p>
                </div>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-2">
                        <label className="small fw-bold text-secondary text-uppercase tracking-widest ms-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control gravity-input w-100"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <label className="small fw-bold text-secondary text-uppercase tracking-widest ms-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control gravity-input w-100"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn w-100 gravity-button py-3 rounded-4 fw-bold text-light mt-4 tracking-wider text-uppercase small position-relative overflow-hidden group"
                    >
                        <span className="position-relative z-1 transition-colors">Sign In</span>
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
