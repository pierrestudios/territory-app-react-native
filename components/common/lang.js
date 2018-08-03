import siteSettings from './settings';
import UTILS from './utils';

let instance = null;
class Language {
	constructor() {
		if (!instance) {
			instance = this;
		}
		this.lang = siteSettings('lang') || 'en';
		this.settings = siteSettings();
	}
	
	translate = (key, defaultStr = '') => {
		if (!this.settings['langPacks']) 
			return defaultStr || key;

		return this.settings['langPacks'][this.lang] && this.settings['langPacks'][this.lang][key] || this.settings['langPacks'][this.lang][UTILS.upperCaseFirst(key)] || defaultStr || key;
	}
}

export default new Language();