import React from "react";
import { Text, View, Share, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Data from "../../common/data";
import Language from "../../common/lang";
import UTILS from "../../common/utils";
import NavigationService from "../../common/nav-service";
import getSiteSetting from "../../common/settings";

import Loading from "../elements/Loading";
import { ButtonHeader, ButtonLink } from "../elements/Button";
import Notice from "../elements/PopupNotice";
import { RadioBox, TextInput } from "../elements/FormInput";

import style, { colors } from "../../styles/main";
import Modal from "../elements/Modal";
import TerritoryDetailsHeader from "../smart/TerritoryDetailsHeader";
import TerritoryDetailsList from "../smart/TerritoryDetailsList";
import TerritoryDetailsModeModal from "../smart/TerritoryDetailsModeModal";

const languages = getSiteSetting("languages");
const SEARCH_RESULTS_LIMIT = 5;

export default class TerritoryDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: `${Language.translate("Territory")} ${navigation.getParam(
        "territoryNumber",
        "..."
      )}`,
      headerRight: () =>
        !!navigation.getParam("isEditor") &&
        !!navigation.getParam("streetsList") ? (
          <ButtonHeader
            onPress={() => {
              navigation.navigate("AddressAdd", {
                streetsList: navigation.getParam("streetsList"),
                territoryId: navigation.getParam("territoryId"),
                addAddress: (newAddress) =>
                  navigation.setParams({ newAddress }),
              });
            }}
            title={<Feather name="plus" size={24} color="#fff" />}
            color="#fff"
          />
        ) : null,
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
    modeOptionsOpened: false,
    modeOption: "address",
    filterType: "all",
    searchModalOpened: false,
    searchQuery: "",
    searchQueryResults: [],
  };
  componentDidMount() {
    this.territoryId = this.props.navigation.getParam("territoryId");
    this.allTerritories = !!this.props.navigation.getParam("allTerritories");

    if (!!this.territoryId) {
      // get territory details
      Data.getApiData(
        `territories${this.allTerritories ? "-all" : ""}/${this.territoryId}`
      )
        .then((data) => {
          const { user } = Data;

          if (!!data && !!data.territoryId) {
            const streetsList = UTILS.getStreetsList(data.addresses);
            this.setState({
              data,
              user,
              notesSymbolsLang: user.lang,
              addressActive: null,
              streetsList: streetsList,
              noticeMessage: null,
              shouldRender: "Territory",
            });

            // Set params for Navigation Header
            this.props.navigation.setParams({
              territoryNumber: data.number,
              isEditor: user.isEditor,
              streetsList: streetsList,
            });
          }
        })
        .catch(UTILS.logError);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;

    if (navigation && !!navigation.getParam("newAddress")) {
      this.addAddress(navigation.getParam("newAddress"));
      navigation.setParams({ newAddress: null });
    }
  }
  render() {
    const { state } = this;

    if (!state.data) return <Loading />;

    const { AddressNoteSymbols: notesSymbols = {} } =
      languages[state.notesSymbolsLang];

    const filterTypes = [
      { value: "all", label: Language.translate("All") },
      { value: "done", label: Language.translate("Worked") },
      { value: "not-done", label: Language.translate("Not worked") },
    ];

    const modeOptions = [
      {
        value: "address",
        label: Language.translate("Addresses"),
        "icon-name": "home",
      },
      {
        value: "phone",
        label: Language.translate("Phone"),
        "icon-name": "phone",
      },
    ];

    return (
      <View style={[style.section, style.content]}>
        <TerritoryDetailsHeader
          {...{
            ...this,
            modeOptions,
            modeOption: state.modeOption,
            selectedAddresses: state.selectedAddresses,
          }}
        />
        <TerritoryDetailsList
          {...{
            ...this,
            ...state,
            notesSymbols,
            onOpenRow: (item) => {
              this.setState({ activeRow: item.addressId });
            },
          }}
        />
        <Notice
          data={state.noticeMessage}
          closeNotice={() => this.setState({ noticeMessage: null })}
        />
        <TerritoryDetailsModeModal
          {...{
            ...this,
            ...state,
            filterTypes,
            onCloseModal: () => {
              this.setState({ addressesFilterOpened: false });
            },
          }}
        />
        <Modal
          animationType="fade"
          visible={state.modeOptionsOpened}
          onCloseModal={() => {
            this.setState({ modeOptionsOpened: false });
          }}
        >
          <View style={[styles["modal-view"], {}]}>
            <RadioBox
              name="mode"
              label={Language.translate("Territory Mode")}
              options={modeOptions.map((m) => ({
                ...m,
                active: m.value === state.modeOption,
              }))}
              onChange={this.saveModeOption}
            />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          visible={state.searchModalOpened}
          onCloseModal={() => {
            this.setState({ searchModalOpened: false });
          }}
        >
          <View style={[styles["modal-view"], {}]}>
            <TextInput
              label={Language.translate(
                state.modeOption === "phone"
                  ? "Search for phone"
                  : "Search for name"
              )}
              showLabel={true}
              value={state.searchQuery}
              name="search"
              onInput={({ search: searchQuery }) => {
                this.setState({ searchQuery }, () => {
                  this.performSearch(searchQuery);
                });
              }}
            />
            {state.searchQueryResults.length ? (
              <ScrollView>
                {state.searchQueryResults
                  .slice(0, SEARCH_RESULTS_LIMIT)
                  .map((item) => {
                    let nameText = UTILS.formatDiacritics(item.name);
                    let entryText = UTILS.getListingAddress(item);
                    let notesFn = () => this.viewNotes(item);

                    if (state.modeOption === "phone") {
                      const resultEntry = item.phones.find(({ number }) =>
                        UTILS.getNumbersOnly(number).match(
                          UTILS.getNumbersOnly(state.searchQuery)
                        )
                      );
                      nameText =
                        (resultEntry &&
                          UTILS.formatDiacritics(resultEntry.name)) ||
                        "";
                      entryText = (resultEntry && resultEntry.number) || "";
                      notesFn = () => this.viewPhoneNumbers(item, resultEntry);
                    }

                    return (
                      <View
                        key={item.addressId}
                        style={[style["listings-item"]]}
                      >
                        <Text>{nameText}</Text>
                        <Text>{entryText}</Text>
                        {state.user.isNoteEditor ? (
                          <ButtonLink
                            key="listings-add-notes"
                            customStyle={[
                              style["add-notes"],
                              {
                                marginTop: -3,
                                paddingLeft: 5,
                                paddingRight: 5,
                              },
                            ]}
                            onPress={notesFn}
                          >
                            <Text>{Language.translate("Notes")}</Text>
                          </ButtonLink>
                        ) : null}
                      </View>
                    );
                  })}
              </ScrollView>
            ) : null}
          </View>
        </Modal>
      </View>
    );
  }
  filterAddresses = (a) => {
    // Filter "not-done-at-all", search for not worked
    if (this.state.filterType === "not-done-at-all") {
      const hasPhon = this.matchFilterType(a, "not-done", "phone");
      const hasAddr = this.matchFilterType(a, "not-done", "address");
      return hasPhon && hasAddr;
    }

    // Note: for modeOption: "phone", if no phones, show ONLY for Managers
    if (
      this.state.modeOption === "phone" &&
      (!a.phones || !a.phones.length) &&
      !this.state.user.isManager
    ) {
      return false;
    }

    // Note: Unless filterType: "all", must match filter
    if (
      !(this.state.filterType === "all") &&
      !this.matchFilterType(a, this.state.filterType)
    ) {
      return false;
    }

    return !a.inActive || !!this.state.user.isManager;
  };
  hasWarning = (address) => {
    const warningTerms = ["not call", "frape"];
    for (let t = 0; t < warningTerms.length; t++) {
      if (
        address.name.toLowerCase().indexOf(warningTerms[t]) !== -1 ||
        (!!address.notes &&
          !!address.notes.find(
            (n) =>
              (n.note &&
                n.note.toLowerCase().indexOf(warningTerms[t]) !== -1) ||
              n.symbol === UTILS.addressStatuses.STATUS_DO_NOT_CALL
          ))
      ) {
        return true;
      }
    }

    return false;
  };
  viewPhoneNumbers = (data, phoneData = null) => {
    this.setState({ addressActive: data }, () => {
      NavigationService.navigate("PhoneNumbers", {
        addressActive: data,
        phoneActive: phoneData,
        territoryId: data.territoryId,
        updateAddress: this.updateAddress,
      });
    });
  };
  viewNotes = (data) => {
    // TODO: Find the source of this.props.entity

    this.setState({ addressActive: data, shouldRender: "Notes" }, () => {
      this.props.entity && typeof this.props.entity.viewNotes === "function"
        ? this.props.entity.viewNotes(data)
        : NavigationService.navigate("Notes", {
            addressActive: data,
            updateAddress: this.updateAddress,
            territoryId: data.territoryId,
          });
    });
  };
  viewAddress = (data) => {
    this.setState({ addressActive: data, shouldRender: "addressId" }, () => {
      this.props.entity && typeof this.props.entity.viewAddress === "function"
        ? this.props.entity.viewAddress(data)
        : NavigationService.navigate("AddressEdit", {
            addressActive: data,
            streetsList: this.state.streetsList,
            territoryId: data.territoryId,
            updateAddress: this.updateAddress,
          });
    });
  };
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
          data: this.state.data,
        });
  };
  openWebViewApi = (url) => {
    NavigationService.navigate("WebViewApi", {
      url: url,
      data: { ...this.state.data, title: Language.translate("Territory") },
    });
  };
  selectAddressRow = (addressId, unselect = false) => {
    let selectedAddresses = this.state.selectedAddresses.slice();

    if (unselect) {
      selectedAddresses = selectedAddresses.filter((a) => addressId !== a);
    } else {
      selectedAddresses.push(addressId);
    }
    this.setState({
      selectedAddresses,
    });
  };
  sendSelectedAddresses = async () => {
    const title = `${Language.translate("Territory")} ${
      this.state.data.number
    } - ${this.state.data.publisher.firstName} ${
      this.state.data.publisher.lastName
    }`;

    const addressesToShare = this.state.data.addresses
      .filter((a) => this.state.selectedAddresses.indexOf(a.addressId) != -1)
      .sort(UTILS.sortAddress);

    let listToShare = [];
    if (this.state.modeOption === "phone") {
      addressesToShare.forEach((a) => {
        const callablePhones = UTILS.getListingCallablePhones(a);
        if (callablePhones.length) {
          listToShare.push(UTILS.getListingAddress(a));
          listToShare.push(...callablePhones);
        }
      });
    } else {
      listToShare = addressesToShare.map((a) => UTILS.getListingAddress(a));
    }

    try {
      const result = await Share.share({
        title: title,
        dialogTitle: title,
        subject: title,
        message: title + "\n \n" + listToShare.join("\n"),
      });

      // console.log("result", result);
      if (result.action === Share.sharedAction) {
        this.setState({ selectedAddresses: [], selectorOpened: false });
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
      addressesFilterOpened: this.state.addressesFilterOpened === false,
    });
  };
  saveFilterType = (data) => {
    this.setState({
      filterType: data.option.value,
      addressesFilterOpened: false,
    });
  };
  showModeOptions = () => {
    this.setState({
      modeOptionsOpened: this.state.modeOptionsOpened === false,
    });
  };
  saveModeOption = (data) => {
    this.setState({
      modeOption: data.option.value,
      modeOptionsOpened: false,
    });
  };
  showSearchModal = () => {
    this.setState({
      searchModalOpened: this.state.searchModalOpened === false,
    });
  };
  performSearch = (queryText) => {
    if (queryText.length < 3) {
      return this.setState({ searchQueryResults: [] });
    }

    if (this.state.modeOption === "address") {
      const namesMatched = this.state.data.addresses.filter(({ name }) => {
        return name.match(queryText);
      });
      this.setState({
        searchQueryResults: namesMatched || [],
      });
    } else {
      const phonesMatched = this.state.data.addresses.filter(({ phones }) => {
        return (
          (phones &&
            phones.filter(({ number }) =>
              UTILS.getNumbersOnly(number).match(
                UTILS.getNumbersOnly(queryText)
              )
            )) ||
          []
        ).length;
      });
      this.setState({
        searchQueryResults: phonesMatched || [],
      });
    }
  };
  saveNotesSymbolsLang = (selectedLang) => {
    this.setState({ notesSymbolsLang: selectedLang.option.value });
  };
  matchFilterType = (address, filterType, mode = this.state.modeOption) => {
    if (mode === "phone" && !!address.phones && !!address.phones.length) {
      if (filterType === "not-done") {
        return address.phones.filter(
          (p) =>
            !p.notes ||
            p.notes[0].symbol === UTILS.phoneStatuses.STATUS_UNVERIFIED
        ).length;
      }

      return (
        address.phones.filter(
          (p) =>
            p.notes.length &&
            parseInt(p.notes[0].symbol) ===
              UTILS.phoneStatuses.STATUS_UNVERIFIED
        ).length === 0
      );
    } else if (mode === "phone") {
      return false;
    }

    if (!address.notes || !address.notes.length) {
      return filterType === "not-done";
    }

    if (this.hasWarning(address)) {
      return false;
    }

    // Note: Check for legacy notes (before use of symbols)
    const legacyNoteSymbols =
      languages[this.state.notesSymbolsLang]["NotesSymbols"] || {};
    const legacyNote = UTILS.getLegacyNoteSymbol(address.notes[0].note);
    const isLegacyNote = UTILS.isLegacyNote(legacyNote);

    switch (filterType) {
      case "done":
        if (isLegacyNote) {
          return (
            Object.keys(legacyNoteSymbols).slice(4, 6).indexOf(legacyNote) !==
            -1
          );
        }

        return (
          [
            UTILS.addressStatuses.STATUS_MAN,
            UTILS.addressStatuses.STATUS_WOMAN,
            UTILS.addressStatuses.STATUS_SENT_LETTER,
            UTILS.addressStatuses.STATUS_WITNESS_STUDENT,
            UTILS.addressStatuses.STATUS_DO_NOT_CALL,
          ].indexOf(address.notes[0].symbol) !== -1
        );

      case "not-done":
        if (isLegacyNote) {
          return (
            Object.keys(legacyNoteSymbols).slice(0, 4).indexOf(legacyNote) !==
            -1
          );
        }

        return (
          [
            UTILS.addressStatuses.STATUS_BUSY,
            UTILS.addressStatuses.STATUS_CHILDREN,
            UTILS.addressStatuses.STATUS_NOT_HOME,
            UTILS.addressStatuses.STATUS_REVISIT,
          ].indexOf(address.notes[0].symbol) !== -1
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
            required: true,
          },
          {
            label: Language.translate("Remove Completely"),
            name: "delete",
            type: user.isManager ? "Switch" : "",
          },
        ],
        actions: [
          {
            label: Language.translate("Continue"),
            action: () => {
              const errors = this.state.noticeMessage.inputs.filter(
                (d) => d.required && !d.value
              );

              console.log("errors", errors);

              if (errors.length) {
                const newData = this.state.noticeMessage.inputs.map((d) =>
                  d.required && !d.value
                    ? {
                        ...d,
                        error:
                          d.name === "note"
                            ? Language.translate(
                                "Enter your reason for removing address"
                              )
                            : d.name + " is required",
                      }
                    : d
                );

                this.setState({
                  noticeMessage: {
                    ...this.state.noticeMessage,
                    inputs: newData,
                  },
                  shouldRender: "Modal",
                });

                return;
              }

              let postData = {};
              this.state.noticeMessage.inputs.forEach((d) => {
                postData[d.name] = d.value;
              });

              // Delete address
              Data.postApiData(`addresses/remove/${address.addressId}`, {
                delete: postData.delete,
                note: postData.note,
              })
                .then((data) => {
                  // console.log('then() data', data) => "true"

                  if (!data) {
                    return this.setState({
                      noticeMessage: {
                        ...this.state.noticeMessage,
                        errorMesage: "An error occured: " + e,
                      },
                      shouldRender: "Modal",
                    });
                  }

                  // NOTE: Add "Reason" note in Address.notes
                  const newNotes = (address.notes || []).slice();
                  newNotes.push({
                    date: postData.date || UTILS.getToday(),
                    note: postData.note,
                    // Note: Api needs to return "noteId"
                    retain: !!postData.retain,
                    userId: user.userId,
                  });

                  this.updateAddress(
                    {
                      ...address,
                      inActive: !postData.delete,
                      // notes: newNotes
                    },
                    postData.delete,
                    false
                  );
                })
                .catch((e) => {
                  this.setState({
                    noticeMessage: {
                      ...this.state.noticeMessage,
                      errorMesage: "An error occured: " + e,
                    },
                    shouldRender: "Modal",
                  });
                });
            },
            style: { backgroundColor: colors.red },
            textStyle: { color: colors.white },
          },
          {
            label: Language.translate("Cancel"),
            action: () =>
              this.setState({ noticeMessage: null, shouldRender: "Territory" }),
          },
        ],
        saveData: (data) => {
          // console.log('data', data);

          const newData = this.state.noticeMessage.inputs.map((d) => {
            if (d.name === (Object.keys(data) || {})[0])
              return {
                ...d,
                value: data[d.name],
                error: "",
              };
            return d;
          });

          this.setState({
            noticeMessage: {
              ...this.state.noticeMessage,
              inputs: newData,
              errorMesage: "",
            },
            shouldRender: "Modal",
          });
        },
      },
      shouldRender: "Territory",
    });
  };
  updateAddress = (updatedAddress, isDelete = false, allowGoBack = true) => {
    const updatedAddresses = isDelete
      ? this.state.data.addresses.filter(
          (a) => a.addressId !== updatedAddress.addressId
        )
      : this.state.data.addresses.map((a) => {
          if (a.addressId === updatedAddress.addressId) return updatedAddress;
          return a;
        });
    const updatedData = { ...this.state.data, addresses: updatedAddresses };

    this.setState({
      data: updatedData,
      noticeMessage: null,
      shouldRender: "Territory",
    });
  };
  addAddress = (newAddress) => {
    if (!newAddress) return;

    let addresses = this.state.data.addresses.slice();

    // First, double check for dup
    const addressExist = addresses.find(
      ({ addressId }) => addressId === newAddress.addressId
    );
    if (!addressExist) addresses.push(newAddress);
    else {
      addresses = addresses.map((a) => {
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
        addresses: addresses,
      },
      streetsList: streetsList,
      shouldRender: "Territory",
      addressActive: newAddress,
    });
  };
  viewPublisherDetails() {
    // Disable for now
  }
}
