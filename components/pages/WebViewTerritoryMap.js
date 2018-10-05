import React from 'react';
import { WebView, View } from 'react-native';

import Language from '../common/lang';
import UTILS from '../common/utils';
import getSiteSetting from '../common/settings';

export default class WebViewTerritoryMap extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate('Territory Map'),
      headerRight: (<View />), // To center on Andriod
    }
  } 
  render() {
    const html = require('../../assets/map-view-web-page.html');
    const apiKey = getSiteSetting('GAKey');
    const data = this.props.navigation.getParam('data');
    const addressesStr = `${JSON.stringify(data.addresses)}`;
    const boundariesStr = data.boundaries.toString();

    // console.log('addressesStr', addressesStr);
    // console.log('boundariesStr', boundariesStr);

    const jsScript2 = 'MapFn.initScript("https://maps.googleapis.com/maps/api/js?key=' 
      + apiKey + '&libraries=drawing,geometry&callback=MapFn.initGA", function(){MapFn.initializeMap(' 
      + addressesStr + ', ' + boundariesStr 
      + ')})';

    return (
      <WebView
        source={html}
        geolocationEnabled={true}
        javaScriptEnabled={true}
        injectedJavaScript={jsScript2}
        onError={() => console.log('onError')}
        onLoadEnd={() => {
          console.log('onLoadEnd');
        }}
        onLoadStart={() => console.log('onLoadStart')}
        onLoad={() => console.log('onLoad')}
        // onMessage={(event) => console.log('onMessage', event.nativeEvent.data)}  
      />
    );
  }

}