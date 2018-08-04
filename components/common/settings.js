import * as languages from '../languages/index';

// Site Prefs (Temp - will be stored in User Prefs)
import prefs from '../../.user-prefs';

// Site Settings
const settings = {
  ...prefs,
  sitePath: prefs.lang, // Site URI
  langPacks: {
    [prefs.lang]: languages[prefs.lang]
  }
}

export default (key) => {
  if (!!settings && !!key) 
    return settings[key];
    
  if (!!settings) 
    return settings;
}