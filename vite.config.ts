import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcssPresetEnv from 'postcss-preset-env';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
	plugins: [vue(), vuetify()],
	css: {
		postcss: {
			plugins: [
				postcssPresetEnv({
					features: {
						'nesting-rules': true,
					},
				}),
			],
		},
	},
});
