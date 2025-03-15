module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F43F5E',
        background: '#F9FAFB',
        backgroundAlt: '#FFFFFF',
        text: '#1F2937',
        textLight: '#6B7280',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.375rem',
      }
    },
  },
  plugins: [],
} 