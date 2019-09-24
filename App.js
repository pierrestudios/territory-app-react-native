import React from "react";
import { createStackNavigator } from "react-navigation";

import Logo from "./components/elements/Logo";
import Splash from "./components/pages/Splash";
import UserPrefs from "./components/pages/UserPrefs";
import PasswordRetrieve from "./components/pages/PasswordRetrieve";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Users from "./components/pages/Users";
import UserDetails from "./components/pages/UserDetails";
import UserEdit from "./components/pages/UserEdit";
import PublisherAttachUser from "./components/pages/PublisherAttachUser";
import Publishers from "./components/pages/Publishers";
import PublisherDetails from "./components/pages/PublisherDetails";
import PublisherEdit from "./components/pages/PublisherEdit";
import PublisherAdd from "./components/pages/PublisherAdd";
import PublisherAssignTerritory from "./components/pages/PublisherAssignTerritory";
import Territories from "./components/pages/Territories";
import MyTerritories from "./components/pages/MyTerritories";
import TerritoryDetails from "./components/pages/TerritoryDetails";
import AddressEdit from "./components/pages/AddressEdit";
import AddressAdd from "./components/pages/AddressAdd";
import Notes from "./components/pages/Notes";
import WebViewApi from "./components/pages/WebViewApi";
import WebViewExternal from "./components/pages/WebViewExternal";
import WebViewTerritoryMap from "./components/pages/WebViewTerritoryMap";

import { colors } from "./components/styles/main";

const App = createStackNavigator(
  {
    Splash: { screen: Splash },
    UserPrefs: { screen: UserPrefs },
    PasswordRetrieve: { screen: PasswordRetrieve },
    Signup: { screen: Signup },
    Login: { screen: Login },
    Home: { screen: Home },
    Users: { screen: Users },
    UserDetails: { screen: UserDetails },
    UserEdit: { screen: UserEdit },
    PublisherAttachUser: { screen: PublisherAttachUser },
    Publishers: { screen: Publishers },
    PublisherDetails: { screen: PublisherDetails },
    PublisherEdit: { screen: PublisherEdit },
    PublisherAdd: { screen: PublisherAdd },
    TerritoriesAll: { screen: Territories },
    Territories: { screen: MyTerritories },
    TerritoryDetails: { screen: TerritoryDetails },
    AddressEdit: { screen: AddressEdit },
    AddressAdd: { screen: AddressAdd },
    PublisherAssignTerritory: { screen: PublisherAssignTerritory },
    Notes: { screen: Notes },
    WebViewApi: { screen: WebViewApi },
    WebViewExternal: { screen: WebViewExternal },
    WebViewTerritoryMap: { screen: WebViewTerritoryMap }
  },
  {
    initialRouteName: "Splash",
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors["territory-blue"]
      },
      headerTitle: <Logo />
    }
  }
);

export default App;
