/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        // theme-aware: values come from CSS variables in app/globals.css
        fg: "rgb(var(--fg) / <alpha-value>)",
        brand: {
          violet: "rgb(var(--c1) / <alpha-value>)",
          pink: "rgb(var(--c2) / <alpha-value>)",
          orange: "rgb(var(--c3) / <alpha-value>)",
        },
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,-40px) scale(1.15)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        pop: {
          from: { opacity: "0", transform: "scale(0.94) translateY(14px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "spin-slow": "spin-slow 22s linear infinite",
        "spin-slower": "spin-slow 40s linear infinite reverse",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
