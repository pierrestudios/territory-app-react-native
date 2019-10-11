import React from "react";
import { Text, View } from "react-native";

import Language from "../../common/lang";
import UTILS from "../../common/utils";
import NavigationService from "../../common/nav-service";

import Line from "../elements/Line";
import Heading from "../elements/Heading";
import { ButtonLink } from "../elements/Button";
import ListTerritories from "../elements/ListTerritories";

import styles, { colors } from "../../styles/main";

export default class PublisherDetails extends React.Component {
  static navigationOptions = {
    ...UTILS.headerNavOptionsDefault,
    headerRight: <View />, // To center on Andriod
    title: Language.translate("Publisher Details")
  };
  componentWillMount() {
    const { navigation } = this.props;
    const data = navigation.getParam("data");
    const availableTerritories = navigation.getParam("availableTerritories");
    if (!!data) {
      this.setState({ data, availableTerritories });
    }
  }
  editPublisher = data => {
    NavigationService.navigate("PublisherEdit", {
      data,
      updatePublisher: (newPublisher, availableTerritories) => {
        if (
          typeof this.props.navigation.getParam("updatePublisher") ===
          "function"
        ) {
          this.props.navigation.getParam("updatePublisher")(
            newPublisher,
            availableTerritories
          );
        }
        this.setState({ data: newPublisher });
      }
    });
  };
  assignTerritory(data) {
    NavigationService.navigate("PublisherAssignTerritory", {
      data,
      availableTerritories: this.state.availableTerritories,
      updatePublisher: (newPublisher, availableTerritories) => {
        this.updatePublisher(newPublisher, availableTerritories);
      }
    });
  }
  updatePublisher = (data, availableTerritories = null) => {
    this.setState(
      {
        data,
        availableTerritories:
          availableTerritories || this.state.availableTerritories
      },
      () => {
        if (
          typeof this.props.navigation.getParam("updatePublisher") ===
          "function"
        ) {
          this.props.navigation.getParam("updatePublisher")(
            data,
            availableTerritories
          );
        }
      }
    );
  };
  updatePublisherAfterRemoveTerritory = (data, territoryId = null) => {
    const availableTerritories = this.state.availableTerritories.slice();
    const territory = this.state.data.territories.find(
      t => t.territoryId === territoryId
    );
    // console.log('territory', territory);

    if (!!territory) {
      availableTerritories.push(territory);
    }

    this.setState({ data, availableTerritories }, () => {
      if (
        typeof this.props.navigation.getParam("updatePublisher") === "function"
      ) {
        this.props.navigation.getParam("updatePublisher")(
          data,
          availableTerritories
        );
      }
    });
  };
  render() {
    const state = this.state || {};
    const props = this.props || {};
    // console.log('Territories:render:props', props)
    // console.log('Territories:render:state', state)

    const listings =
      state.data.territories && state.data.territories.length ? (
        <ListTerritories
          data={state.data}
          updatePublisherAfterRemoveTerritory={
            this.updatePublisherAfterRemoveTerritory
          }
        />
      ) : (
        <Heading>{Language.translate("Publisher has no territories")}</Heading>
      );

    return (
      <View style={[styles.section, styles.content]}>
        <View style={[styles["territory-heading"]]}>
          <Text
            style={[styles["heading-name"], styles["heading-publisher-name"]]}
          >
            {state.data.firstName} {state.data.lastName}
          </Text>
        </View>
        <View
          style={[
            styles["territory-heading"],
            {
              flexDirection: "row",
              height: 40,
              paddingTop: 5,
              borderColor: colors.red,
              borderWidth: 0
            }
          ]}
        >
          <ButtonLink
            onPress={() => this.editPublisher(state.data)}
            customStyle={[
              styles["heading-button-link"],
              { marginRight: 10, backgroundColor: colors["territory-blue"] }
            ]}
            textStyle={styles["heading-button-link-text"]}
            textColorWhite
          >
            {Language.translate("Edit")}
          </ButtonLink>
          <ButtonLink
            onPress={() => this.assignTerritory(state.data)}
            customStyle={[
              styles["heading-button-link"],
              { backgroundColor: colors.green }
            ]}
            textStyle={styles["heading-button-link-text"]}
            textColorWhite
          >
            {Language.translate("Assign Territory")}
          </ButtonLink>
        </View>

        <Line />

        <View
          style={[
            styles.section,
            styles["listings-results"],
            styles["listings-results-address"]
          ]}
        >
          {listings}
        </View>
      </View>
    );
  }
}
