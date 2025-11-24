import React from 'react';
import { Loader } from 'lucide-react';

const Button = ({
    children,
    variant = 'filled', // filled, outlined, text, elevated, tonal
    size = 'md',
    isLoading = false,
    className = '',
    style = {},
    ...props
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        borderRadius: 'var(--md-sys-shape-corner-full)',
        transition: 'all 0.2s ease',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        border: 'none',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        letterSpacing: '0.1px',
    };

    const variants = {
        filled: {
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            boxShadow: 'var(--md-sys-elevation-0)',
        },
        outlined: {
            backgroundColor: 'transparent',
            color: 'var(--md-sys-color-primary)',
            border: '1px solid var(--md-sys-color-outline)',
        },
        text: {
            backgroundColor: 'transparent',
            color: 'var(--md-sys-color-primary)',
            paddingLeft: '12px',
            paddingRight: '12px',
        },
        elevated: {
            backgroundColor: 'var(--md-sys-color-surface-variant)',
            color: 'var(--md-sys-color-primary)',
            boxShadow: 'var(--md-sys-elevation-1)',
        },
        tonal: {
            backgroundColor: 'var(--md-sys-color-secondary-container)',
            color: 'var(--md-sys-color-on-secondary-container)',
        },
        // Legacy mapping
        primary: {
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
        },
        secondary: {
            backgroundColor: 'var(--md-sys-color-secondary-container)',
            color: 'var(--md-sys-color-on-secondary-container)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--md-sys-color-primary)',
        },
        danger: {
            backgroundColor: 'var(--md-sys-color-error)',
            color: 'var(--md-sys-color-on-error)',
        }
    };

    const sizes = {
        sm: { height: '32px', padding: '0 16px', fontSize: '0.875rem' },
        md: { height: '40px', padding: '0 24px', fontSize: '0.875rem' },
        lg: { height: '48px', padding: '0 32px', fontSize: '1rem' },
    };

    const combinedStyle = {
        ...baseStyles,
        ...variants[variant] || variants.filled,
        ...sizes[size],
        ...style,
    };

    return (
        <button style={combinedStyle} disabled={isLoading} {...props}>
            {isLoading && <Loader className="animate-spin" size={18} style={{ marginRight: '0.5rem' }} />}
            {children}
        </button>
    );
};

export default Button;
