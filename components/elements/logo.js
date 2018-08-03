import React from 'react';
import { Text } from 'react-native';

import styles from '../styles/main';

export default class Logo extends React.Component {
  render() {
    return (
      <Text style={[styles.title, styles["text-center"]]}>Territory App</Text>
    )
  }
}