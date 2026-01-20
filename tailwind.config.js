module.exports = {
    darkMode: 'class',
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          purple: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
        },
        fontFamily: {
          sans: ['inherit'],
          mono: ['inherit'],
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme('colors.gray.800'),
              a: {
                color: theme('colors.purple.600'),
                '&:hover': {
                  color: theme('colors.purple.700'),
                },
              },
              h1: {
                color: theme('colors.gray.900'),
              },
              h2: {
                color: theme('colors.gray.900'),
              },
              h3: {
                color: theme('colors.gray.900'),
              },
              h4: {
                color: theme('colors.gray.900'),
              },
              'code::before': {
                content: '""',
              },
              'code::after': {
                content: '""',
              },
            },
          },
        }),
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  };