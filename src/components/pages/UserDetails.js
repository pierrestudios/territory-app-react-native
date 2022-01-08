import React from "react";
import { Text, View } from "react-native";

import Language from "../../common/lang";
import UTILS from "../../common/utils";
import NavigationService from "../../common/nav-service";

import { ButtonLink } from "../elements/Button";

import styles, { colors } from "../../styles/main";

export default class UserDetails extends React.Component {
  static navigationOptions = {
    ...UTILS.headerNavOptionsDefault,
    headerRight: <View />, // To center on Andriod
    title: Language.translate("User Details")
  };
  state = {
    data: {
      publisher: null
    }
  }
  componentDidMount() {
    const { navigation } = this.props;
    const data = navigation.getParam("data");
    const unattachedPublishers = navigation.getParam("unattachedPublishers");
    if (!!data) {
      this.setState({ data, unattachedPublishers });
    }
  }
  editUser = data => {
    NavigationService.navigate("UserEdit", {
      data,
      updateUser: this.updateUser
    });
  };
  attachPublisher(data) {
    NavigationService.navigate("PublisherAttachUser", {
      data,
      unattachedPublishers: this.state.unattachedPublishers,
      updateUser: (newUser, unattachedPublishers) => {
        this.updateUser(newUser, unattachedPublishers);
      }
    });
  }
  updateUser = (data, unattachedPublishers = null) => {
    this.setState(
      {
        data,
        unattachedPublishers:
          unattachedPublishers || this.state.unattachedPublishers
      },
      () => {
        if (
          typeof this.props.navigation.getParam("updateUsers") === "function"
        ) {
          this.props.navigation.getParam("updateUsers")(
            data,
            unattachedPublishers
          );
        }
      }
    );
  };
  updatePublisherAfterAttachPublisher = (data, territoryId = null) => {
    const unattachedPublishers = this.state.unattachedPublishers.slice();
    const territory = this.state.data.territories.find(
      t => t.territoryId === territoryId
    );

    if (!!territory) {
      unattachedPublishers.push(territory);
    }

    this.setState({ data, unattachedPublishers }, () => {
      if (typeof this.props.navigation.getParam("updateUser") === "function") {
        this.props.navigation.getParam("updateUser")(
          data,
          unattachedPublishers
        );
      }
    });
  };
  render() {
    const state = this.state || {};

    return (
      <View style={[styles.section, styles.content]}>
        <View style={[styles["territory-heading"], { height: 125 }]}>
          <Text
            style={[styles["heading-name"], styles["heading-publisher-name"]]}
          >
            {state.data.publisher
              ? state.data.publisher.firstName +
                " " +
                state.data.publisher.lastName
              : Language.translate("No Publisher")}
          </Text>
          <Text
            style={[
              styles["heading-name"],
              styles["heading-user-email"],
              { top: 55, fontWeight: "bold" }
            ]}
          >
            {UTILS.userTypeLabel(state.data.userType)}
          </Text>
          <Text
            style={[
              styles["heading-name"],
              styles["heading-user-email"],
              { top: 75 }
            ]}
          >
            {state.data.email}
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
            onPress={() => this.editUser(state.data)}
            customStyle={[
              styles["heading-button-link"],
              { marginRight: 10, backgroundColor: colors["territory-blue"] }
            ]}
            textStyle={styles["heading-button-link-text"]}
            textColorWhite
          >
            {Language.translate("Edit")}
          </ButtonLink>
          {state.data.publisher ? null : (
            <ButtonLink
              onPress={() => this.attachPublisher(state.data)}
              customStyle={[
                styles["heading-button-link"],
                { backgroundColor: colors.green }
              ]}
              textStyle={styles["heading-button-link-text"]}
              textColorWhite
            >
              {Language.translate("Attach Publisher")}
            </ButtonLink>
          )}
        </View>
      </View>
    );
  }
}
