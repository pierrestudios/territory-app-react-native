import React from "react";
import { FlatList, TouchableOpacity, Text, View, Share } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swipeout from "react-native-swipeout";

import Data from "../common/data";
import Language from "../common/lang";
import UTILS from "../common/utils";
import NavigationService from "../common/nav-service";
import getSiteSetting from "../common/settings";

import Heading from "../elements/Heading";
import Loading from "../elements/Loading";
import { Link, ButtonLink, ButtonHeader } from "../elements/Button";
import Notice from "../elements/PopupNotice";
import {
  Checkbox,
  InputLabel,
  RadioBox,
  SelectBox
} from "../elements/FormInput";

import style, { colors } from "../styles/main";
import Modal from "../elements/Modal";

const languages = getSiteSetting("languages");

export default class TerritoryDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: `${Language.translate("Territory")} ${navigation.getParam(
        "territoryNumber",
        "..."
      )}`,
      headerRight:
        !!navigation.getParam("isEditor") &&
        !!navigation.getParam("streetsList") ? (
          <ButtonHeader
            onPress={() => {
              navigation.navigate("AddressAdd", {
                streetsList: navigation.getParam("streetsList"),
                territoryId: navigation.getParam("territoryId"),
                addAddress: newAddress => navigation.setParams({ newAddress })
              });
            }}
            title={<Feather name="plus" size={24} color="#fff" />}
            color="#fff"
          />
        ) : null
    };
  };

  addressList = null;
  territoryNumber = null;
  territoryId = null;
  allTerritories = false;
  state = {
    selectedAddresses: [],
    selectorOpened: false,
    addressesFilterOpened: false,
    filterType: "all"
  };

  componentWillReceiveProps(props) {
    if (props.navigation) {
      if (!!props.navigation.getParam("newAddress"))
        this.addAddress(props.navigation.getParam("newAddress"));
    }
  }
  componentWillMount() {
    this.territoryId = this.props.navigation.getParam("territoryId");
    this.allTerritories = !!this.props.navigation.getParam("allTerritories");

    if (!!this.territoryId) {
      // get details
      Data.getApiData(
        `territories${this.allTerritories ? "-all" : ""}/${this.territoryId}`
      )
        .then(data => {
          // Get "addressId" if reloading page
          const addressId = null; // parseInt(this.props.addressId || 0);
          const { user } = Data;

          // console.log('data', data);
          if (!!data && !!data.territoryId) {
            const streetsList = UTILS.getStreetsList(data.addresses);
            this.setState({
              data: data,
              user: user,
              notesSymbolsLang: user.lang,
              addressActive: !!addressId
                ? data.addresses.find(a => a.addressId === addressId)
                : null,
              streetsList: streetsList,
              noticeMessage: null,
              shouldRender: "Territory"
            });

            // Set params for Navigation Header
            this.props.navigation.setParams({
              territoryNumber: data.number,
              isEditor: user.isEditor,
              streetsList: streetsList
            });
          }
        })
        .catch(UTILS.logError);
    }
  }

  render() {
    const state = this.state || {};
    const props = this.props || {};
    // console.log('render:state', state)
    // console.log('render:props', props);

    if (!state.data) return <Loading />;

    const listings = (
      <FlatList
        contentContainerStyle={style.listings}
        data={state.data.addresses
          .filter(
            a =>
              (!a.inActive || !!state.user.isManager) &&
              (state.filterType === "all" ||
                this.matchFilterType(a, state.filterType))
          )
          .sort(UTILS.sortAddress)}
        keyExtractor={item => item.addressId.toString()}
        renderItem={({ item }) => {
          const selected =
            state.selectedAddresses.indexOf(item.addressId) !== -1;
          item.hasWarning =
            item.name.toLowerCase().indexOf("frape") !== -1 ||
            (!!item.notes &&
              !!item.notes.find(
                n => n.note.toLowerCase().indexOf("frape") !== -1
              ));
          return (
            <Swipeout
              onOpen={() => {
                // console.log("item.addressId", item.addressId);
                this.setState({ activeRow: item.addressId });
              }}
              key={item.addressId}
              right={[
                {
                  text: Language.translate("Notes"),
                  type: "primary",
                  onPress: () => this.viewNotes(item)
                },
                state.user.isEditor
                  ? {
                      text: Language.translate("Delete"),
                      type: "delete",
                      onPress: () => this.notifyDelete(item, state.user)
                    }
                  : { text: "" }
              ]}
              rowID={item.addressId}
              autoClose={true}
              close={this.state.activeRow !== item.addressId}
            >
              <View
                style={[
                  style["listings-item"],
                  item.inActive ? style["listings-item-inactive"] : null,
                  item.hasWarning ? style["listings-item-warning"] : null
                ]}
              >
                {this.state.selectorOpened ? (
                  <View style={{}}>
                    <Checkbox
                      style={{ margin: 0 }}
                      value={selected}
                      onChange={() => {
                        // console.log("Check", { selected, id: item.addressId });
                        this.selectAddressRow(item.addressId, selected);
                      }}
                    />
                  </View>
                ) : null}
                <TouchableOpacity
                  style={[style["listings-notes"]]}
                  onPress={() =>
                    state.user.isNoteEditor
                      ? this.viewNotes(item)
                      : console.log("Not Note Editor")
                  }
                >
                  {item.notes && item.notes.length
                    ? [
                        <Text
                          key="listings-date"
                          style={[
                            style["listings-date-text"],
                            style["listings-notes-date-text"],
                            item.hasWarning ? style["text-white"] : null
                          ]}
                        >
                          {item.notes[0].date}
                        </Text>,
                        <Text
                          key="listings-notes"
                          numberOfLines={1}
                          style={[
                            style["listings-notes-note-text"],
                            item.hasWarning ? style["text-white"] : null
                          ]}
                        >
                          {UTILS.diacritics(item.notes[0].note)}
                        </Text>
                      ]
                    : [
                        state.user.isNoteEditor ? (
                          <ButtonLink
                            key="listings-add-notes"
                            customStyle={[style["add-notes"]]}
                            onPress={() => this.viewNotes(item)}
                          >
                            {Language.translate("Add Notes")}
                          </ButtonLink>
                        ) : null
                      ]}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    style["listings-name"],
                    style["address-listings-name"],
                    state.selectorOpened ? { left: 50 } : null
                  ]}
                  onPress={() =>
                    state.user.isEditor
                      ? this.viewAddress(item)
                      : console.log("Not Editor")
                  }
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      style["listings-name-text"],
                      style["listings-address-name"],
                      item.hasWarning ? style["text-white"] : null
                    ]}
                  >
                    {UTILS.diacritics(item.name)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      style["listings-address"],
                      item.hasWarning ? style["text-white"] : null
                    ]}
                  >
                    {UTILS.getListingAddress(item)}
                  </Text>
                </TouchableOpacity>
                <View style={[style["listings-right-arrow"]]}>
                  <Ionicons
                    name="ios-arrow-forward"
                    size={24}
                    color={colors["grey-lite"]}
                  />
                </View>
              </View>
            </Swipeout>
          );
        }}
      />
    );

    const filterTypes = [
      { value: "all", label: Language.translate("All") },
      { value: "done", label: Language.translate("Worked") },
      { value: "not-done", label: Language.translate("Not worked") }
    ];

    return (
      <View style={[style.section, style.content]}>
        <View style={style["territory-heading"]}>
          <ButtonLink
            onPress={this.viewMap}
            customStyle={[
              style["heading-button-link"],
              style["view-map-button"]
            ]}
            textStyle={style["heading-button-link-text"]}
            textColorWhite
          >
            {Language.translate("Map")}
          </ButtonLink>
          <ButtonLink
            onPress={this.viewAddressSelector}
            customStyle={[style["heading-button-link"], style["select-button"]]}
            textStyle={style["heading-button-link-text"]}
            textColorWhite
          >
            {Language.translate("Select")}
          </ButtonLink>
          <ButtonLink
            disabled={state.selectedAddresses.length === 0}
            onPress={this.sendSelectedAddresses}
            customStyle={[style["heading-button-link"], style["send-button"]]}
            textStyle={style["heading-button-link-text"]}
            textColorWhite
          >
            {Language.translate("Send")}
          </ButtonLink>

          <ButtonLink
            onPress={this.showAddressesFilter}
            customStyle={[
              style["heading-button-link"],
              {
                borderColor: colors["grey-lite"],
                borderWidth: 1,
                backgroundColor: colors["off-white"],
                position: "absolute",
                right: 20,
                marginTop: 18,
                paddingTop: 6
              }
            ]}
            customView={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "stretch",
                  justifyContent: "center",
                  paddingLeft: 5,
                  paddingRight: 5
                }}
              >
                <MaterialIcons
                  name="filter-list"
                  size={16}
                  color={colors["grey"]}
                />
                <Text
                  style={{
                    padding: 0,
                    marginTop: -2,
                    paddingLeft: 3,
                    fontSize: 16
                  }}
                >
                  {Language.translate("Filter")}
                </Text>
              </View>
            }
          />

          {/*
          <View style={style["heading-number"]}>
            <Text style={style["listings-number-text"]}>
              {state.data.number}
            </Text>
          </View>
					*/}

          {/** Note: Issues with PDF and CSV buttons - WebViews cannot handle download of files (.pdf and .csv) **/}
          {/*
          {state.user.isManager ? [
						<ButtonLink key="pdf-button" 
							onPress={() => this.openWebViewApi(`pdf/${state.data.number}`)} 
							customStyle={[style["heading-button-link"], style['pdf-button']]} 
							textStyle={style["heading-button-link-text"]} 
							textColorWhite
							>
							{Language.translate('PDF')}
						</ButtonLink>,
						<ButtonLink key="csv-button" 
							onPress={() => this.openWebViewApi(`csv/${state.data.number}`)} 
							customStyle={[style["heading-button-link"], style['csv-button']]} 
							textStyle={style["heading-button-link-text"]} 
							textColorWhite
							>
							{Language.translate('CSV')}
						</ButtonLink>
					] : null }
					 
          {this.allTerritories && state.data.publisher ?
            <ButtonLink style={style['heading-name-link']} onPress={(e) => this.viewPublisherDetails(state.data.publisher)}>
              <Text style={style['heading-name']}>{state.data.publisher.firstName} {state.data.publisher.lastName}</Text>
            </ButtonLink>
            : null}
          */}
        </View>
        <View
          style={[
            style.section,
            style["listings-results"],
            style["listings-results-address"]
          ]}
        >
          {listings}
        </View>

        <Notice
          data={state.noticeMessage}
          closeNotice={() => this.setState({ noticeMessage: null })}
        />

        <Modal
          animationType="fade"
          visible={this.state.addressesFilterOpened}
          onCloseModal={() => {
            this.setState({ addressesFilterOpened: false });
          }}
        >
          <View style={[styles["modal-view"], {}]}>
            {/*
            <SelectBox
              name="notesSymbolsLang"
              data-name="notesSymbolsLang"
              showLabel={true}
              label={Language.translate("Selected Language")}
              options={Object.keys(languages).map(l => ({
                value: l,
                label: languages[l]["lang-name"]
              }))}
              value={
                !!state.notesSymbolsLang
                  ? {
                      value: state.notesSymbolsLang,
                      label: languages[state.notesSymbolsLang]["lang-name"]
                    }
                  : { value: "", label: "" }
              }
              onInput={this.saveNotesSymbolsLang}
            />
            */}
            <RadioBox
              name="filter"
              label={Language.translate("Filter Addresses")}
              options={filterTypes.map(f => ({
                ...f,
                active: f.value === state.filterType
              }))}
              onChange={this.saveFilterType}
            />
          </View>
        </Modal>
      </View>
    );
  }
  viewNotes(data) {
    // console.log('viewNotes', data)
    this.setState({ addressActive: data, shouldRender: "Notes" }, () => {
      this.props.entity && typeof this.props.entity.viewNotes === "function"
        ? this.props.entity.viewNotes(data)
        : NavigationService.navigate("Notes", {
            addressActive: data,
            updateAddress: this.updateAddress,
            territoryId: data.territoryId
          });
    });
  }
  viewAddress(data) {
    this.setState({ addressActive: data, shouldRender: "addressId" }, () => {
      this.props.entity && typeof this.props.entity.viewAddress === "function"
        ? this.props.entity.viewAddress(data)
        : NavigationService.navigate("AddressEdit", {
            addressActive: data,
            streetsList: this.state.streetsList,
            territoryId: data.territoryId,
            updateAddress: this.updateAddress
          });
    });
  }
  viewAddressAdd = () => {
    this.props.entity && typeof this.props.entity.viewAddressAdd === "function"
      ? this.props.entity.viewAddressAdd()
      : false;
    this.setState({ shouldRender: "Address", addressActive: null });
  };
  viewMap = () => {
    this.props.entity && typeof this.props.entity.viewMap === "function"
      ? this.props.entity.viewMap()
      : NavigationService.navigate("WebViewTerritoryMap", {
          data: this.state.data
        });
  };
  openWebViewApi = url => {
    NavigationService.navigate("WebViewApi", {
      url: url,
      data: { ...this.state.data, title: Language.translate("Territory") }
    });
  };
  selectAddressRow = (addressId, unselect = false) => {
    let selectedAddresses = this.state.selectedAddresses.slice();
    // console.log("selectedAddresses", selectedAddresses);
    if (unselect) {
      selectedAddresses = selectedAddresses.filter(a => addressId !== a);
    } else {
      selectedAddresses.push(addressId);
    }
    this.setState(
      {
        selectedAddresses
      }
      // () => console.log("setState:selectedAddresses", selectedAddresses)
    );
  };
  sendSelectedAddresses = async () => {
    const title = `${Language.translate("Territory")} ${
      this.state.data.number
    } - ${this.state.data.publisher.firstName} ${
      this.state.data.publisher.lastName
    }`;

    try {
      const result = await Share.share({
        title: title,
        dialogTitle: title,
        subject: title,
        message:
          title +
          "\n \n" +
          this.state.data.addresses
            .filter(
              a => this.state.selectedAddresses.indexOf(a.addressId) != -1
            )
            .sort(UTILS.sortAddress)
            .map(a => UTILS.getListingAddress(a))
            .join("\n")
      });

      // console.log("result", result);
      if (result.action === Share.sharedAction) {
        this.setState({ selectedAddresses: [], selectorOpened: false });
        /*
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
				}
				*/
        // } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  viewAddressSelector = () => {
    this.setState({ selectorOpened: this.state.selectorOpened === false });
  };
  showAddressesFilter = () => {
    this.setState({
      addressesFilterOpened: this.state.addressesFilterOpened === false
    });
  };
  saveFilterType = data => {
    // console.log("data", data);
    this.setState({
      filterType: data.option.value,
      addressesFilterOpened: false
    });
  };
  saveNotesSymbolsLang = selectedLang => {
    this.setState({ notesSymbolsLang: selectedLang.option.value });
  };
  matchFilterType = (address, filterType) => {
    // console.log("params", { address, filterType });

    if (!address.notes || !address.notes.length) {
      return filterType === "not-done";
    }

    const notesSymbols =
      languages[this.state.notesSymbolsLang]["NotesSymbols"] || {};
    const latestNote = address.notes[0].note;
    const latestNoteSegs = latestNote.split("-") || [];
    const isNoteSymbol =
      latestNoteSegs.length && latestNoteSegs[0].trim().length <= 2;

    switch (filterType) {
      case "done":
        return (
          !isNoteSymbol ||
          Object.keys(notesSymbols)
            .slice(4, 6)
            .indexOf(latestNoteSegs[0].trim()) !== -1
        );

      case "not-done":
        return (
          !!isNoteSymbol &&
          Object.keys(notesSymbols)
            .slice(0, 4)
            .indexOf(latestNoteSegs[0].trim()) !== -1
        );
    }
  };
  notifyDelete = (address, user) => {
    const messageBlock = (
      <View>
        <Text style={{ fontSize: 16 }}>
          {Language.translate("Delete_Address_Sure")}
        </Text>
        <Text style={[style["text-strong"], { fontSize: 16 }]}>
          {address.name} {UTILS.getListingAddress(address)}
        </Text>
      </View>
    );

    this.setState({
      noticeMessage: {
        title: Language.translate("Remove Address"),
        description: messageBlock,
        inputs: [
          {
            label: Language.translate("Reason"),
            type: "TextInput",
            name: "note",
            required: true
          },
          {
            label: Language.translate("Remove Completely"),
            name: "delete",
            type: user.isManager ? "Switch" : ""
          }
        ],
        actions: [
          {
            label: Language.translate("Continue"),
            action: () => {
              const errors = this.state.noticeMessage.inputs.filter(
                d => d.required && !d.value
              );

              console.log("errors", errors);

              if (errors.length) {
                const newData = this.state.noticeMessage.inputs.map(d =>
                  d.required && !d.value
                    ? {
                        ...d,
                        error:
                          d.name === "note"
                            ? Language.translate(
                                "Enter your reason for removing address"
                              )
                            : d.name + " is required"
                      }
                    : d
                );

                this.setState({
                  noticeMessage: {
                    ...this.state.noticeMessage,
                    inputs: newData
                  },
                  shouldRender: "Modal"
                });

                return;
              }

              let postData = {};
              this.state.noticeMessage.inputs.forEach(d => {
                postData[d.name] = d.value;
              });

              // console.log('postData', postData); // return;

              // Delete address
              Data.getApiData(
                `addresses/remove/${address.addressId}`,
                {
                  delete: postData.delete,
                  note: postData.note
                },
                "POST"
              )
                .then(data => {
                  // console.log('then() data', data) => "true"

                  if (!data) {
                    return this.setState({
                      noticeMessage: {
                        ...this.state.noticeMessage,
                        errorMesage: "An error occured: " + e
                      },
                      shouldRender: "Modal"
                    });
                  }

                  // NOTE: Add "Reason" note in Address.notes
                  const newNotes = (address.notes || []).slice();
                  newNotes.push({
                    date: postData.date || UTILS.getToday(),
                    note: postData.note,
                    // Note: Api needs to return "noteId"
                    // "noteId": 164,
                    retain: !!postData.retain,
                    userId: user.userId
                  });

                  this.updateAddress(
                    {
                      ...address,
                      inActive: !postData.delete
                      // notes: newNotes
                    },
                    postData.delete,
                    false
                  );
                })
                .catch(e => {
                  this.setState({
                    noticeMessage: {
                      ...this.state.noticeMessage,
                      errorMesage: "An error occured: " + e
                    },
                    shouldRender: "Modal"
                  });
                });
            },
            style: { backgroundColor: colors.red },
            textStyle: { color: colors.white }
          },
          {
            label: Language.translate("Cancel"),
            action: () =>
              this.setState({ noticeMessage: null, shouldRender: "Territory" })
          }
        ],
        saveData: data => {
          // console.log('data', data);

          const newData = this.state.noticeMessage.inputs.map(d => {
            if (d.name === (Object.keys(data) || {})[0])
              return {
                ...d,
                value: data[d.name],
                error: ""
              };
            return d;
          });

          this.setState({
            noticeMessage: {
              ...this.state.noticeMessage,
              inputs: newData,
              errorMesage: ""
            },
            shouldRender: "Modal"
          });
        }
      },
      shouldRender: "Territory"
    });
  };
  updateAddress = (updatedAddress, isDelete = false, allowGoBack = true) => {
    const updatedAddresses = isDelete
      ? this.state.data.addresses.filter(
          a => a.addressId !== updatedAddress.addressId
        )
      : this.state.data.addresses.map(a => {
          if (a.addressId === updatedAddress.addressId) return updatedAddress;
          return a;
        });
    const updatedData = { ...this.state.data, addresses: updatedAddresses };

    this.setState({
      data: updatedData,
      noticeMessage: null,
      shouldRender: "Territory"
    });
  };
  addAddress = newAddress => {
    if (!newAddress) return;

    let addresses = this.state.data.addresses.slice();

    // First, double check for dup
    const addressExist = addresses.find(
      ({ addressId }) => addressId === newAddress.addressId
    );
    if (!addressExist) addresses.push(newAddress);
    else {
      addresses = addresses.map(a => {
        if (a.addressId === newAddress.addressId) return newAddress;
        return a;
      });
    }

    // Add new Street to streetsList
    const streetsList = this.state.streetsList.slice();
    if (newAddress.street) {
      // First, double check for dup
      const streetExist = streetsList.find(
        ({ streetId }) => streetId === newAddress.street.streetId
      );
      if (!streetExist) streetsList.push(newAddress.street);
    }

    // console.log('newAddress', newAddress);

    this.setState({
      data: {
        ...this.state.data,
        addresses: addresses
      },
      streetsList: streetsList,
      shouldRender: "Territory",
      addressActive: newAddress
    });
  };
  viewPublisherDetails() {
    // Disable for now
  }
}
