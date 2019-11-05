import React from "react";
import { View, Text, Platform } from "react-native";
import { WebView } from "react-native-webview";

import Language from "../../common/lang";
import UTILS from "../../common/utils";
import getSiteSetting from "../../common/settings";

const isAndroid = Platform.OS === "android";

export default class WebViewTerritoryMap extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { number } = navigation.getParam("data");

    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate(`Territory ${number} Map`),
      headerRight: <View /> // To center on Andriod
    };
  };
  render() {
    // Webview not executing injectedJavaScript on Android < 4.4
    // More info: https://stackoverflow.com/questions/42517079/reactnative-webview-not-executing-injectedjavascript-on-android
    if (isAndroid && Platform.Version < 21) {
      return (
        <View>
          <Text>
            {Language.translate("Map is not compatible with your device")}
          </Text>
        </View>
      );
    }

    const html =
      isAndroid && !UTILS.isExpo()
        ? {
            uri: "file:///android_asset/map-view-web-page.html"
          }
        : require("../../assets/map-view-web-page.html");
    const apiKey = getSiteSetting("GAKey");
    const { addresses, boundaries } = this.props.navigation.getParam("data");
    const addressesStr = `${JSON.stringify(addresses)}`;
    const boundariesStr = boundaries.toString();
    const jsScript = `MapFn.initScript("https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=MapFn.initGA", 
        function(){ 
          MapFn.initializeMap(
            ${addressesStr},
            ${boundariesStr}
          );
        });`;

    return (
      <WebView
        source={html}
        originWhitelist={["*"]}
        geolocationEnabled={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        injectedJavaScript={jsScript}
        onError={e => console.log("onError")}
        // onLoadEnd={e => console.log('onLoadEnd', e)}
        // onLoadStart={e => console.log('onLoadStart', e)}
        onLoad={e => console.log("onLoad")}
        onMessage={event =>
          console.log("onMessage", { data: event.nativeEvent.data })
        }
      />
    );
  }
}
