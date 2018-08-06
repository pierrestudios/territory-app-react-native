import React from 'react';
import { Text } from 'react-native';

import styles, {colors} from '../styles/main';

export default class Strong extends React.Component {
  render() {
    return (
      <Text style={styles['text-strong']}>{this.props.children}</Text>
    )
  }
}