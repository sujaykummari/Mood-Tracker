import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface GamificationContextType {
    points: number;
    addPoints: (amount: number) => void;
    plantGrowth: number; // 0 to 100
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
    const [points, setPoints] = useState(0);
    const [plantGrowth, setPlantGrowth] = useState(0);

    useEffect(() => {
        const savedPoints = localStorage.getItem('user_points');
        if (savedPoints) setPoints(parseInt(savedPoints));

        const savedGrowth = localStorage.getItem('plant_growth');
        if (savedGrowth) setPlantGrowth(parseInt(savedGrowth));
    }, []);

    const addPoints = (amount: number) => {
        const newPoints = points + amount;
        setPoints(newPoints);
        localStorage.setItem('user_points', newPoints.toString());

        // Update plant growth based on points (e.g., 10 points = 1 growth unit)
        // Cap growth at 100
        const growthIncrease = Math.floor(amount / 5); // Faster growth for demo
        if (growthIncrease > 0) {
            const newGrowth = Math.min(plantGrowth + growthIncrease, 100);
            setPlantGrowth(newGrowth);
            localStorage.setItem('plant_growth', newGrowth.toString());
        }
    };

    return (
        <GamificationContext.Provider value={{ points, addPoints, plantGrowth }}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
}
