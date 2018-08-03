import React from 'react';
import {
  createStackNavigator,
} from 'react-navigation';

import {colors} from './components/styles/main';
import Logo from './components/elements/logo';
import Home from './components/pages/home';
import Users from './components/pages/users';

const App = createStackNavigator({
  Home: { screen: Home },
  Users: { screen: Users },
  // Profile: { screen: Profile },
},
{
  initialRouteName: 'Home',
  /* Default header config */
  navigationOptions: {
    headerStyle: {
      backgroundColor: colors['territory-blue'],
    },
    // headerTintColor: '#fff',
    headerTitleStyle: {fontWeight: 'bold', },
    headerTitle: <Logo />
  },
});

export default App;