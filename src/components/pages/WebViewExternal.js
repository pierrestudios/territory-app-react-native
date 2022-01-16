import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

import UTILS from "../../common/utils";

export default class WebViewExternal extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam("title");
    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: title || "Web View",
      headerRight: () => <View />,
    };
  };
  render() {
    const uri = this.props.navigation.getParam("url");
    return <WebView source={{ uri }} />;
  }
}
