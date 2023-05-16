/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    daisyui: {
      themes: ["lemonade"],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}

