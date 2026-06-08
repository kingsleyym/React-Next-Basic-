const preset = require('@repo/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    // Include the UI package so its Tailwind classes are generated.
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
