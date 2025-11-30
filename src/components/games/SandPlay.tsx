import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface SandPlayProps {
    onBack: () => void;
}

export function SandPlay({ onBack }: SandPlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            // Fill with sand color
            ctx.fillStyle = '#F5DEB3';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, []);

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    };

    const handleReset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#F5DEB3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
                    <h1 className="h5 ms-3 mb-0 fw-bold text-secondary text-uppercase tracking-widest">Sand Play</h1>
                </div>
                <button onClick={handleReset} className="btn btn-link text-secondary p-2 rounded-circle hover-text-primary gravity-button">
                    <RefreshCw size={20} />
                </button>
            </header>

            <div className="flex-1 w-100 h-100 rounded-4 overflow-hidden shadow-inner position-relative bg-warning bg-opacity-10">
                <canvas
                    ref={canvasRef}
                    className="w-100 h-100 touch-none cursor-crosshair"
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    onMouseMove={draw}
                    onTouchStart={() => setIsDrawing(true)}
                    onTouchEnd={() => setIsDrawing(false)}
                    onTouchMove={draw}
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-3 text-center pe-none">
                    <p className="small text-secondary opacity-50 mb-0">Draw patterns in the sand</p>
                </div>
            </div>
        </motion.div>
    );
}
