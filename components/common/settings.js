import { AsyncStorage } from "react-native"
import * as languages from '../languages/index';

// TODO: 
// store GOOGLE_API_KEY in Data.user.GAKey after login success (Api needs to provide env vars)
const GOOGLE_API_KEY = "AIzaSyDaLCZdxygUQAZB6_QxxbQouUDq-RuFzVM"; 
const DEFAULT_LANG = 'en';

let instance = null;

class UserData {
	_user=null
	_settings=null
  constructor() {
		if (!instance) {
			instance = this;
		}

		// Note: Need to load user for user settings
		this.loadSavedUser();
		
		const prefs = {
			"lang": DEFAULT_LANG
		};

		this._settings = {
			...prefs,
			languages,
			defaultLang: DEFAULT_LANG,
			langPacks: {
				[prefs.lang]: languages[prefs.lang]
			}
		}

		return instance;
  }
  get user() {
		return this._user;
	}
  loadSavedUser = async () => {
    try {
			const user = await AsyncStorage.getItem('user');
			if (user) {
				this._user = JSON.parse(user);
				// return this._user;

				const prefs = {
					"lang": this._user.lang || DEFAULT_LANG,
					"apiUrl": this._user.apiUrl,
					"apiPath": this._user.apiPath,
					"GAKey": GOOGLE_API_KEY 
				};

				this._settings = {
					...this._settings,
					...prefs,
					langPacks: {
						[prefs.lang]: languages[prefs.lang]
					}
				}

				// console.log('this._settings:loadSavedUser', {lang: this._settings.lang, apiPath: this._settings.apiPath});
					
			}
		} catch (error) {
			UTILS.logError(error);
		}
	}
	getSetting(key) {
		// console.log('getSetting:key', key);
		
		if (!!this._settings && !!key) 
			return this._settings[key]

		if (!!this._settings) 
			return this._settings;	
	}
}

export const userData = new UserData();

export default (key) => {
  return userData.getSetting(key);
}