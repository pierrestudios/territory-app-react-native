import React from "react";
import { View } from "react-native";
import Territories from "../pages/Territories";
import Language from "../../common/lang";
import UTILS from "../../common/utils";

export default class MyTerritories extends Territories {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerRight: <View />, // To center on Andriod
      title: Language.translate("My Territories"),
    };
  };
  allTerritories = false;
}
