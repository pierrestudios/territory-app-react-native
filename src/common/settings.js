import AsyncStorage from "@react-native-async-storage/async-storage";

import * as languages from "../languages/index";
import keys from "../../env-keys";
import UTILS from "./utils";

// TODO:
// store GOOGLE_API_KEY in Data.user.GAKey after login success (Api needs to provide env vars)
const GOOGLE_API_KEY = keys.apiKey;
const DEFAULT_LANG = "en";

let instance = null;

class UserData {
  _user = null;
  _settings = null;
  constructor() {
    if (!instance) {
      instance = this;
    }

    // Note: Need to load user for user settings
    this.loadSavedUser();

    const prefs = {
      lang: DEFAULT_LANG,
    };

    this._settings = {
      ...prefs,
      languages,
      defaultLang: DEFAULT_LANG,
      langPacks: {
        [prefs.lang]: languages[prefs.lang],
      },
    };

    return instance;
  }
  get user() {
    return this._user;
  }
  loadSavedUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        this._user = JSON.parse(user) || {};

        const prefs = {
          lang: this._user.lang || DEFAULT_LANG,
          apiUrl: this._user.apiUrl,
          apiPath: this._user.apiPath,
          GAKey: GOOGLE_API_KEY,
        };

        this._settings = {
          ...this._settings,
          ...prefs,
          langPacks: {
            [prefs.lang]: languages[prefs.lang],
          },
        };
      }
    } catch (error) {
      UTILS.logError(error);
    }
  };
  getSetting(key) {
    if (!!this._settings && !!key) return this._settings[key];

    if (!!this._settings) return this._settings;
  }
}

export const userData = new UserData();

export default (key) => {
  return userData.getSetting(key);
};
