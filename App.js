import React from 'react';
import {
  createStackNavigator,
} from 'react-navigation';

import Logo from './components/elements/Logo';
import Splash from './components/pages/Splash';
import UserPrefs from './components/pages/UserPrefs';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Users from './components/pages/Users';
import Territories from './components/pages/Territories';
import MyTerritories from './components/pages/MyTerritories';
import TerritoryDetails from './components/pages/TerritoryDetails';
import AddressEdit from './components/pages/AddressEdit';
import AddressAdd from './components/pages/AddressAdd';
import Notes from './components/pages/Notes';
import ApiWebView from './components/pages/ApiWebView';
import TerritoryMapWebView from './components/pages/TerritoryMapWebView';

import {colors} from './components/styles/main';

const App = createStackNavigator({
  Splash: { screen: Splash },
  UserPrefs: { screen: UserPrefs },
  Login: { screen: Login },
  Home: { screen: Home },
  Users: { screen: Users },
  TerritoriesAll: { screen: Territories },
  Territories: { screen: MyTerritories },
  TerritoryDetails: { screen: TerritoryDetails },
  AddressEdit: { screen: AddressEdit },
  AddressAdd: { screen: AddressAdd },
  Notes: { screen: Notes },
  ApiWebView: { screen: ApiWebView },
  TerritoryMapWebView: { screen: TerritoryMapWebView}
},
{
  initialRouteName: 'Splash',
  navigationOptions: {
    headerStyle: {
      backgroundColor: colors['territory-blue'],
    },
    headerTitle: <Logo />
  },
})

export default App;
