import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sprout, Cat, Palette, Cloud, Star, Heart, Umbrella } from 'lucide-react';

// Game Components (Placeholders for now)
import { GrowPlant } from './GrowPlant';
import { SoftPet } from './SoftPet';
import { Mandala } from './Mandala';
import { CloudSwipe } from './CloudSwipe';
import { ObjectSort } from './ObjectSort';
import { HeartGlow } from './HeartGlow';
import { SandPlay } from './SandPlay';

interface GamesHubProps {
    onBack: () => void;
}

type GameId = 'plant' | 'pet' | 'mandala' | 'cloud' | 'sort' | 'heart' | 'sand';

const GAMES = [
    { id: 'plant', name: 'Grow-A-Plant', icon: Sprout, color: 'text-success', bg: 'bg-success', desc: 'Nurture a tiny seed.' },
    { id: 'pet', name: 'Soft Pet', icon: Cat, color: 'text-warning', bg: 'bg-warning', desc: 'A friend is waiting.' },
    { id: 'mandala', name: 'Coloring', icon: Palette, color: 'text-info', bg: 'bg-info', desc: 'Fill with pastel colors.' },
    { id: 'cloud', name: 'Cloud Swipe', icon: Cloud, color: 'text-primary', bg: 'bg-primary', desc: 'Clear the sky.' },
    { id: 'sort', name: 'Sorting', icon: Star, color: 'text-secondary', bg: 'bg-secondary', desc: 'Organize soft items.' },
    { id: 'heart', name: 'Heart Glow', icon: Heart, color: 'text-danger', bg: 'bg-danger', desc: 'Feel the warmth.' },
    { id: 'sand', name: 'Sand Play', icon: Umbrella, color: 'text-warning', bg: 'bg-warning', desc: 'Draw in the sand.' },
];

export function GamesHub({ onBack }: GamesHubProps) {
    const [activeGame, setActiveGame] = useState<GameId | null>(null);

    if (activeGame === 'plant') return <GrowPlant onBack={() => setActiveGame(null)} />;
    if (activeGame === 'pet') return <SoftPet onBack={() => setActiveGame(null)} />;
    if (activeGame === 'mandala') return <Mandala onBack={() => setActiveGame(null)} />;
    if (activeGame === 'cloud') return <CloudSwipe onBack={() => setActiveGame(null)} />;
    if (activeGame === 'sort') return <ObjectSort onBack={() => setActiveGame(null)} />;
    if (activeGame === 'heart') return <HeartGlow onBack={() => setActiveGame(null)} />;
    if (activeGame === 'sand') return <SandPlay onBack={() => setActiveGame(null)} />;
    // ... other games

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-vh-100 w-100 p-4 d-flex flex-column"
            style={{ background: 'var(--bg-app)' }}
        >
            <header className="d-flex align-items-center mb-5">
                <button
                    onClick={onBack}
                    className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="h4 ms-3 mb-0 fw-bold text-secondary text-uppercase tracking-widest">Calming Games</h1>
            </header>

            <div className="row g-3">
                {GAMES.map((game) => (
                    <div key={game.id} className="col-6 col-md-4">
                        <button
                            onClick={() => setActiveGame(game.id as GameId)}
                            className="btn w-100 h-100 gravity-panel p-4 rounded-4 text-start d-flex flex-column gap-3 hover-scale-105 transition-transform"
                        >
                            <div className={`p-3 rounded-circle bg-opacity-10 w-fit ${game.color}`} style={{ backgroundColor: `var(--${game.bg}-rgb, rgba(0,0,0,0.05))` }}>
                                <game.icon size={32} />
                            </div>
                            <div>
                                <h3 className="h6 fw-bold text-secondary mb-1">{game.name}</h3>
                                <p className="small text-secondary opacity-75 mb-0">{game.desc}</p>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
