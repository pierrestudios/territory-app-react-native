import React from 'react';
import { Text, View } from 'react-native';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
// import UserFn from './user-fn';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import {Link} from '../elements/Button';
// import Notice from '../elements/PopupNotice';
import Territories from '../pages/Territories';

import styles from '../styles/main';

export default class MyTerritories extends Territories {
  static navigationOptions = {
    headerTitle: null,
    title: 'My Territories',
    headerTintColor: '#fff',
  }
  allTerritories=false
}