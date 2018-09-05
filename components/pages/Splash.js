import React from 'react';
import { View, Image } from 'react-native';

import NavigationService from '../common/nav-service';
// import Data from '../common/data';
// import UTILS from '../common/utils';
import styles, {colors} from '../styles/main';

export default class Splash extends React.Component {
  static navigationOptions = ({navigation}) => {
		return {
      header: null,
			headerTitle: null, // <Logo />,
		}
  }
  componentWillMount() {
    NavigationService.setNavigator(this.props.navigation);
  }
  render() {
		return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../../assets/app-icon.png')}
        />
      </View> 
    )
  }
}