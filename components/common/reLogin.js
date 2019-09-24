import { AsyncStorage } from "react-native";

import UTILS from "./utils";
import NavigationService from "./nav-service";

export default async function reLogin() {
  // Just remove token
  try {
    const _user = await AsyncStorage.getItem("user");
    const user = JSON.parse(_user) || {};
    user.token = "";
    const newUser = {
      userType: user.userType,
      userId: user.userId,
      email: user.email,
      token: user.token,

      // Preferences may be null in new data, use old data
      apiUrl: user.apiUrl || this._user.apiUrl,
      apiPath: user.apiPath || this._user.apiPath,
      lang: user.lang || this._user.langc
    };
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    // console.log("newUser", newUser);
  } catch (error) {
    UTILS.logError(error);
  }

  // Need to wait for "saveUser" to complete before switching screen
  return new Promise(resolve => {
    resolve(true);
    // console.log("NavigationService");
  }).then(() => NavigationService.navigate("Login", {}));
}
