export type Files = Record<string, string>;

export const defaultConfig = `module.exports = {
  theme: {
    extend: {
      // ...
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
