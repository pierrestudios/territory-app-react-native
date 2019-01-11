import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import Swipeout from "react-native-swipeout";
import Ionicons from "react-native-vector-icons/Ionicons";

import Data from "../common/data";
import Language from "../common/lang";
import UTILS from "../common/utils";
import NavigationService from "../common/nav-service";

import Heading from "../elements/Heading";
import Loading from "../elements/Loading";

import styles, { colors } from "../styles/main";

export default class Users extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerRight: <View />, // To center on Andriod
      headerTitle: null,
      title: "Territory Users",
      headerTintColor: "#fff"
    };
  };
  componentWillMount() {
    if (!Data.user) return;

    Data.getApiData("users").then(users => {
      this.setState({ users }, () => {
        users &&
          Data.getApiData("publishers/filter", { userId: null }, "POST").then(
            publishers => {
              this.setState({ unattachedPublishers: publishers });
            }
          );
      });
    });
  }

  render() {
    // console.log('render:props', props)
    const state = this.state || {};
    // console.log('state', state)

    if (!state.users) return <Loading />;

    const listings = state.users.length ? (
      this.getListings(state.users)
    ) : (
      <Text>{Language.translate("There are no users")}</Text>
    );

    return (
      <View style={[styles.section, styles.content]}>
        <View style={[styles.section, styles["users-results"]]}>
          {listings}
        </View>
      </View>
    );
  }
  getListings(data = []) {
    return (
      <FlatList
        contentContainerStyle={styles.listings}
        data={data.sort(UTILS.sortUser)}
        keyExtractor={item => item.userId.toString()}
        renderItem={({ item }) => (
          <Swipeout
            key={item.userId}
            right={[
              {
                text: Language.translate("Details"),
                type: "primary",
                onPress: () => this.viewDetails(item)
              },
              {
                text: Language.translate("Edit"),
                backgroundColor: colors.green,
                onPress: () => this.editUser(item)
              },
              {
                text: Language.translate("Delete"),
                type: "delete",
                onPress: () => this.notifyDelete(item, state.user)
              } // backgroundColor: colors.red
            ]}
            autoClose={true}
            close={true}
          >
            <View style={[styles["listings-item"]]}>
              <TouchableOpacity
                style={[
                  styles["listings-name"],
                  styles["user-listings-name"],
                  { width: "95%" }
                ]}
                onPress={() => this.viewDetails(item)}
              >
                <View
                  style={[
                    styles["listings-name"],
                    { marginTop: 5, left: 5, width: "50%" }
                  ]}
                >
                  {item.publisher ? (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles["listings-name-text"],
                        { fontWeight: "bold", color: colors.black }
                      ]}
                    >
                      {item.publisher.firstName + " " + item.publisher.lastName}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles["listings-name-text"],
                        { color: colors["grey-lite"] }
                      ]}
                    >
                      {Language.translate("No Publisher")}
                    </Text>
                  )}
                </View>
                <View style={[styles["listings-email"], { marginTop: -3 }]}>
                  <Text numberOfLines={1} style={styles["listings-type-text"]}>
                    {UTILS.userTypeLabel(item.userType)}
                  </Text>
                  <Text numberOfLines={1} style={styles["listings-email-text"]}>
                    {item.email}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={[styles["listings-right-arrow"]]}>
                <Ionicons
                  name="ios-arrow-forward"
                  size={24}
                  color={colors["grey-lite"]}
                />
              </View>
            </View>
          </Swipeout>
        )}
      />
    );
  }
  viewDetails(data) {
    NavigationService.navigate("UserDetails", {
      data,
      unattachedPublishers: this.state.unattachedPublishers,
      updateUsers: this.updateUsers
    });
  }
  removeUser = userId => {
    this.setState({
      publishers: this.state.publishers.filter(p => p.userId !== userId)
    });
  };
  updateUsers = (updatedUser, unattachedPublishers = null) => {
    this.setState({
      unattachedPublishers: unattachedPublishers
        ? unattachedPublishers.sort(UTILS.sortPublisher)
        : this.state.unattachedPublishers,
      users: this.state.users.map(p => {
        if (p.userId === updatedUser.userId) {
          return updatedUser;
        }
        return p;
      })
    });
  };
}
