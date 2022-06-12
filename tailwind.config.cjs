/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  content: ["./src/**/*.{tsx,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        7.5: "1.875rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-radix")(),
    require("@tailwindcss/forms")({ strategy: "class" }),
  ],
};
