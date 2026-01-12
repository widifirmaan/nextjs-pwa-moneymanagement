"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type ColorScheme = 'dark' | 'light' | 'blue' | 'purple' | 'green' | 'rose' | 'orange' | 'emerald';

interface ThemeContextType {
    colorScheme: ColorScheme;
    setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const colorSchemes = {
    emerald: {
        name: 'Emerald Dream',
        background: '#ecfdf5',
        foreground: '#064e3b',
        card: '#d1fae5',
        cardForeground: '#064e3b',
        primary: '#10b981',
        primaryForeground: '#ffffff',
        secondary: '#a7f3d0',
        muted: '#6ee7b7',
        accent: '#34d399',
        border: '#a7f3d0',
    },
    dark: {
        name: 'Dark',
        background: '#0a0a0a',
        foreground: '#fafafa',
        card: '#1a1a1a',
        cardForeground: '#fafafa',
        primary: '#ec4899',
        primaryForeground: '#ffffff',
        secondary: '#27272a',
        muted: '#3f3f46',
        accent: '#f472b6',
        border: '#27272a',
    },
    light: {
        name: 'Light',
        background: '#fafafa',
        foreground: '#0a0a0a',
        card: '#ffffff',
        cardForeground: '#0a0a0a',
        primary: '#ec4899',
        primaryForeground: '#ffffff',
        secondary: '#f5f5f5',
        muted: '#a1a1aa',
        accent: '#f472b6',
        border: '#e5e5e5',
    },
    blue: {
        name: 'Ocean Blue',
        background: '#e0f2fe',
        foreground: '#0c4a6e',
        card: '#f0f9ff',
        cardForeground: '#0c4a6e',
        primary: '#0ea5e9',
        primaryForeground: '#ffffff',
        secondary: '#bae6fd',
        muted: '#7dd3fc',
        accent: '#06b6d4',
        border: '#bae6fd',
    },
    purple: {
        name: 'Royal Purple',
        background: '#f3e8ff',
        foreground: '#581c87',
        card: '#faf5ff',
        cardForeground: '#581c87',
        primary: '#a855f7',
        primaryForeground: '#ffffff',
        secondary: '#e9d5ff',
        muted: '#d8b4fe',
        accent: '#c084fc',
        border: '#e9d5ff',
    },
    green: {
        name: 'Forest Green',
        background: '#dcfce7',
        foreground: '#14532d',
        card: '#f0fdf4',
        cardForeground: '#14532d',
        primary: '#22c55e',
        primaryForeground: '#ffffff',
        secondary: '#bbf7d0',
        muted: '#86efac',
        accent: '#4ade80',
        border: '#bbf7d0',
    },
    orange: {
        name: 'Sunset Orange',
        background: '#ffedd5',
        foreground: '#7c2d12',
        card: '#fff7ed',
        cardForeground: '#7c2d12',
        primary: '#f97316',
        primaryForeground: '#ffffff',
        secondary: '#fed7aa',
        muted: '#fdba74',
        accent: '#fb923c',
        border: '#fed7aa',
    },
    rose: {
        name: 'Rose Garden',
        background: '#ffe4e6',
        foreground: '#881337',
        card: '#fff1f2',
        cardForeground: '#881337',
        primary: '#e11d48',
        primaryForeground: '#ffffff',
        secondary: '#fecdd3',
        muted: '#fda4af',
        accent: '#fb7185',
        border: '#fecdd3',
    },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [colorScheme, setColorSchemeState] = useState<ColorScheme>('dark');
    const [mounted, setMounted] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load theme from database when user is authenticated
    useEffect(() => {
        setMounted(true);

        const loadTheme = async () => {
            if (status === 'authenticated' && session?.user?.id && !isInitialized) {
                try {
                    const response = await fetch('/api/user/preferences');
                    if (response.ok) {
                        const data = await response.json();
                        const dbScheme = data.colorScheme as ColorScheme;
                        if (dbScheme && colorSchemes[dbScheme]) {
                            setColorSchemeState(dbScheme);
                            // Also save to localStorage for offline support
                            localStorage.setItem('colorScheme', dbScheme);
                        }
                    }
                } catch (error) {
                    console.error('Failed to load theme from database:', error);
                    // Fallback to localStorage
                    const saved = localStorage.getItem('colorScheme') as ColorScheme;
                    if (saved && colorSchemes[saved]) {
                        setColorSchemeState(saved);
                    }
                } finally {
                    setIsInitialized(true);
                }
            } else if (status === 'unauthenticated') {
                // Use localStorage for non-authenticated users
                const saved = localStorage.getItem('colorScheme') as ColorScheme;
                if (saved && colorSchemes[saved]) {
                    setColorSchemeState(saved);
                }
                setIsInitialized(true);
            }
        };

        loadTheme();
    }, [status, session?.user?.id, isInitialized]);

    // Apply theme styles
    useEffect(() => {
        if (!mounted) return;

        const scheme = colorSchemes[colorScheme];
        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--background', scheme.background);
        root.style.setProperty('--foreground', scheme.foreground);
        root.style.setProperty('--card', scheme.card);
        root.style.setProperty('--card-foreground', scheme.cardForeground);
        root.style.setProperty('--primary', scheme.primary);
        root.style.setProperty('--primary-foreground', scheme.primaryForeground);
        root.style.setProperty('--secondary', scheme.secondary);
        root.style.setProperty('--muted', scheme.muted);
        root.style.setProperty('--accent', scheme.accent);
        root.style.setProperty('--border', scheme.border);

        // Always save to localStorage for offline support
        localStorage.setItem('colorScheme', colorScheme);
    }, [colorScheme, mounted]);

    const setColorScheme = async (scheme: ColorScheme) => {
        setColorSchemeState(scheme);

        // Save to database if user is authenticated
        if (status === 'authenticated' && session?.user?.id) {
            try {
                await fetch('/api/user/preferences', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ colorScheme: scheme }),
                });
            } catch (error) {
                console.error('Failed to save theme to database:', error);
            }
        }
    };

    if (!mounted) {
        return (
            <ThemeContext.Provider value={{ colorScheme: 'dark', setColorScheme: () => { } }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
