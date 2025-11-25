import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', size = 'md', isLoading, style = {}, ...props }) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.2s ease',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        border: 'none',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        letterSpacing: '0.01em',
    };

    const variants = {
        primary: {
            background: 'var(--md-sys-color-primary)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(232, 69, 69, 0.25)',
        },
        secondary: {
            background: 'var(--gradient-secondary)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.25)',
        },
        outline: {
            background: 'transparent',
            color: 'var(--md-sys-color-primary)',
            border: '2px solid var(--md-sys-color-primary)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-main)',
        },
        filled: {
            background: 'var(--md-sys-color-primary)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(232, 69, 69, 0.25)',
        },
        outlined: {
            background: 'transparent',
            border: '2px solid var(--md-sys-color-outline)',
            color: 'var(--color-text-main)',
        },
        text: {
            background: 'transparent',
            color: 'var(--md-sys-color-primary)',
        }
    };

    const sizes = {
        sm: {
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            height: '36px',
        },
        md: {
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            height: '48px',
        },
        lg: {
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            height: '56px',
        },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(232, 69, 69, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
                ...baseStyles,
                ...variants[variant],
                ...sizes[size],
                ...style,
            }}
            disabled={isLoading}
            className="ripple"
            {...props}
        >
            {isLoading ? (
                <span className="animate-spin" style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    marginRight: '8px'
                }} />
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
