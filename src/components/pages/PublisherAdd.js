import React from "react";
import { View } from "react-native";

import PublisherEdit from "../pages/PublisherEdit";
import { ButtonHeader } from "../elements/Button";

import Language from "../../common/lang";
import UTILS from "../../common/utils";

export default class PublisherAdd extends PublisherEdit {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerRight: <View />, // To center on Andriod
      title: Language.translate("Add Publisher"),
      headerRight: (
        <ButtonHeader
          onPress={() => {
            navigation.setParams({ savePublisher: true });
          }}
          title="Save"
          color="#fff"
        />
      ),
    };
  };
  allTerritories = false;
}
