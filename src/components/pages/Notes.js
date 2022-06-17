import React from "react";
import { Text, View, Platform } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareFlatList,
} from "react-native-keyboard-aware-scroll-view";

import Data from "../../common/data";
import Language from "../../common/lang";
import UTILS from "../../common/utils";
import getSiteSetting from "../../common/settings";

import Heading, { HeadingBlue } from "../elements/Heading";
import Loading from "../elements/Loading";
import Message from "../elements/Message";
import Line from "../elements/Line";
import { ButtonLink, ButtonHeader } from "../elements/Button";
import Notice from "../elements/PopupNotice";
import { DateInput, Switch } from "../elements/FormInput";

import style from "../../styles/main";

import NotesModal, { NotesInput } from "../smart/NotesModal";

const languages = getSiteSetting("languages");

export default class Notes extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: Language.translate("Notes"),
      headerRight: () => (
        <ButtonHeader
          onPress={() => {
            navigation.setParams({ saveNotes: true });
          }}
          title="Save"
          color="#fff"
        />
      ),
    };
  };
  notesContainer = null;
  state = {
    noteData: {
      note: "",
      symbol: null, // Note: init with "null" for validate
      date: UTILS.getDateObject(),
    },
    errors: {
      note: "",
      date: "",
      message: "",
    },
    user: null,
  };
  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.getParam("addressActive")) {
      this.setState({
        data: navigation.getParam("addressActive"),
        user: Data.user,
        notesSymbolsLang: Data.user.lang,
      });
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

    const { AddressNoteSymbols: addressNoteSymbols = {} } =
      languages[state.notesSymbolsLang];
    const notesSymbolsOptions = Object.keys(addressNoteSymbols).map(
      (k, inx) => ({
        value: inx,
        label: addressNoteSymbols[k],
        active: noteData.symbol === inx,
      })
    );

    const notes = (
      <KeyboardAwareFlatList
        contentContainerStyle={[
          style.listings,
          { minWidth: "80%", marginBottom: 40 },
          Platform.OS === "web" ? { width: 640 } : null,
        ]}
        data={data.notes}
        extraData={state}
        keyExtractor={(item) => item.noteId.toString()}
        ListEmptyComponent={this.emptyListResult}
        renderItem={this.renderListOfNotes}
        nativeID="notes-previous-notes-keyboard-aware-flatList"
      />
    );

    return (
      <View style={[style.container]} nativeID="notes">
        <KeyboardAwareScrollView
          style={[style["scroll-view"], { marginBottom: 40 }]}
          enableAutomaticScroll={true}
        >
          <HeadingBlue>
            {noteData && noteData.noteId
              ? Language.translate("Update Notes")
              : Language.translate("Add Notes")}
          </HeadingBlue>

          <Text style={[style["text-strong"], { padding: 5, minHeight: 50 }]}>
            {data.name ? UTILS.formatDiacritics(data.name) + " - " : ""}{" "}
            {UTILS.getListingAddress(data)}
          </Text>

          <View
            style={[
              style.content,
              style["notes-content"],
              { padding: 5, minHeight: 250 },
            ]}
            nativeID="notes-view-notes-content"
          >
            <Message error={errors.message} message={data.message} />

            <View style={{ minWidth: "90%" }} />

            <NotesInput
              noteData={noteData}
              saveData={this.saveData}
              errors={errors}
              notesSymbols={addressNoteSymbols}
              setModalVisible={this.setModalVisible}
            />

            <DateInput
              key="note-date"
              placeholder={Language.translate("Date")}
              name="date"
              value={noteData.date}
              onChange={this.saveData}
            />

            {state.user.isManager ? (
              <Switch
                label={Language.translate("Essential Note")}
                name="retain"
                onChange={this.saveData}
                value={noteData.retain}
              />
            ) : null}
          </View>

          <Line />

          <Notice data={state.noticeMessage} />
        </KeyboardAwareScrollView>

        <Heading level={3}>{Language.translate("Previous Notes")}</Heading>
        {notes}

        <NotesModal
          saveNotesSymbol={this.saveNotesSymbol}
          saveNotesSymbolsLang={this.saveNotesSymbolsLang}
          symbolsLang={state.notesSymbolsLang}
          symbolsOptions={notesSymbolsOptions}
          errors={errors}
          visible={state.NotesOptionsModal}
          setModalVisible={this.setModalVisible}
          languages={languages}
        />
      </View>
    );
  }
  emptyListResult = () => (
    <View style={[style["listings-item"]]}>
      <Text />
    </View>
  );
  renderListOfNotes = ({ item }) => {
    const { AddressNoteSymbols: notesSymbols = {} } =
      languages[this.state.notesSymbolsLang];

    const isLegacyNote = UTILS.isLegacyNote(
      UTILS.getLegacyNoteSymbol(item.note)
    );

    return (
      <View
        style={[
          style["listings-item"],
          item.noteId === this.state.noteData.noteId
            ? style["listings-item-inactive"]
            : null,
          { minHeight: Platform.OS === "web" ? 70 : 50 },
        ]}
      >
        {this.state.user.isManager || this.state.user.userId === item.userId ? (
          <ButtonLink
            customStyle={[
              style["listings-notes"],
              style["listings-notes-edit"],
            ]}
            onPress={() => this.updateNotes(item)}
          >
            {Language.translate("Edit")}
          </ButtonLink>
        ) : null}
        <View style={[style["listings-name"], style["address-listings-name"]]}>
          <Text
            style={[
              style["listings-date-text"],
              style["listings-notes-date-text"],
            ]}
          >
            {item.date}
          </Text>
          <Text numberOfLines={1} style={style["listings-notes-note-text"]}>
            {Number.isInteger(item.symbol) && !isLegacyNote
              ? `${Object.values(notesSymbols)[item.symbol]} - `
              : ""}
            {UTILS.formatDiacritics(item.note)}
          </Text>
        </View>
      </View>
    );
  };
  setModalVisible = (modal) => {
    this.setState(modal);
  };
  saveData = (data) => {
    const newData = { ...this.state.noteData, ...data };
    this.setState({
      noteData: newData,
      errors: {
        note: "",
        date: "",
        message: "",
      },
    });
  };
  updateNotes(data) {
    // console.log("updateNotes()", { data });
    this.setState({
      noteData: {
        note: UTILS.formatDiacritics(data.note),
        date: UTILS.getDateObject(data.date),
        retain: !!data.retain,
        noteId: data.noteId,
        symbol: data.symbol,
      },
    });
  }
  saveNotesSymbol = (selected) => {
    this.saveData({
      symbol: selected.option.value,
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
    const { noteId = null, note, date, symbol, notesAddl = "" } = noteData;
    const { territoryId, addressId } = addressData;

    /*
    console.log({
      noteId,
      note,
      date,
      symbol,
      notesAddl,
      territoryId,
      addressId,
    });

{
  "addressId": 1351,
  "date": 2022-02-10T03:37:00.000Z,
  "note": "",
  "noteId": undefined,
  "notesAddl": "Testing ",
  "symbol": "Revisit",
  "territoryId": 60,
}
    */

    // Validate
    if (symbol === null || !date)
      return this.setState({
        errors: {
          ...errors,
          note: !note ? Language.translate("Notes is empty") : "",
          date: !date ? Language.translate("Date is missing") : "",
          message: !note ? Language.translate("Notes is empty") : "",
        },
      });

    // const { NotesSymbols: notesSymbols = {} } = languages[notesSymbolsLang];

    // Require reason for "DO NOT CALL" and "PA FRAPE"
    if (symbol === UTILS.addressStatuses.STATUS_DO_NOT_CALL && !notesAddl) {
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
      note: noteData.note || noteData.notesAddl || "",
      date: UTILS.getDateString(date),
    };

    if (symbol === UTILS.addressStatuses.STATUS_DO_NOT_CALL) {
      dataToSave.retain = true; // Retain for "DO NOT CALL", "PA FRAPE"
    }

    // Url
    const url = noteId
      ? `territories/${territoryId}/notes/edit/${noteId}`
      : `territories/${territoryId}/addresses/${addressId}/notes/add`;

    console.log("saveNotes()", { dataToSave, url });
    // return;

    // save note
    Data.postApiData(url, dataToSave)
      .then((resData) => {
        console.log("then() resData", resData);
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
                        symbol: dataToSave.symbol,
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
                  note: resData.content || "",
                  date: resData.date,
                  noteId: resData.id,
                  retain: resData.archived === 1,
                  userId: resData.user_id,
                  symbol: resData.symbol,
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
}
