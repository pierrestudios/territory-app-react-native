import React from 'react';
import { Text, View } from 'react-native';

import UTILS from '../common/utils';

import styles from '../styles/main';

export default class Heading extends React.Component {
  render() {
    return (
      <View {...UTILS.getElementStyles(this.props)}><Text style={[styles.heading, styles["text-center"]]}>{this.props.children}</Text></View>
    )
  }
}