import React from "react";
import { Text, View, Linking } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

import Data from "../../common/data";
import Language from "../../common/lang";
import UTILS from "../../common/utils";
import getSiteSetting from "../../common/settings";

import { HeadingBlue } from "../elements/Heading";
import Loading from "../elements/Loading";
import Message from "../elements/Message";
import { ButtonLink, ButtonHeader } from "../elements/Button";
import Notice from "../elements/PopupNotice";
import { DateInput, Switch } from "../elements/FormInput";

import style, { colors } from "../../styles/main";

import NotesModal, { NotesInput } from "../smart/NotesModal";

const languages = getSiteSetting("languages");

export default class PhoneNumbers extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: Language.translate("Phone Numbers"),
      headerRight: () => null,
    };
  };

  notesContainer = null;
  state = {};
  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.getParam("addressActive")) {
      const { lang: notesSymbolsLang } = Data.user;
      const { StatusSymbols: statusSymbols = {} } = languages[notesSymbolsLang];
      this.setState({
        data: navigation.getParam("addressActive"),
        user: Data.user,
        statusSymbols,
      });

      // console.log({ statusSymbols, address: navigation.getParam("addressActive") });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;
    if (!!navigation.getParam("saveNotes")) {
      this.saveNotes();
      navigation.setParams({ saveNotes: false });
    }
  }
  render() {
    const { state } = this;
    const { data, noteData, errors } = state;

    if (!data) return <Loading />;

    const phoneNumbers = (
      <KeyboardAwareFlatList
        contentContainerStyle={[
          style.listings,
          { minWidth: "90%", marginBottom: 40 },
        ]}
        data={data.phones}
        extraData={state}
        keyExtractor={(item) => item.phoneId.toString()}
        ListEmptyComponent={this.emptyListResult}
        renderItem={this.renderListOfPhones}
      />
    );

    return (
      <View style={[style.container, { paddingTop: 10 }]}>
        <HeadingBlue>{Language.translate("Work Phone Numbers")}</HeadingBlue>
        <Text style={[style["text-strong"], { padding: 5, minHeight: 50 }]}>
          {data.name ? UTILS.formatDiacritics(data.name) + " - " : ""}{" "}
          {UTILS.getListingAddress(data)}
        </Text>
        {phoneNumbers}

        <Notice
          data={state.noticeMessage}
          closeNotice={() => this.setState({ noticeMessage: null })}
        />
      </View>
    );
  }
  emptyListResult = () => (
    <View style={[style["listings-item"]]}>
      <Text />
    </View>
  );
  renderListOfPhones = ({ item }) => (
    <View style={[style["listings-item"]]}>
      {this.state.user.isManager || this.state.user.userId === item.userId ? (
        <ButtonLink
          customStyle={[style["listings-notes"], style["listings-notes-edit"]]}
          onPress={() => this.callPhoneNumber(item)}
        >
          {Language.translate("Call Now!")}
        </ButtonLink>
      ) : null}
      <View style={[style["listings-name"], style["address-listings-name"]]}>
        <Text style={[style["listings-date-text"]]}>
          {this.state.statusSymbols[UTILS.phoneStatusLabel(item.status)]}
        </Text>
        <Text numberOfLines={1} style={style["listings-notes-note-text"]}>
          {UTILS.formatDiacritics(item.name)}
        </Text>
      </View>
    </View>
  );
  setModalVisible = (modal) => {
    this.setState(modal);
  };
  saveData = (data) => {
    const newData = { ...this.state.noteData, ...data };

    if (!!newData.noteSymbol) {
      newData.note = !!newData.notesAddl
        ? `${newData.noteSymbol} - ${newData.notesAddl}`
        : newData.noteSymbol;
    }

    this.setState({
      noteData: newData,
      errors: {
        note: "",
        date: "",
        message: "",
      },
    });
  };
  saveNotesSymbol = (selected) => {
    this.saveData({
      noteSymbol: selected.option.value,
    });
    this.setModalVisible({ NotesOptionsModal: false });
  };
  saveNotesSymbolsLang = (selectedLang) => {
    this.setState({ notesSymbolsLang: selectedLang.option.value });
  };
  saveNotes = () => {
    const { navigation } = this.props;
    const {
      notesSymbolsLang,
      noteData,
      errors,
      data: addressData,
    } = this.state;
    const { noteId, note, date, noteSymbol, notesAddl } = noteData;
    const { territoryId, addressId } = addressData;

    // Validate
    if (!note || !date)
      return this.setState({
        errors: {
          ...errors,
          note: !note ? Language.translate("Notes is empty") : "",
          date: !date ? Language.translate("Date is missing") : "",
          message: !note ? Language.translate("Notes is empty") : "",
        },
      });

    const { NotesSymbols: notesSymbols = {} } = languages[notesSymbolsLang];

    // Require reason for "DO NOT CALL" and "PA FRAPE"
    if (
      noteSymbol &&
      (noteSymbol === notesSymbols["PA FRAPE"] ||
        noteSymbol === notesSymbols["DO NOT CALL"]) &&
      (!notesAddl || note === noteSymbol)
    ) {
      return this.setState({
        errors: {
          ...errors,
          notesAddl: Language.translate("Enter your reason for this note"),
        },
      });
    }

    // Data
    const dataToSave = {
      ...noteData,
      date: UTILS.getDateString(date),
    };

    if (
      noteSymbol &&
      (noteSymbol === notesSymbols["PA FRAPE"] ||
        noteSymbol === notesSymbols["DO NOT CALL"])
    ) {
      dataToSave.retain = true; // Retain for "DO NOT CALL", "PA FRAPE"
    }

    // Url
    const url = noteId
      ? `territories/${territoryId}/notes/edit/${noteId}`
      : `territories/${territoryId}/addresses/${addressId}/notes/add`;

    // save note
    Data.postApiData(url, dataToSave)
      .then((resData) => {
        // console.log('then() resData', resData)
        // Clear Errors
        this.setState(
          {
            errors: {
              note: "",
              date: "",
              message: "",
            },
          },
          () => {
            // update current Address
            if (typeof navigation.getParam("updateAddress") === "function") {
              let newNotes;
              // editting notes?
              if (noteId && resData) {
                newNotes = addressData.notes
                  .map((n) => {
                    if (n.noteId === noteId) {
                      return {
                        ...n,
                        date: dataToSave.date,
                        note: dataToSave.note,
                        retain: !!dataToSave.retain,
                      };
                    }

                    return n;
                  })
                  .sort(UTILS.sortNotes);
              }
              // adding new notes?
              else {
                newNotes =
                  (addressData.notes && addressData.notes.slice(0)) || [];
                newNotes.push({
                  note: resData.content,
                  date: resData.date,
                  noteId: resData.id,
                  retain: resData.archived === 1,
                  userId: resData.user_id,
                });
                newNotes = newNotes.sort(UTILS.sortNotes);
              }

              const newAddress = { ...addressData, notes: newNotes };
              navigation.getParam("updateAddress")(newAddress);
            }
            navigation.goBack();
          }
        );
      })
      .catch((e) => {
        // console.log('error', e)
        const errorMessage = Language.translate("An error occured.");
        this.setState({
          errors: {
            ...errors,
            message: errorMessage,
          },
        });
      });
  };
  callPhoneNumber = ({ name, number }, user) => {
    const messageBlock = (
      <View>
        <Text style={[style["text-strong"], { fontSize: 16 }]}>
          {name} - {number}
        </Text>
      </View>
    );
    this.setState({
      noticeMessage: {
        title: Language.translate("Call Now!"),
        description: messageBlock,
        actions: [
          {
            label: Language.translate("Continue"), // TODO: Add Phone icon
            action: () => {
              Linking.openURL(`tel:${number}`);
            },
            style: { backgroundColor: colors.red },
            textStyle: { color: colors.white },
          },
          {
            label: Language.translate("Done"),
            action: () => {
              this.setState({ noticeMessage: null, shouldRender: "Territory" });
            },
          },
        ],
      },
      shouldRender: "Territory",
    });
  };
}
