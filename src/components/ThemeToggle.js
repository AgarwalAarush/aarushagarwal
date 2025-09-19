import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <button
                className="p-2 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                aria-label="Toggle theme"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5.64 6.05a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.42L5.64 7.47a1 1 0 0 1 0-1.42Zm11.25 11.25a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM4.5 13a1 1 0 1 1 0-2H6a1 1 0 1 1 0 2H4.5Zm12 0a1 1 0 1 1 0-2H19.5a1 1 0 1 1 0 2H16.5ZM5.64 17.95a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 0 1-1.41 1.41L5.64 19.36a1 1 0 0 1 0-1.41Zm11.25-11.25a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.42l-1.06-1.06a1 1 0 0 1 0-1.42ZM11 18.5a1 1 0 1 1 2 0V20a1 1 0 1 1-2 0v-1.5Z" />
                </svg>
            </button>
        );
    }

    const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light' : 'Switch to dark'}
        >
            {isDark ? (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
                </svg>
            ) : (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5.64 6.05a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.42L5.64 7.47a1 1 0 0 1 0-1.42Zm11.25 11.25a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM4.5 13a1 1 0 1 1 0-2H6a1 1 0 1 1 0 2H4.5Zm12 0a1 1 0 1 1 0-2H19.5a1 1 0 1 1 0 2H16.5ZM5.64 17.95a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 0 1-1.41 1.41L5.64 19.36a1 1 0 0 1 0-1.41Zm11.25-11.25a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.42l-1.06-1.06a1 1 0 0 1 0-1.42ZM11 18.5a1 1 0 1 1 2 0V20a1 1 0 1 1-2 0v-1.5Z" />
                </svg>
            )}
        </button>
    );
}


