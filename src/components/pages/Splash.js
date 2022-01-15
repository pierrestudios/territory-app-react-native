import React from "react";
import { View, Image } from "react-native";

import Data from "../../common/data";
import UTILS from "../../common/utils";
import NavigationService from "../../common/nav-service";
import getSiteSetting from "../../common/settings";

export default class Splash extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
      headerTitle: null,
    };
  };
  componentDidMount() {
    NavigationService.setNavigator(this.props.navigation);
    this.props.navigation.addListener("willFocus", () => {
      this.doRedirect();
    });

    this.doRedirect();
  }
  doRedirect() {
    UTILS.waitForIt(
      () => !!getSiteSetting("defaultLang"),
      () => {
        const user = Data.unAuthUser;

        if (!user || !user.apiUrl) {
          return NavigationService.navigate("UserPrefs");
        }

        if (
          (!user || !user.userId || !user.token) &&
          !!user &&
          !!user.apiPath
        ) {
          return NavigationService.navigate("Login");
        }

        if (!!user && !!user.userId && !!user.token) {
          return NavigationService.navigate("Home");
        }
      }
    );
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image source={require("../../assets/app-icon.png")} />
      </View>
    );
  }
}
