/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#90856b',
          100: '#786e57',
          200: '#71717a',
          300: '#9ca3af'
        },
        secondary: '#9ca3af',
        tertiary: '#383c48',
        background: {
          DEFAULT: '#1c1c1c',
          100: '#18181be6',
          secondary: '#252830',
          tertiary: '#363b46'
        },
        gradient: {
          100: 'rgba(17, 17, 17, 0.5)',
          200: 'rgba(17, 17, 17, 0.9)'
        },
        healthBar: {
          primary: '#1c4d2a',
          secondary: '#3aa35c'
        },
        tempHealthBar: {
          primary: '#283c5f',
          secondary: '#6292e8'
        }
      },
      fontFamily: {
        'roboto-regular': ['RobotoSlab-Regular', 'sans-serif'],
        'roboto-bold': ['RobotoSlab-Bold', 'sans-serif'],
      }
    },
  },
  plugins: [],
}