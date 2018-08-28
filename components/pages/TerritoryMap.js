import React from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { MapView } from "expo";

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import {Link, ButtonLink, ButtonHeader} from '../elements/Button';
import Notice from '../elements/PopupNotice';

import style, {colors} from '../styles/main';

export default class TerritoryMap extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate('Territory Map'),
      headerRight: (<View />), // To center on Andriod
    }
  }

  // Using Expo: https://medium.com/nycdev/create-a-react-native-app-with-google-map-using-expo-io-68041252023d
  // Alt - react-native-maps:https://medium.com/@mehulmistri/integrate-airbnb-google-maps-in-a-react-native-app-889f0c31a7a8
  render() {
    return (
      <MapView
        style={{
          flex: 1
        }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      />
    );
  }

}