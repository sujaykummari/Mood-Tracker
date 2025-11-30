import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te' | 'kn' | 'ta' | 'ml';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string; // Placeholder for future translations if needed
}

const LANGUAGES: { id: Language; label: string; voiceCode: string }[] = [
    { id: 'en', label: 'English', voiceCode: 'en-IN' },
    { id: 'hi', label: 'Hindi', voiceCode: 'hi-IN' },
    { id: 'te', label: 'Telugu', voiceCode: 'te-IN' },
    { id: 'kn', label: 'Kannada', voiceCode: 'kn-IN' },
    { id: 'ta', label: 'Tamil', voiceCode: 'ta-IN' },
    { id: 'ml', label: 'Malayalam', voiceCode: 'ml-IN' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Simple placeholder translation function
    const t = (key: string) => key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export { LANGUAGES };
export type { Language };
