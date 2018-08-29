import React from 'react';
import { WebView, View } from 'react-native';

import Language from '../common/lang';
import UTILS from '../common/utils';
import getSiteSetting from '../common/settings';

export default class TerritoryMapWebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate('Territory Map'),
      headerRight: (<View />), // To center on Andriod
    }
  } 
  render() {
    const html = require('../../assets/map-view-web-page.html');
    const apiKey = getSiteSetting('GOOGLE_API_KEY');
    const data = this.props.navigation.getParam('data');
    const addressesStr = `${JSON.stringify(data.addresses)}`;
    const boundariesStr = data.boundaries.toString();

    // console.log('addressesStr', addressesStr);
    // console.log('boundariesStr', boundariesStr);

    const jsScript = `MapFn.init('${apiKey}'); MapFn.initializeMap(${addressesStr}, ${boundariesStr});`;

    // console.log('jsScript', jsScript);
    
    return (
      <WebView
        source={html}
        geolocationEnabled={true}
        // injectJavaScript={() => alert(1)}
        injectedJavaScript={jsScript}
        onError={() => console.log('onError')}
        onLoadEnd={() => console.log('onLoadEnd')}
        onLoadStart={() => console.log('onLoadStart')}
        onLoad={() => console.log('onLoad')}
      />
    );
  }

}