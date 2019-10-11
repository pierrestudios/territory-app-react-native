import React from "react";
import { createStackNavigator } from "react-navigation";

import Logo from "./src/components/elements/Logo";
import Splash from "./src/components/pages/Splash";
import UserPrefs from "./src/components/pages/UserPrefs";
import PasswordRetrieve from "./src/components/pages/PasswordRetrieve";
import Signup from "./src/components/pages/Signup";
import Login from "./src/components/pages/Login";
import Home from "./src/components/pages/Home";
import Users from "./src/components/pages/Users";
import UserDetails from "./src/components/pages/UserDetails";
import UserEdit from "./src/components/pages/UserEdit";
import PublisherAttachUser from "./src/components/pages/PublisherAttachUser";
import Publishers from "./src/components/pages/Publishers";
import PublisherDetails from "./src/components/pages/PublisherDetails";
import PublisherEdit from "./src/components/pages/PublisherEdit";
import PublisherAdd from "./src/components/pages/PublisherAdd";
import PublisherAssignTerritory from "./src/components/pages/PublisherAssignTerritory";
import Territories from "./src/components/pages/Territories";
import MyTerritories from "./src/components/pages/MyTerritories";
import TerritoryDetails from "./src/components/pages/TerritoryDetails";
import AddressEdit from "./src/components/pages/AddressEdit";
import AddressAdd from "./src/components/pages/AddressAdd";
import Notes from "./src/components/pages/Notes";
import WebViewApi from "./src/components/pages/WebViewApi";
import WebViewExternal from "./src/components/pages/WebViewExternal";
import WebViewTerritoryMap from "./src/components/pages/WebViewTerritoryMap";

import { colors } from "./src/styles/main";

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
