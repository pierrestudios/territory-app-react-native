import siteSettings from './settings';
import UTILS from './utils';

// let instance = null;
class Language {
	/*
	constructor() {
		if (!instance) {
			instance = this;
		}
		UTILS.waitForIt(() => !!siteSettings(), () => {
			this.lang = siteSettings('lang');
			this.settings = siteSettings();
		})
	}
	*/
	
	static translate = (key, defaultStr = '') => {
		this.lang = siteSettings('lang');
		this.settings = siteSettings();

		if (!this.settings || !this.settings['langPacks']) 
			return defaultStr || key;

		return this.settings['langPacks'][this.lang] && this.settings['langPacks'][this.lang][key] || this.settings['langPacks'][this.lang][UTILS.upperCaseFirst(key)] || defaultStr || key;
	}
}

export default Language;