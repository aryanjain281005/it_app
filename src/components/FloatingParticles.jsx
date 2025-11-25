import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FloatingParticles = ({ count = 20 }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 6 + 2,
            duration: Math.random() * 10 + 15,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.3 + 0.1,
        }));
        setParticles(newParticles);
    }, [count]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden'
        }}>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{
                        x: `${particle.x}vw`,
                        y: `${particle.y}vh`,
                    }}
                    animate={{
                        y: [
                            `${particle.y}vh`,
                            `${particle.y - 20}vh`,
                            `${particle.y}vh`,
                        ],
                        x: [
                            `${particle.x}vw`,
                            `${particle.x + 10}vw`,
                            `${particle.x}vw`,
                        ],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        width: particle.size,
                        height: particle.size,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, rgba(214, 56, 100, ${particle.opacity}) 0%, rgba(249, 115, 22, ${particle.opacity * 0.5}) 100%)`,
                        filter: 'blur(1px)',
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingParticles;
