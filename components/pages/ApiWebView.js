import React from 'react';
import { WebView, View } from 'react-native';

import UTILS from '../common/utils';
import getSiteSetting from '../common/settings';

export default class ApiWebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {title} = navigation.getParam('data'); 
    return {
      ...UTILS.headerNavOptionsDefault,
      title: title || 'Web View',
      headerRight: (<View />), // To center on Andriod
    }
  }
  render() {
    const API_DOMAIN = getSiteSetting('apiUrl');
    const uri = UTILS.addSlashToUrl(API_DOMAIN) + this.props.navigation.getParam('url');
    console.log('uri', uri);
    return (
      <WebView
        source={{uri}}
        style={{marginTop: 20}}
      />
    );
  }
}