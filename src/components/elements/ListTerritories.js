import React from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";

import styles, { colors } from "../../styles/main";

import UTILS from "../../common/utils";
import Data from "../../common/data";
import Language from "../../common/lang";
import NavigationService from "../../common/nav-service";

import { ButtonHeader, ButtonLink, Button } from "../elements/Button";
import Heading from "../elements/Heading";
import Message from "../elements/Message";
import Modal from "../elements/Modal";

class UnassignModal extends React.Component {
  state = {
    data: null,
    errors: {
      message: ""
    },
    showModal: false,
    selectedTerritory: null
  };
  componentWillMount() {
    const data = this.props.data;
    this.setState({ data });
  }
  componentWillReceiveProps(props) {
    const data = props.data;
    this.setState({ data });
  }
  unassignTerritory = data => {
    this.setState({ selectedTerritory: data, showModal: true });
  };
  unassignTerritoryConfirmed = () => {
    const selTerritoryId = this.state.selectedTerritory.territoryId;
    const postData = { publisherId: null, date: UTILS.getToday() };

    Data.postApiData(`territories/${selTerritoryId}`, postData)
      .then(res => {
        if (!res) {
          this.setState({
            errors: {
              ...this.state.errors,
              message: "An error occured: " + e
            }
          });
        } else {
          const newData = {
            ...this.state.data,
            territories: this.state.data.territories.filter(
              t => t.territoryId !== selTerritoryId
            )
          };
          this.setState(
            {
              errors: {
                message: ""
              },
              data: newData
            },
            () => {
              if (
                typeof this.props.updatePublisherAfterRemoveTerritory ===
                "function"
              ) {
                this.props.updatePublisherAfterRemoveTerritory(
                  newData,
                  selTerritoryId
                );
              }
            }
          );
        }
      })
      .catch(e => {
        this.setState({
          errors: {
            ...this.state.errors,
            message: "An error occured: " + e
          }
        });
      });
    this.setState({ selectedTerritory: null, showModal: false });
  };
  viewDetails = data => {
    NavigationService.navigate("TerritoryDetails", {
      territoryId: data.territoryId,
      allTerritories: false
    });
  };
  render() {
    const data = this.state.data;

    if (!!this.state.showModal) {
      return (
        <Modal
          visible={!!this.state.showModal}
          onCloseModal={() => {
            this.setState({ showModal: false });
          }}
          customButtons={[
            {
              label: Language.translate("Continue"),
              onPress: () => this.unassignTerritoryConfirmed(),
              buttonStyle: { backgroundColor: colors.red },
              textStyle: { color: colors.white }
            },
            {
              label: Language.translate("Cancel"),
              onPress: () => this.setState({ showModal: false })
            }
          ]}
        >
          <View style={{ padding: 10 }}>
            <Heading
              textStyle={{
                marginBottom: 0,
                marginTop: 0,
                borderWidth: 0,
                borderColor: colors.red
              }}
            >
              {Language.translate("Unassign Territory")}
            </Heading>
            <View>
              <Message
                error={this.state.errors.message}
                message={this.state.data.message}
              />

              <Text
                style={{
                  flexWrap: "wrap",
                  fontSize: 18,
                  margin: 10,
                  padding: 10,
                  color: colors["territory-blue"],
                  backgroundColor: colors.white
                }}
              >
                {Language.translate("Unassign_Territory_Sure")}
              </Text>

              <Text
                style={{
                  flexWrap: "wrap",
                  fontWeight: "800",
                  fontSize: 18,
                  margin: 10,
                  padding: 10,
                  color: colors["territory-blue"],
                  backgroundColor: colors.white
                }}
              >
                # {this.state.selectedTerritory.number} -{" "}
                {this.state.selectedTerritory.date}
              </Text>
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <View>
        <Heading
          textStyle={{
            marginTop: 0,
            paddingTop: 0,
            borderColor: "red",
            borderWidth: 0
          }}
        >
          {Language.translate("Assigned Territories")}
        </Heading>
        <FlatList
          contentContainerStyle={styles.listings}
          data={data.territories.sort(UTILS.sortTerritory)}
          extraData={this.state}
          keyExtractor={item => item.territoryId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles["listings-item"]}
              onPress={() => this.viewDetails(item)}
            >
              <View style={styles["listings-number"]}>
                <Text style={styles["listings-number-text"]}>
                  {item.number}
                </Text>
              </View>
              <View style={[styles["listings-date"], { left: 60 }]}>
                <Text
                  style={[
                    styles["listings-date-text"],
                    UTILS.getDateStatusColor(item.date)
                  ]}
                >
                  {item.date}
                </Text>
              </View>
              <View style={styles["listings-delete"]}>
                <ButtonLink
                  onPress={() => this.unassignTerritory(item)}
                  customStyle={[
                    styles["heading-button-link"],
                    {
                      borderColor: colors["grey-lite"],
                      borderWidth: 1,
                      backgroundColor: colors.white
                    }
                  ]}
                  textStyle={[
                    styles["heading-button-link-text"],
                    { color: colors.red }
                  ]}
                >
                  {Language.translate("Unassign Territory")}
                </ButtonLink>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export default ListTerritories = props => {
  return <UnassignModal {...props}>{props.children}</UnassignModal>;
};
