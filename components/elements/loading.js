import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import style from '../styles/main';

export default class Loading extends React.Component {
  render() {
    return (
      <View style={{...style.content, paddingTop: 100}}>
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    )
  }
}