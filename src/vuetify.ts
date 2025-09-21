import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const profcomffLight = {
	dark: false,
	colors: {
		primary: 'rgba(71, 28, 120)',
		'on-primary': 'rgb(255, 255, 255)',

		secondary: 'rgb(255, 139, 0)',
		'on-secondary': 'rgb(255, 255, 255)',

		background: 'rgb(255, 255, 255)',
		'on-background': 'rgb(0, 0, 0)',

		surface: 'rgb(255, 255, 255)',
		'on-surface': 'rgb(0, 0, 0, 0.87)',

		'surface-variant': 'rgb(255, 255, 255)',
		'on-surface-variant': 'rgba(0, 0, 0, 0.87)',
	},
};

export const vuetify = createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	defaults: {
		VBtnToggle: {
			color: 'rgba(71, 28, 120)',
			elevation: 1,
		},
		VCheckbox: {
			color: 'rgba(71, 28, 120)',
		},
	},
	theme: {
		defaultTheme: 'profcomffLight',
		themes: {
			profcomffLight,
		},
	},
});
