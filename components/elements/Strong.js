import React from 'react';
import { Text } from 'react-native';

import styles, {colors} from '../styles/main';

export default class Strong extends React.Component {
  render() {
    const props = this.props;
    props.style = props.style || [];
    props.style.push(styles['text-strong']);
    return (
      <Text {...props}>{props.children}</Text>
    )
  }
}