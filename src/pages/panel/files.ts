export type Files = Record<string, string>;

export const defaultConfig = `const colors = require('tailwindcss/colors');
    
module.exports = {
  theme: {
    extend: {
      colors: {
        trueGray: colors.trueGray
      }
    },
  },
  plugins: [],
}`;

export const defaultCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

export const files = {
  "index.css": defaultCSS,
  "tailwind.config.js": defaultConfig,
};
