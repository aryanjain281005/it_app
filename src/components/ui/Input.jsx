import React, { useState } from 'react';

const Input = ({ icon: Icon, label, error, style = {}, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div style={{ marginBottom: '1.5rem', ...style }}>
            <div style={{ position: 'relative' }}>
                {/* Input Field */}
                <input
                    style={{
                        width: '100%',
                        padding: Icon ? '16px 16px 16px 48px' : '16px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${error ? 'var(--color-error)' : isFocused ? 'var(--color-info)' : 'var(--md-sys-color-outline)'}`,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dark semi-transparent
                        outline: 'none',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        color: 'var(--color-text-main)',
                        transition: 'all 0.2s ease',
                        height: '56px',
                        boxSizing: 'border-box',
                        boxShadow: isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                    }}
                    onFocus={(e) => {
                        setIsFocused(true);
                        if (props.onFocus) props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (props.onBlur) props.onBlur(e);
                    }}
                    placeholder=" " // Required for floating label trick
                    {...props}
                />

                {/* Label (Floating) */}
                {label && (
                    <label style={{
                        position: 'absolute',
                        left: Icon ? '48px' : '16px',
                        top: isFocused || props.value ? '-10px' : '16px',
                        fontSize: isFocused || props.value ? '0.75rem' : '1rem',
                        fontWeight: 500,
                        color: error ? 'var(--color-error)' : isFocused ? 'var(--color-info)' : 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-bg-main)', // Match background to hide line
                        padding: '0 6px',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}>
                        {label}
                    </label>
                )}

                {/* Icon */}
                {Icon && (
                    <Icon
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: isFocused ? 'var(--color-info)' : 'var(--color-text-muted)',
                            transition: 'color 0.2s ease'
                        }}
                    />
                )}
            </div>

            {/* Supporting Text / Error */}
            {error && (
                <p style={{
                    marginTop: '6px',
                    marginLeft: '4px',
                    fontSize: '0.875rem',
                    color: 'var(--color-error)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
