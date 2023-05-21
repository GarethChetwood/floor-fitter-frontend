import daisyui from 'daisyui';
import flatten from 'lodash/flatten';

import { boardColors } from './src/constants';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontSize: {
				xs: ['6px', '12px']
			}
		}
	},
	plugins: [daisyui],
	safelist: flatten(
		flatten(
			boardColors.map((color) => ['500', '800'].map((shade) => [color, shade].join('-')))
		).map((colorWithTone) => ['from', 'to'].map((prefix) => [prefix, colorWithTone].join('-')))
	)
};
