import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignIn } from './components/SignIn';
import { Settings } from './components/Settings';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { Breathing } from './components/Breathing';
import { PanicButton } from './components/PanicButton';
import { NavBar } from './components/NavBar';
import { Affirmations } from './components/Affirmations';
import { GamesHub } from './components/games/GamesHub';
import { AnimatePresence } from 'framer-motion';

/**
 * Type definition for the available views in the application sujay.
 */
type View = 'dashboard' | 'journal' | 'breathing' | 'panic' | 'settings' | 'affirmations' | 'games';

/**
 * Main application content component.
 * Handles routing between different views based on authentication state and user navigation.
 */
function AppContent() {
    const { isAuthenticated } = useAuth();
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [viewParams, setViewParams] = useState<any>({});

    /**
     * Navigates to a specific view with optional parameters.
     * @param view - The target view to navigate to.
     * @param params - Optional parameters to pass to the view (e.g., initialTechnique for Breathing).
     */
    const handleNavigate = (view: View, params?: any) => {
        setViewParams(params || {});
        setCurrentView(view);
    };

    // If user is not authenticated, show the Sign In screen.
    if (!isAuthenticated) {
        return <SignIn />;
    }

    // Render the current view with exit/enter animations.
    return (
        <div className="pb-5 mb-5"> {/* Padding for bottom nav */}
            <AnimatePresence mode="wait">
                {currentView === 'dashboard' && (
                    <Dashboard
                        key="dashboard"
                        onNavigate={handleNavigate}
                    />
                )}
                {currentView === 'journal' && (
                    <Journal
                        key="journal"
                        onBack={() => setCurrentView('dashboard')}
                    />
                )}
                {currentView === 'breathing' && (
                    <Breathing
                        key="breathing"
                        onBack={() => setCurrentView('dashboard')}
                        initialTechnique={viewParams.initialTechnique}
                    />
                )}
                {currentView === 'panic' && (
                    <PanicButton
                        key="panic"
                        onBack={() => setCurrentView('dashboard')}
                    />
                )}
                {currentView === 'settings' && (
                    <Settings
                        onBack={() => setCurrentView('dashboard')}
                    />
                )}
                {currentView === 'affirmations' && (
                    <Affirmations
                        onBack={() => setCurrentView('dashboard')}
                    />
                )}
                {currentView === 'games' && (
                    <GamesHub
                        onBack={() => setCurrentView('dashboard')}
                    />
                )}
            </AnimatePresence>

            <NavBar currentView={currentView} onNavigate={handleNavigate} />
        </div>
    );
}

import { Globe } from 'lucide-react';
import { LanguageProvider, useLanguage, LANGUAGES } from './context/LanguageContext';

function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="position-fixed top-0 end-0 p-3 z-50">
            <div className="dropdown">
                <button
                    className="btn gravity-button d-flex align-items-center gap-2 text-secondary shadow-sm backdrop-blur-md bg-white bg-opacity-50"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <Globe size={18} />
                    <span className="text-uppercase small fw-bold">{language}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 overflow-hidden p-2">
                    {LANGUAGES.map((lang) => (
                        <li key={lang.id}>
                            <button
                                className={`dropdown-item rounded-3 small fw-bold ${language === lang.id ? 'bg-primary bg-opacity-10 text-primary' : 'text-secondary'}`}
                                onClick={() => setLanguage(lang.id)}
                            >
                                {lang.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

import { GamificationProvider } from './context/GamificationContext';

/**
 * Root App component.
 * Wraps the application content with the AuthProvider and LanguageProvider.
 */
function App() {
    return (
        <AuthProvider>
            <GamificationProvider>
                <LanguageProvider>
                    <LanguageSelector />
                    <AppContent />
                </LanguageProvider>
            </GamificationProvider>
        </AuthProvider>
    );
}

export default App;
