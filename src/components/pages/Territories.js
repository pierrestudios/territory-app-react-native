import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";

import Data from "../../common/data";
import Language from "../../common/lang";
import UTILS from "../../common/utils";
import NavigationService from "../../common/nav-service";

import Heading from "../elements/Heading";
import Loading from "../elements/Loading";

import styles from "../../styles/main";

export default class Territories extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerRight: () => <View />, // To center on Andriod
      headerTitle: Language.translate("All Territories"),
    };
  };
  loadingTerritories = false;
  allTerritories = true;
  componentDidMount() {
    if (!Data.user) return;

    this.loadTerritories();
  }
  loadTerritories() {
    this.loadingTerritories = true;
    const filter = !!this.allTerritories ? null : { userId: Data.user.userId };

    Data.getApiData(
      `territories${filter ? "/filter" : ""}`,
      filter,
      filter ? "POST" : ""
    )
      .then((data) => {
        this.loadingTerritories = false;
        this.setState({ territories: data });
      })
      .catch(UTILS.logError);
  }
  getListings(data = []) {
    return (
      <FlatList
        contentContainerStyle={styles.listings}
        data={data.sort(UTILS.sortTerritory)}
        keyExtractor={(item) => item.territoryId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles["listings-item"]}
            onPress={() => this.viewDetails(item)}
          >
            <View style={styles["listings-number"]}>
              <Text style={styles["listings-number-text"]}>{item.number}</Text>
            </View>
            <View style={styles["listings-name"]}>
              <Text style={styles["listings-name-text"]}>
                {item.publisher
                  ? item.publisher.firstName + " " + item.publisher.lastName
                  : ""}
              </Text>
            </View>
            <View style={styles["listings-date"]}>
              <Text style={styles["listings-date-text"]}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }
  viewDetails(data) {
    NavigationService.navigate("TerritoryDetails", {
      territoryId: data.territoryId,
      allTerritories: this.allTerritories,
    });
  }
  render() {
    const { state, props } = this;

    // if "id", Load Territory Details
    if (!!props.id && !this.loadingTerritories) {
      // return (<Territory {...props} />);
    }

    if (!state.territories) return <Loading />;

    const listings = state.territories.length ? (
      this.getListings(state.territories)
    ) : (
      <Heading>{Language.translate("You have no territories")}</Heading>
    );

    return <View style={[styles.section, styles.content]}>{listings}</View>;
  }
}
