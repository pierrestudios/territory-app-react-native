import React from 'react';
import {
  createStackNavigator,
} from 'react-navigation';

import Logo from './components/elements/Logo';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Users from './components/pages/Users';
import Territories from './components/pages/Territories';
import MyTerritories from './components/pages/MyTerritories';

import {colors} from './components/styles/main';

const App = createStackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  Users: { screen: Users },
  "Territories-all": { screen: Territories },
  Territories: { screen: MyTerritories }
},
{
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: {
      backgroundColor: colors['territory-blue'],
    },
    headerTitle: <Logo />
  },
})

export default App;
