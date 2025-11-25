import { useEffect, useState } from 'react';

// Hook to detect user's motion preference
export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = () => {
            setPrefersReducedMotion(mediaQuery.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (onEnter, onEscape) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && onEnter) {
                onEnter(event);
            } else if (event.key === 'Escape' && onEscape) {
                onEscape(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onEnter, onEscape]);
};

// Trap focus within a modal/dialog
export const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    };

    element.addEventListener('keydown', handleTabKey);

    // Focus first element
    firstFocusable?.focus();

    return () => {
        element.removeEventListener('keydown', handleTabKey);
    };
};

// Announce to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
        announcer.setAttribute('aria-live', priority);
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
};

// Create screen reader announcer element (call once in App.jsx)
export const createScreenReaderAnnouncer = () => {
    if (document.getElementById('screen-reader-announcer')) return;

    const announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);
};

// Skip to main content link
export const SkipToContent = () => {
    return (
        <a
            href="#main-content"
            style={{
                position: 'absolute',
                left: '-10000px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                background: '#D63864',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                zIndex: 9999,
            }}
            onFocus={(e) => {
                e.target.style.position = 'fixed';
                e.target.style.top = '1rem';
                e.target.style.left = '1rem';
                e.target.style.width = 'auto';
                e.target.style.height = 'auto';
            }}
            onBlur={(e) => {
                e.target.style.position = 'absolute';
                e.target.style.left = '-10000px';
                e.target.style.top = 'auto';
                e.target.style.width = '1px';
                e.target.style.height = '1px';
            }}
        >
            Skip to main content
        </a>
    );
};

// Helper to generate unique IDs for ARIA
let idCounter = 0;
export const generateId = (prefix = 'id') => {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
};

// Focus management for SPAs
export const manageFocus = (element) => {
    if (!element) return;
    
    element.setAttribute('tabindex', '-1');
    element.focus();
    element.addEventListener('blur', () => {
        element.removeAttribute('tabindex');
    }, { once: true });
};

// Detect high contrast mode
export const useHighContrastMode = () => {
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        setHighContrast(mediaQuery.matches);

        const handleChange = () => {
            setHighContrast(mediaQuery.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return highContrast;
};
