import React from "react";
import { WebView, View, Text, Platform } from "react-native";

import UTILS from "../common/utils";
import getSiteSetting from "../common/settings";
import Language from "../common/lang";

const isAndroid = Platform.OS === "android";

export default class WebViewApi extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam("title");
    return {
      ...UTILS.headerNavOptionsDefault,
      title: title || "Web View",
      headerRight: <View /> // To center on Andriod
    };
  };
  render() {
    const API_DOMAIN = getSiteSetting("apiUrl");
    console.log("API_DOMAIN", API_DOMAIN);
    const uri =
      UTILS.addSlashToUrl(API_DOMAIN) + this.props.navigation.getParam("url");
    console.log("uri", uri);

    if (isAndroid && Platform.Version < 21) {
      return (
        <View>
          <Text>
            {Language.translate("Web View is not compatible with your device")}
          </Text>
        </View>
      );
    }

    return <WebView source={{ uri }} />;
  }
}
