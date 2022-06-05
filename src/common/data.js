import AsyncStorage from "@react-native-async-storage/async-storage";

import Api from "./api";
import UTILS from "./utils";
import reLogin from "./reLogin";

let instance = null;

class Data {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this._territories = null; // Note: holds loaded territories by title
    this._territoriesList = null; // Note: holds the list of territories
    this.loadSavedUser().catch(UTILS.logError);

    return instance;
  }
  get user() {
    const user = this._user;

    if (!user || !user.userId) return null;

    user.isAdmin = user.userType === "Admin";
    user.isManager = user.isAdmin || user.userType === "Manager";
    user.isEditor = user.isManager || user.userType === "Editor";
    user.isNoteEditor = user.isEditor || user.userType === "NoteEditor";
    return user;
  }
  get unAuthUser() {
    return this._user;
  }
  loadSavedUser = async () => {
    return this.getSavedUser().then((user) => {
      if ((!user || !user.userId || !user.token) && !!user && !!user.apiUrl) {
        reLogin();
      }
      this._user = user;
      return user;
    });
  };
  getSavedUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        this._user = JSON.parse(user);
        return this._user;
      }
    } catch (error) {
      UTILS.logError(error);
    }
  };
  saveUser = async (user = {}) => {
    try {
      const newUser = {
        userType: user.userType,
        userId: user.userId,
        email: user.email,
        token: user.token,

        // Preferences may be null in new data, use old data
        apiUrl: user.apiUrl || this._user.apiUrl,
        lang: user.lang || this._user.lang,
      };
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      // console.log('newUser', newUser);
      this._user = newUser;
    } catch (error) {
      UTILS.logError(error);
    }
  };
  getApiData(url, data, type) {
    if (!this.user) return Promise.reject("User is not logged in");

    return Api(url, data, type, { Authorization: "Bearer " + this.user.token })
      .then((apiData) => {
        if (!!apiData.refreshedToken && !!this.user && !!this.user.token) {
          console.log("refreshedToken", apiData.refreshedToken);
          this.saveUser({ ...this._user, token: apiData.refreshedToken });

          // Need to wait for "saveUser" to complete before switching screen
          return new Promise((resolve) => {
            UTILS.waitForIt(
              () =>
                !!this.user &&
                !!this.user.token &&
                this.user.token === apiData.refreshedToken,
              () => {
                resolve(
                  Api(url, data, type, {
                    Authorization: "Bearer " + this.user.token,
                  })
                );
              }
            );
          }).then((newPromise) => newPromise);
        }

        return apiData;
      })
      .catch((e) => {
        console.log("getApiData > catch() Error:", e);

        // Unauthorized
        if (
          typeof e === "string" &&
          (e.match("Unauthorized") || e.match("Token has expired"))
        ) {
          return reLogin();
        }

        // Note: Do not display DB errors
        if (typeof e === "string" && e.match("SQLSTATE")) {
          return Promise.reject("Error: Operation Failed");
        }

        if (e.toString().match("Network request failed")) {
          return reLogin();
        }

        return Promise.reject(e);
      });
  }
  postApiData(url, data) {
    return this.getApiData(url, data, "POST");
  }
  saveTerritoryData(id, data) {
    this._territories = this._territories || [];
    this._territories[id] = data;
  }
  getTerritoryData(id) {
    return this._territories && this._territories[id];
  }
  saveTerritories(data) {
    this._territoriesList = data;
  }
  getTerritories() {
    return this._territoriesList;
  }
}

export default new Data();
