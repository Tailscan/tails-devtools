/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{tsx,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        7.5: "1.875rem",
      },
      fontFamily: {
        body: ["Inter var", ...defaultTheme.fontFamily.sans],
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        mono: ["Fira Code VF", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    require("tailwindcss-radix")(),
    require("@tailwindcss/forms")({ strategy: "class" }),
  ],
};
