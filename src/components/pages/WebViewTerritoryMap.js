import React from "react";
import { View, Text, Platform, Image } from "react-native";
import { WebView } from "react-native-webview";

import Language from "../../common/lang";
import UTILS from "../../common/utils";
import getSiteSetting from "../../common/settings";
import mapPage from "../../assets/map-view-web-page.html";

const isAndroid = Platform.OS === "android";

export default class WebViewTerritoryMap extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { number } = navigation.getParam("data");

    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: Language.translate(`Territory ${number} Map`),
      headerRight: () => <View />, // To center on Andriod
    };
  };

  constructor() {
    super();
    this.state = {
      mapPageContent: "",
    };
  }

  // react-native-webview issue with "android_asset"
  // Workaround using Image.resolveAssetSource fn
  componentDidMount() {
    (async () => {
      const src = Image.resolveAssetSource(mapPage);
      const mapPageContent = await fetch(src.uri).then((r) => r.text());
      this.setState({ mapPageContent });
    })();
  }
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

    const { mapPageContent } = this.state;
    const html = isAndroid // && !UTILS.isExpo()
      ? { html: mapPageContent }
      : require("../../assets/map-view-web-page.html");

    const apiKey = getSiteSetting("GAKey");
    const { addresses, boundaries } = this.props.navigation.getParam("data");
    const addressesStr = `${JSON.stringify(addresses)}`;
    const boundariesStr = boundaries.toString();
    const debugging = `
     // Debug
     console = new Object();
     console.log = function(log) {
       window.webViewBridge.send("console", log);
     };
     console.debug = console.log;
     console.info = console.log;
     console.warn = console.log;
     console.error = console.log;
     `;
    const jsScript = `
        ${debugging} 
        MapFn.initScript("https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=MapFn.initGA", 
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
        onError={(e) => console.log("onError", { apiKey })}
        // onLoadEnd={e => console.log('onLoadEnd', e)}
        // onLoadStart={e => console.log('onLoadStart', e)}
        onLoad={(e) => console.log("onLoad", { apiKey })}
        onMessage={(event) =>
          console.log("onMessage", { data: event.nativeEvent.data })
        }
      />
    );
  }
}
