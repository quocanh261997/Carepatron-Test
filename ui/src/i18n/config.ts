import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/translation.json';
import vi from './vi/translation.json';

i18next.use(initReactI18next).init({
	lng: 'en',
	debug: true,
	resources: {
		en: {
			translation: en,
		},
		vi: {
			translation: vi,
		},
	},
});

export default i18next;
