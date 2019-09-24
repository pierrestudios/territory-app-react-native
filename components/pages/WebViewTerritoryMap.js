import React from "react";
import { WebView, View, Text, Platform, ActivityIndicator } from "react-native";

import Language from "../common/lang";
import UTILS from "../common/utils";
import getSiteSetting from "../common/settings";

const isAndroid = Platform.OS === "android";

export default class WebViewTerritoryMap extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate("Territory Map"),
      headerRight: <View /> // To center on Andriod
    };
  };
  render() {
    const html =
      isAndroid && !UTILS.isExpo()
        ? {
            uri: "file:///android_asset/map-view-web-page.html"
          }
        : require("../../assets/map-view-web-page.html");

    // console.log("isAndroid", isAndroid);
    // console.log("Platform.Version", Platform.Version);
    // console.log("Platform", Platform);
    // console.log("html", html);

    // Webview not executing injectedJavaScript on Android < 4.4
    // Work-around: https://stackoverflow.com/questions/42517079/reactnative-webview-not-executing-injectedjavascript-on-android

    if (isAndroid && Platform.Version < 21) {
      return (
        <View>
          <Text>
            {Language.translate("Map is not compatible with your device")}
          </Text>
        </View>
      );
    }

    const apiKey = getSiteSetting("GAKey");
    const data = this.props.navigation.getParam("data");
    const addressesStr = `${JSON.stringify(data.addresses)}`;
    const boundariesStr = data.boundaries.toString();

    // console.log('addressesStr', addressesStr);
    // console.log('boundariesStr', boundariesStr);

    const jsScript2 =
      'MapFn.initScript("https://maps.googleapis.com/maps/api/js?key=' +
      apiKey +
      '&libraries=drawing,geometry&callback=MapFn.initGA", function(){MapFn.initializeMap(' +
      addressesStr +
      ", " +
      boundariesStr +
      ")})";

    return (
      <WebView
        source={html}
        // source={{ html: html2, baseUrl: "" }} // WORKS!!!
        // --
        // ref={el => (this.webView = el)}
        // mixedContentMode={"compatibility"}
        originWhitelist={["*"]}
        injectedJavaScript_Disabled={
          '(function(){document.querySelector("#container").style.backgroundColor = "red"; document.querySelector("#container").textContent = "Loaded again";}());'
        }
        geolocationEnabled={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        // startInLoadingState={true}
        // renderLoading={() => <ActivityIndicator />}
        // onLoadProgress={e => console.log(e.nativeEvent.progress)}
        // useWebKit={true}
        // - sep

        // Normal settings
        injectedJavaScript={jsScript2}
        onError={() => console.log("onError")}
        onLoadEnd={() => console.log("onLoadEnd")}
        onLoadStart={() => console.log("onLoadStart")}
        onLoad={() => console.log("onLoad")}
        // onMessage={event => console.log("onMessage", event.nativeEvent.data)}
      />
    );
  }
}
