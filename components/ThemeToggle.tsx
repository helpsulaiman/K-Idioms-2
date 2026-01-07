import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
        if (stored) {
            setTheme(stored);
        } else {
            setTheme('system');
        }
        applyTheme(stored || 'system');
    }, []);

    const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
        const root = window.document.documentElement;

        if (newTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.remove('light', 'dark');
            root.classList.add(systemTheme);
            localStorage.removeItem('theme'); // Clean storage
        } else {
            root.classList.remove('light', 'dark');
            root.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        }
    };

    const cycleTheme = () => {
        const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
        setTheme(next);
        applyTheme(next);
    };

    if (!mounted) return null;

    return (
        <button
            onClick={cycleTheme}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-[var(--foreground)] border border-[var(--border)] transition-all flex items-center justify-center pointer-events-auto backdrop-blur-md shadow-sm"
            title={`Current theme: ${theme}`}
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <Sun className="w-6 h-6 text-yellow-500" />
            ) : theme === 'dark' ? (
                <Moon className="w-6 h-6 text-blue-400" />
            ) : (
                <Monitor className="w-6 h-6 text-gray-400" />
            )}
        </button>
    );
}
