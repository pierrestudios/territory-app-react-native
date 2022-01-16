import React from "react";
import { View, Text, Platform } from "react-native";
import { WebView } from "react-native-webview";

import UTILS from "../../common/utils";
import getSiteSetting from "../../common/settings";
import Language from "../../common/lang";

const isAndroid = Platform.OS === "android";

export default class WebViewApi extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam("title");
    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: title || "Web View",
      headerRight: <View />,
    };
  };
  render() {
    const API_DOMAIN = getSiteSetting("apiUrl");
    const uri =
      UTILS.addSlashToUrl(API_DOMAIN) + this.props.navigation.getParam("url");

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
