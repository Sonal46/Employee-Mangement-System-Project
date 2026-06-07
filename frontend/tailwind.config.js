/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#172033",
        mint: "#0f766e",
        coral: "#e75f4f",
        amber: "#f59e0b",
      },
    },
  },
  plugins: [],
};
