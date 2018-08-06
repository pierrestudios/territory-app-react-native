import React from 'react';
import { Text, View, ScrollView } from 'react-native';
 
import UTILS from '../common/utils';
 
import style from '../styles/main';
import {colors} from '../styles/main';

// import FaAlert from 'preact-icons/lib/fa/exclamation';

export default class Message extends React.Component {
  render() {
    const props = this.props;
    return (
      props.error ?
      <View style={style.errors}>
        {/*<FaAlert size={18} />*/}
        <Text style={{color: colors.white}}>{props.error}</Text>
      </View>
      : props.message ?
      <View style={style.success}>
        {/*<FaAlert size={18} />*/}
        <Text style={{color: colors.white}}>{props.message}</Text>
      </View>
      : null
    )
  }
}
