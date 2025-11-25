import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const GlowCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Main glow cursor */}
            <motion.div
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 200,
                    mass: 0.5,
                }}
                style={{
                    position: 'fixed',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(214, 56, 100, 0.3) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    mixBlendMode: 'screen',
                }}
            />
            
            {/* Larger outer glow */}
            <motion.div
                animate={{
                    x: mousePosition.x - 50,
                    y: mousePosition.y - 50,
                }}
                transition={{
                    type: 'spring',
                    damping: 40,
                    stiffness: 100,
                    mass: 1,
                }}
                style={{
                    position: 'fixed',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    mixBlendMode: 'screen',
                }}
            />
        </>
    );
};

export default GlowCursor;
