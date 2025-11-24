import React, { useState } from 'react';

const Input = ({ icon: Icon, label, error, style = {}, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div style={{ marginBottom: '1rem', ...style }}>
            <div style={{ position: 'relative' }}>
                {/* Input Field */}
                <input
                    style={{
                        width: '100%',
                        padding: Icon ? '16px 16px 16px 48px' : '16px',
                        borderRadius: '4px', // Material 3 small radius for text fields
                        border: `1px solid ${error ? 'var(--md-sys-color-error)' : isFocused ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}`,
                        backgroundColor: 'transparent',
                        outline: 'none',
                        fontSize: '1rem',
                        fontFamily: 'Roboto, sans-serif',
                        color: 'var(--md-sys-color-on-surface)',
                        transition: 'border-color 0.2s',
                        height: '56px',
                        boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                        setIsFocused(true);
                        if (props.onFocus) props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (props.onBlur) props.onBlur(e);
                    }}
                    placeholder=" " // Required for floating label trick if we were using CSS only, but here we use label prop
                    {...props}
                />

                {/* Label (Floating) */}
                {label && (
                    <label style={{
                        position: 'absolute',
                        left: Icon ? '48px' : '16px',
                        top: isFocused || props.value ? '-8px' : '16px',
                        fontSize: isFocused || props.value ? '0.75rem' : '1rem',
                        fontWeight: 400,
                        color: error ? 'var(--md-sys-color-error)' : isFocused ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
                        backgroundColor: 'var(--md-sys-color-background)',
                        padding: '0 4px',
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
                        size={24}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--md-sys-color-on-surface-variant)'
                        }}
                    />
                )}
            </div>

            {/* Supporting Text / Error */}
            {error && (
                <p style={{
                    marginTop: '4px',
                    marginLeft: '16px',
                    fontSize: '0.75rem',
                    color: 'var(--md-sys-color-error)',
                    fontFamily: 'Roboto, sans-serif'
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
