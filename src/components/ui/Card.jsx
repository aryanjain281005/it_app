import React from 'react';

const Card = ({ children, variant = 'elevated', hover = false, className = '', style = {}, ...props }) => {
    const baseStyles = {
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        ...(hover && { cursor: 'pointer' }),
    };

    const variants = {
        elevated: {
            background: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'var(--shadow-md)',
        },
        filled: {
            background: 'var(--color-bg-secondary)',
            border: '1px solid transparent',
        },
        outlined: {
            background: 'transparent',
            border: '1px solid var(--md-sys-color-outline)',
        },
        glass: {
            background: 'var(--gradient-glass)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'var(--shadow-lg)',
        }
    };

    // Hover effects
    const hoverStyles = hover ? {
        transform: 'translateY(-4px)',
        boxShadow: 'var(--shadow-glow)',
        borderColor: 'rgba(99, 102, 241, 0.5)', // Indigo glow
    } : {};

    return (
        <div
            className={`card ${hover ? 'hover-scale' : ''} ${className}`}
            style={{
                ...baseStyles,
                ...variants[variant],
                ...style,
            }}
            {...props}
        >
            {/* Optional: Add a subtle gradient overlay on hover */}
            {hover && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
};

export default Card;
