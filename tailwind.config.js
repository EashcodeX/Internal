/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./prasana/index.html",
    "./prasana/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#46648E', // Muted blue
          dark: '#375073', // Darker shade for hover/active
          light: '#6C8CB5', // Lighter shade if needed
        },
        accent: {
          DEFAULT: '#B8A07E', // Muted gold
          dark: '#A18B6C', // Darker shade for hover/active
          light: '#D4C09E', // Lighter shade if needed
        },
        neutral: {
          50: '#FAFAFA', // Very light grey, good for subtle backgrounds
          100: '#F5F5F5', // Lighter grey
          200: '#E5E5E5', // Light grey for borders
          300: '#D4D4D4', // Medium light grey
          400: '#A3A3A3', // Medium grey
          500: '#737373', // Dark grey
          600: '#525252', // Darker grey for text
          700: '#404040', // Even darker grey for headings
          800: '#262626', // Very dark grey
          900: '#171717', // Almost black
        },
        success: {
          DEFAULT: '#4CAF50', // Green
          light: '#81C784',
          dark: '#388E3C',
        },
        danger: {
          DEFAULT: '#F44336', // Red
          light: '#E57373',
          dark: '#D32F2F',
        },
        warning: {
          DEFAULT: '#FFC107', // Amber
          light: '#FFD54F',
          dark: '#FFB300',
        },
        info: {
          DEFAULT: '#2196F3', // Blue
          light: '#64B5F6',
          dark: '#1976D2',
        },
        // Keeping previous custom colors for now, we can replace their usage later
        'background-light': '#F8F8F8', // Very light grey
        'text-default': '#333333', // Dark grey for text
      },
    },
  },
  plugins: [],
} 