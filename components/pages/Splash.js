import React from 'react';
import { View, Image } from 'react-native';

import Data from '../common/data';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';
import getSiteSetting from '../common/settings';

export default class Splash extends React.Component {
  static navigationOptions = ({navigation}) => {
		return {
      header: null,
			headerTitle: null, 
		}
  }
  componentWillMount() {
    NavigationService.setNavigator(this.props.navigation);
  }
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.doRedirect();
    });

    this.doRedirect();
  }
  doRedirect() {
    const state = this.state;
		// console.log('Splash:doRedirect() state', state)

    UTILS.waitForIt(() => !!getSiteSetting('defaultLang'), () => {
      const user = Data.unAuthUser;
      // console.log('user', user);

      if (!user || !user.apiUrl) {
        return NavigationService.navigate('UserPrefs')
      }
      
      if ((!user || !user.userId || !user.token) && !!user && !!user.apiPath) {
        return NavigationService.navigate('Login')
      }

      if (!!user && !!user.userId && !!user.token) {
        return NavigationService.navigate('Home')
      }
    });
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