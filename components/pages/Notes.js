import React from "react";
import { FlatList, Text, View, TouchableHighlight } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Data from "../common/data";
import Language from "../common/lang";
import UTILS from "../common/utils";

import Heading, { HeadingBlue } from "../elements/Heading";
import Loading from "../elements/Loading";
import Message from "../elements/Message";
import Line from "../elements/Line";
import { ButtonLink, ButtonHeader } from "../elements/Button";
import Notice from "../elements/PopupNotice";
import {
  TextInput,
  DateInput,
  Switch,
  SelectBox,
  RadioBox
} from "../elements/FormInput";

import style, { colors } from "../styles/main";

export default class Notes extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate("Notes"),
      headerRight: (
        <ButtonHeader
          onPress={() => {
            navigation.setParams({ saveNotes: true });
          }}
          title="Save"
          color="#fff"
        />
      )
    };
  };

  notesContainer = null;
  state = {
    noteData: {
      note: "",
      noteSymbol: "",
      date: UTILS.getToday()
    },
    errors: {
      note: "",
      date: "",
      message: ""
    },
    user: null
  };
  componentWillMount() {
    const { navigation } = this.props;
    if (navigation.getParam("addressActive")) {
      this.setState({
        data: navigation.getParam("addressActive"),
        user: Data.user
      });
    }
  }
  componentWillReceiveProps(props) {
    if (props.navigation) {
      if (!!props.navigation.getParam("saveNotes")) this.saveNotes();
    }
  }
  render() {
    const state = this.state || {};
    const props = this.props || {};
    // console.log('state', state)
    if (!state.data) return <Loading />;

    const notes = (
      <FlatList
        contentContainerStyle={style.listings}
        data={state.data.notes}
        extraData={this.state}
        keyExtractor={item => item.noteId.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              style["listings-item"],
              item.noteId === state.noteData.noteId
                ? style["listings-item-active"]
                : null
            ]}
          >
            {state.user.isManager || state.user.userId === item.userId ? (
              <ButtonLink
                customStyle={[
                  style["listings-notes"],
                  style["listings-notes-edit"]
                ]}
                onPress={() => this.updateNotes(item)}
              >
                {Language.translate("Edit")}
              </ButtonLink>
            ) : null}
            <View
              style={[style["listings-name"], style["address-listings-name"]]}
            >
              <Text
                style={[
                  style["listings-date-text"],
                  style["listings-notes-date-text"]
                ]}
              >
                {item.date}
              </Text>
              <Text numberOfLines={1} style={style["listings-notes-note-text"]}>
                {UTILS.diacritics(item.note)}
              </Text>
            </View>
          </View>
        )}
      />
    );

    const notesSymbols = Language.translate("NotesSymbols") || {};
    const notesSymbolsOptions = Object.keys(notesSymbols).map(k => ({
      value: k,
      label: notesSymbols[k],
      active: this.state.noteData.noteSymbol === k
    }));

    // console.log("notesSymbolsOptions", notesSymbolsOptions);

    return (
      <View style={[style.container]}>
        <KeyboardAwareScrollView
          contentContainerStyle={[style["scroll-view"], { marginBottom: 40 }]}
          keyboardDismissMode="interactive"
        >
          <HeadingBlue>
            {state.noteData && state.noteData.noteId
              ? Language.translate("Update Notes")
              : Language.translate("Add Notes")}
          </HeadingBlue>

          <Text style={[style["text-strong"], { padding: 5, minHeight: 50 }]}>
            {state.data.name ? UTILS.diacritics(state.data.name) + " - " : ""}{" "}
            {UTILS.getListingAddress(state.data)}
          </Text>

          <View
            style={[
              style.content,
              style["notes-content"],
              { padding: 5, minHeight: 250 }
            ]}
          >
            <Message
              error={state.errors.message}
              message={state.data.message}
            />

            <View style={{ minWidth: "90%" }} />

            {this.state.noteData.note ? (
              <TextInput
                name="note"
                placeholder={Language.translate("Edit Notes")}
                onInput={this.saveData}
                value={this.state.noteData.note}
                error={this.state.errors.note}
              />
            ) : (
              <TouchableHighlight
                style={style["date-input-wrapper"]}
                onPress={() =>
                  this.setModalVisible({ NotesOptionsModal: true })
                }
              >
                <Text
                  style={[
                    {
                      fontSize: 18,
                      padding: 5,
                      color: colors["grey-lite"]
                    }
                  ]}
                >
                  {Language.translate("Add Notes")}
                </Text>
              </TouchableHighlight>
            )}

            <DateInput
              key="note-date"
              placeholder={Language.translate("Date")}
              name="date"
              value={state.noteData.date}
              onChange={this.saveData}
            />

            {state.user.isManager ? (
              <Switch
                label={Language.translate("Essential Note")}
                name="retain"
                onChange={this.saveData}
                value={this.state.noteData.retain}
              />
            ) : null}
          </View>

          <View class={style["notes-results"]}>
            <Heading level={3}>{Language.translate("Previous Notes")}</Heading>
            {notes}
          </View>

          <Line />

          <Notice data={state.noticeMessage} />
        </KeyboardAwareScrollView>

        <Modal
          visible={this.state.NotesOptionsModal}
          onCloseModal={() => {
            this.setModalVisible({ NotesOptionsModal: false });
          }}
          style={{
            margin: 0
            // padding: 0
          }}
          customButtons={[
            {
              label: Language.translate("Save"),
              onPress: () => {
                const noteStr = `${this.state.noteData.noteSymbol} ${
                  this.state.noteData.notesAddl
                    ? "- " + this.state.noteData.notesAddl
                    : ""
                }`;
                this.saveData({ note: noteStr.trim(), noteSymbol: "" });
                this.setModalVisible({ NotesOptionsModal: false });
              }
            },
            {
              label: Language.translate("Cancel"),
              onPress: () => {
                this.saveData({ noteSymbol: "" });
                this.setModalVisible({ NotesOptionsModal: false });
              }
            }
          ]}
        >
          <View
            style={{
              padding: 10,
              margin: 0
            }}
          >
            {/*
              <SelectBox
                name="noteSymbol"
                data-name="noteSymbol"
                showLabel={true}
                label={Language.translate("Select Note Symbol")}
                options={notesSymbolsOptions}
                value={
                  this.state.noteData.noteSymbol
                    ? {
                        value: this.state.noteData.noteSymbol,
                        label: notesSymbols[this.state.noteData.noteSymbol]
                      }
                    : { value: "", label: "" }
                }
                error={state.errors.streetId}
                onInput={this.saveNotesSymbol}
							/>
							*/}

            <RadioBox
              name="noteSymbol"
              labelView={
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text
                    style={[style["label-medium"], style["text-color-blue"]]}
                  >
                    {Language.translate("Select Note Symbol")}
                  </Text>
                </View>
              }
              options={notesSymbolsOptions}
              onChange={this.saveNotesSymbol}
            />

            <View
              style={{
                padding: 10,
                margin: 0
              }}
            >
              {this.state.noteData.noteSymbol !== "" ? (
                <TextInput
                  name="notesAddl"
                  showLabel={true}
                  placeholder={Language.translate("Additional Notes")}
                  onInput={this.saveData}
                  value={this.state.noteData.notesAddl}
                />
              ) : null}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  setModalVisible(modal) {
    this.setState(modal);
  }
  saveData = data => {
    // console.log("data", data);

    const newData = { ...this.state.noteData, ...data };

    this.setState({
      noteData: newData,
      errors: {
        note: "",
        date: "",
        message: ""
      }
    });
  };
  updateNotes(data) {
    // console.log('updateNotes', data);
    this.setState({
      noteData: {
        note: UTILS.diacritics(data.note),
        date: UTILS.getDateObject(data.date),
        retain: !!data.retain,
        noteId: data.noteId
      }
    });
  }
  saveNotesSymbol = selected => {
    this.saveData({
      noteSymbol: selected.option.value
    });
  };
  saveNotes = () => {
    // console.log('noteData', this.state.noteData);
    // console.log('this.state.data', this.state.data)
    // Validate
    if (!this.state.noteData.note || !this.state.noteData.date)
      return this.setState({
        errors: {
          ...this.state.errors,
          note: !this.state.data.note
            ? Language.translate("Notes is empty")
            : "",
          date: !this.state.data.date
            ? Language.translate("Date is missing")
            : ""
        }
      });

    // Data
    const data = {
      ...this.state.noteData,
      date: UTILS.getDateString(this.state.noteData.date)
    };

    // Url
    const url = this.state.noteData.noteId
      ? `territories/${this.state.data.territoryId}/notes/edit/${
          this.state.noteData.noteId
        }`
      : `territories/${this.state.data.territoryId}/addresses/${
          this.state.data.addressId
        }/notes/add`;

    // console.log('data', data); // return;

    // save note
    Data.getApiData(url, data, "POST")
      .then(resData => {
        // console.log('then() resData', resData)
        // Clear Errors
        this.setState(
          {
            errors: {
              note: "",
              date: "",
              message: ""
            }
          },
          () => {
            // console.log('this.state', this.state)
            // update current Address
            if (
              typeof this.props.navigation.getParam("updateAddress") ===
              "function"
            ) {
              let newNotes;
              // editting notes?
              if (this.state.noteData.noteId && resData) {
                newNotes = this.state.data.notes
                  .map(n => {
                    if (n.noteId === this.state.noteData.noteId)
                      return {
                        ...n,
                        date: data.date,
                        note: data.note,
                        retain: !!data.retain
                      };
                    return n;
                  })
                  .sort(UTILS.sortNotes);
              }
              // adding new notes?
              else {
                newNotes =
                  (this.state.data.notes && this.state.data.notes.slice(0)) ||
                  [];
                newNotes.push({
                  note: resData.content,
                  date: resData.date,
                  noteId: resData.id,
                  retain: resData.archived === 1,
                  userId: resData.user_id
                });
                newNotes = newNotes.sort(UTILS.sortNotes);
              }

              const newAddress = { ...this.state.data, notes: newNotes };
              this.props.navigation.getParam("updateAddress")(newAddress);
            }
            this.props.navigation.goBack();
          }
        );
      })
      .catch(e => {
        // console.log('error', e)
        const errorMessage = Language.translate("An error occured.");
        this.setState({
          errors: {
            ...this.state.errors,
            message: errorMessage
          }
        });
      });
  };
}
