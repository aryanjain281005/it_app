import React from 'react';

const Card = ({
    children,
    variant = 'elevated', // elevated, filled, outlined
    className = '',
    hover = false,
    style = {},
    ...props
}) => {
    const baseStyles = {
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        padding: '16px',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        overflow: 'hidden',
        ...(hover && { cursor: 'pointer' }),
    };

    const variants = {
        elevated: {
            backgroundColor: 'var(--md-sys-color-surface)',
            boxShadow: 'var(--md-sys-elevation-1)',
        },
        filled: {
            backgroundColor: 'var(--md-sys-color-surface-variant)',
            boxShadow: 'none',
        },
        outlined: {
            backgroundColor: 'var(--md-sys-color-surface)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            boxShadow: 'none',
        }
    };

    const combinedStyle = {
        ...baseStyles,
        ...variants[variant],
        ...style,
    };

    return (
        <div
            className={className}
            style={combinedStyle}
            onMouseEnter={(e) => {
                if (hover) {
                    e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-2)';
                }
            }}
            onMouseLeave={(e) => {
                if (hover) {
                    e.currentTarget.style.boxShadow = variant === 'elevated' ? 'var(--md-sys-elevation-1)' : 'none';
                }
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
