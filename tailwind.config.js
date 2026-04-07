/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // All colours are CSS variables — light/dark handled in globals.css
        'th-bg':         'var(--th-bg)',
        'th-surface':    'var(--th-surface)',
        'th-surface-2':  'var(--th-surface-2)',
        'th-border':     'var(--th-border)',
        'th-border-soft':'var(--th-border-soft)',
        'th-1':          'var(--th-text-1)',
        'th-2':          'var(--th-text-2)',
        'th-3':          'var(--th-text-3)',
        'th-4':          'var(--th-text-4)',
        'th-accent':     'var(--th-accent)',
        'th-accent-2':   'var(--th-accent-2)',
        'th-accent-lt':  'var(--th-accent-lt)',
        'th-accent-md':  'var(--th-accent-md)',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { DEFAULT: '0.5rem' },
    },
  },
  plugins: [],
}
