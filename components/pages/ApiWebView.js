import React from 'react';
import { FlatList, WebView, Text, View } from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
import getSiteSetting from '../common/settings';
import NavigationService from '../common/nav-service';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import {Link, ButtonLink, ButtonHeader} from '../elements/Button';
import Notice from '../elements/PopupNotice';

import style, {colors} from '../styles/main';

const API_DOMAIN = getSiteSetting('apiUrl');

export default class ApiWebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // console.log('navigation', navigation);
    const {number} = navigation.getParam('data'); 
    return {
      ...UTILS.headerNavOptionsDefault,
      title: `${Language.translate('Territory')} ${number || '...'}`,
      headerRight: (<View />), // To center on Andriod
    }
  }
  render() {
    const uri = API_DOMAIN + this.props.navigation.getParam('url');
    console.log('uri', uri);
    return (
      <WebView
        source={{uri}}
        style={{marginTop: 20}}
      />
    );
  }

}