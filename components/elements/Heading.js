import React from 'react';
import { Text, View } from 'react-native';

import UTILS from '../common/utils';

import styles from '../styles/main';

export default Heading = (props) => {
  return (
    <View {...UTILS.getElementStyles(props)}><Text style={[styles.heading, styles["text-center"], props.textStyle ? props.textStyle : null]}>{props.children}</Text></View>
  )
}