import React from "react";
import { Text, View, FlatList, TouchableOpacity, Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import Data from "../../common/data";
import Language from "../../common/lang";
import UTILS from "../../common/utils";
import NavigationService from "../../common/nav-service";

import Loading from "../elements/Loading";
import { ButtonHeader } from "../elements/Button";
import Notice from "../elements/PopupNotice";

import styles, { colors } from "../../styles/main";

export default class Publishers extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerRight: () => (
        <ButtonHeader
          onPress={() => {
            navigation.setParams({ openPublisherAdd: true });
          }}
          title={<Feather name="plus" size={24} color="#fff" />}
          color="#fff"
        />
      ),
      headerTitle: Language.translate("All Publishers"),
    };
  };
  state = {
    publishers: null,
  };
  componentDidMount() {
    if (!Data.user) return;

    Data.getApiData("publishers")
      .then((publishers) => {
        this.setState({ publishers }, () => {
          publishers &&
            Data.getApiData("available-territories").then((territories) => {
              this.setState({
                availableTerritories: territories.sort(UTILS.sortTerritory),
              });
            });
        });
      })
      .catch(UTILS.logError);
  }
  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;

    if (!!navigation.getParam("openPublisherAdd")) {
      navigation.navigate("PublisherAdd", {
        addPublisher: this.addPublisher,
      });
      navigation.setParams({ openPublisherAdd: false });
    }
  }
  render() {
    const { state, props } = this;
    // console.log('render:props', props)
    // console.log('state', state)

    if (!state.publishers) return <Loading />;

    const listings = state.publishers.length ? (
      this.getListings(state.publishers, this, "Publishers")
    ) : (
      <Text>{Language.translate("There are no publishers")}</Text>
    );

    return (
      <View style={[styles.section, styles.content]}>
        <View style={[styles.section, styles["listings-results"]]}>
          {listings}
        </View>
        <Notice
          data={state.noticeMessage}
          closeNotice={() => this.setState({ noticeMessage: null })}
        />
      </View>
    );
  }
  getListings(data = [], caller, callerName) {
    return (
      <FlatList
        contentContainerStyle={styles.listings}
        extraData={this.state}
        data={data.sort(UTILS.sortPublisher)}
        keyExtractor={(item) => item.publisherId.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles["listings-item"],
              { minHeight: Platform.OS === "web" ? 70 : 50 },
            ]}
            nativeID="publisher-listings-item-flatList"
          >
            <TouchableOpacity
              style={[
                styles["listings-name"],
                styles["publisher-listings-name"],
              ]}
              onPress={() => this.viewDetails(item)}
              nativeID="publisher-listings-name-flatList"
            >
              <Text numberOfLines={1} style={[styles["listings-name-text"]]}>
                {UTILS.formatDiacritics(item.firstName)}{" "}
                {UTILS.formatDiacritics(item.lastName)}
              </Text>
            </TouchableOpacity>
            <View
              style={[
                styles["listings-right-arrow"],
                { right: Platform.OS === "web" ? 25 : 5 },
              ]}
            >
              <Ionicons
                name="ios-arrow-forward"
                size={24}
                color={colors["grey-lite"]}
              />
            </View>
          </View>
        )}
      />
    );
  }
  editPublisher(data) {
    NavigationService.navigate("PublisherEdit", {
      data,
      updatePublisher: this.updatePublisher,
    });
  }
  deletePublisherModal(data = [], caller, callerName) {
    const messageBlock = (
      <div>
        <p>{Language.translate("sure_want_remove_publisher")}</p>
        <p>
          <strong>
            {data.firstName} {data.lastName}
          </strong>{" "}
        </p>
      </div>
    );

    caller.setState({
      noticeMessage: {
        title: Language.translate("Remove Publisher"),
        description: messageBlock,
        actions: [
          {
            label: Language.translate("Cancel"),
            action: () => caller.setState({ noticeMessage: null }),
          },
          {
            label: Language.translate("Continue"),
            action: () => {
              // console.log('postData', postData);
              const publisherId = data.publisherId;

              // Delete Publisher
              Data.postApiData(`publishers/${publisherId}/delete`)
                .then((res) => {
                  // console.log('then() res', res)

                  if (!res || res.error) {
                    caller.setState({
                      noticeMessage: {
                        ...caller.state.noticeMessage,
                        errorMesage: "An error occured ",
                      },
                    });
                  } else if (callerName === "Publishers") {
                    const newData = (caller.state.publishers || []).filter(
                      (p) => p.publisherId !== data.publisherId
                    );
                    caller.setState({
                      noticeMessage: null,
                      publishers: newData,
                    });
                  } else if (callerName === "Publisher") {
                    caller.setState(
                      {
                        noticeMessage: null,
                      },
                      () => {
                        if (
                          caller.props.removePublisher &&
                          typeof caller.props.removePublisher === "function"
                        ) {
                          caller.props.removePublisher(publisherId, true);
                        }
                      }
                    );
                  }
                })
                .catch((e) => {
                  caller.setState({
                    noticeMessage: {
                      ...caller.state.noticeMessage,
                      errorMesage: "An error occured: " + e,
                    },
                  });
                });
            },
            style: { float: "right", backgroundColor: "red", color: "#fff" },
          },
        ],
      },
    });
  }
  viewDetails(data) {
    NavigationService.navigate("PublisherDetails", {
      data,
      availableTerritories: this.state.availableTerritories,
      updatePublisher: this.updatePublisher,
    });
  }
  addPublisher = (addedPublisher) => {
    const publishers = this.state.publishers || [];
    publishers.push(addedPublisher);
    this.setState({
      publishers,
    });
  };
  removePublisher = (publisherId) => {
    this.setState({
      publishers: this.state.publishers.filter(
        (p) => p.publisherId !== publisherId
      ),
    });
  };
  updatePublisher = (updatedPublisher, availableTerritories = []) => {
    this.setState({
      availableTerritories: availableTerritories.sort(UTILS.sortTerritory),
      publishers: this.state.publishers.map((p) => {
        if (p.publisherId === updatedPublisher.publisherId) {
          return updatedPublisher;
        }
        return p;
      }),
    });
  };
}
