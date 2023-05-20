import daisyui from "daisyui";
import flatten from "lodash/flatten";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  safelist: flatten(["amber-950", "yellow-950", "orange-950", "amber-700", "yellow-700", "orange-700"].map((color)=> ["from", "to"].map((prefix) => `${prefix}-${color}`)))
}

