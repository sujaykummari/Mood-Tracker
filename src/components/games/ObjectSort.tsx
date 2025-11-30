import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Heart, Cloud, Moon, RefreshCw } from 'lucide-react';

interface ObjectSortProps {
    onBack: () => void;
}

const ITEMS = [
    { id: 1, type: 'star', icon: Star, color: 'text-warning' },
    { id: 2, type: 'heart', icon: Heart, color: 'text-danger' },
    { id: 3, type: 'cloud', icon: Cloud, color: 'text-info' },
    { id: 4, type: 'moon', icon: Moon, color: 'text-primary' },
    { id: 5, type: 'star', icon: Star, color: 'text-warning' },
    { id: 6, type: 'heart', icon: Heart, color: 'text-danger' },
];

export function ObjectSort({ onBack }: ObjectSortProps) {
    const [items, setItems] = useState(ITEMS);

    const handleSort = (id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleReset = () => {
        setItems(ITEMS);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-vh-100 w-100 d-flex flex-column p-4"
            style={{ background: 'var(--bg-app)' }}
        >
            <header className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <button onClick={onBack} className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="h5 ms-3 mb-0 fw-bold text-secondary text-uppercase tracking-widest">Sorting</h1>
                </div>
                <button onClick={handleReset} className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button">
                    <RefreshCw size={20} />
                </button>
            </header>

            <div className="flex-1 d-flex flex-column align-items-center justify-content-between py-5">
                {/* Items to Sort */}
                <div className="d-flex flex-wrap justify-content-center gap-4 w-100" style={{ minHeight: '200px' }}>
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layoutId={`item-${item.id}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                onDragEnd={(_, info) => {
                                    if (info.offset.y > 100) {
                                        handleSort(item.id);
                                    }
                                }}
                                className={`p-3 rounded-circle bg-white shadow-sm cursor-grab active-cursor-grabbing ${item.color}`}
                            >
                                <item.icon size={32} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Basket */}
                <div className="w-100 d-flex justify-content-center">
                    <div
                        className="rounded-4 border-2 border-dashed border-secondary border-opacity-25 d-flex align-items-center justify-content-center"
                        style={{ width: '200px', height: '150px', background: 'rgba(0,0,0,0.02)' }}
                    >
                        <span className="text-secondary opacity-50 small text-uppercase tracking-widest">
                            Drag items here
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
