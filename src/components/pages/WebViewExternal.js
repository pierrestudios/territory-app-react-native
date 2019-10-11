import React from "react";
import { WebView, View } from "react-native";

import UTILS from "../../common/utils";

export default class WebViewExternal extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam("title");
    return {
      ...UTILS.headerNavOptionsDefault,
      title: title || "Web View",
      headerRight: <View />
    };
  };
  render() {
    const uri = this.props.navigation.getParam("url");
    return <WebView source={{ uri }} />;
  }
}
