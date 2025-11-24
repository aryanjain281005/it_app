import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', isLoading, style = {}, ...props }) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        border: 'none',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        letterSpacing: '0.02em',
    };

    const variants = {
        primary: {
            background: 'var(--gradient-primary)',
            color: 'white',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        secondary: {
            background: 'var(--gradient-secondary)',
            color: 'white',
            boxShadow: 'var(--shadow-md)',
        },
        outline: {
            background: 'transparent',
            color: 'var(--color-text-main)',
            border: '1px solid var(--color-text-muted)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-main)',
        },
        filled: { // Keeping for compatibility
            background: 'var(--gradient-primary)',
            color: 'white',
        },
        outlined: { // Keeping for compatibility
            background: 'transparent',
            border: '1px solid var(--color-text-muted)',
            color: 'var(--color-text-main)',
        },
        text: { // Keeping for compatibility
            background: 'transparent',
            color: 'var(--color-text-main)',
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
        <button
            style={{
                ...baseStyles,
                ...variants[variant],
                ...sizes[size],
                ...style,
            }}
            disabled={isLoading}
            className="hover-scale"
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
        </button>
    );
};

export default Button;
