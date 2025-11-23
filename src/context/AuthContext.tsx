import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * User interface definition.
 */
interface User {
    name: string;
    email: string;
}

/**
 * AuthContextType definition for the context value.
 */
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (name: string, email: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component to manage user authentication state.
 * Persists user session to localStorage.
 * 
 * @param children - Child components to wrap.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load user from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('mood_tracker_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    /**
     * Signs in a user and saves their session.
     * @param name - User's name.
     * @param email - User's email.
     */
    const signIn = (name: string, email: string) => {
        const newUser = { name, email };
        setUser(newUser);
        localStorage.setItem('mood_tracker_user', JSON.stringify(newUser));
    };

    /**
     * Signs out the current user and clears the session.
     */
    const signOut = () => {
        setUser(null);
        localStorage.removeItem('mood_tracker_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
