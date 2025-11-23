import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignIn } from './components/SignIn';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { Breathing } from './components/Breathing';
import { NavBar } from './components/NavBar';
import { AnimatePresence } from 'framer-motion';

/**
 * Type definition for the available views in the application.
 */
type View = 'dashboard' | 'journal' | 'breathing';

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
        <div className="pb-24"> {/* Padding for bottom nav */}
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
            </AnimatePresence>

            <NavBar currentView={currentView} onNavigate={handleNavigate} />
        </div>
    );
}

/**
 * Root App component.
 * Wraps the application content with the AuthProvider to manage user sessions.
 */
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
