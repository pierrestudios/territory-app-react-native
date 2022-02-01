import React from "react";
import { Text, View, Linking } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Data from "../../common/data";
import Language from "../../common/lang";
import UTILS from "../../common/utils";
import getSiteSetting from "../../common/settings";
import Loading from "../elements/Loading";
import { ButtonLink } from "../elements/Button";
import Notice from "../elements/PopupNotice";
import style, { colors } from "../../styles/main";

const languages = getSiteSetting("languages");

export default class PhoneNumbers extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: Language.translate("Phone Numbers"),
      headerRight: () => null,
    };
  };
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
    const { data } = state;

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
      {this.state.user.isManager ||
      (this.state.user.isEditor && UTILS.canMakeCall(item)) ? (
        <ButtonLink
          customStyle={[style["listings-notes"], style["listings-notes-edit"]]}
          onPress={() => this.callPhoneNumber(item)}
        >
          {Language.translate("Call Now!")}
        </ButtonLink>
      ) : (
        <Text
          style={[
            style["listings-notes"],
            {
              marginTop: 10,
              color: item.status === 1 ? colors.red : colors.grey,
            },
          ]}
        >
          {this.state.statusSymbols[UTILS.phoneStatusLabel(item.status)]}
        </Text>
      )}
      <View style={[style["listings-name"], style["address-listings-name"]]}>
        <Text style={[style["listings-date-text"]]}>
          {this.state.statusSymbols[UTILS.phoneStatusLabel(item.status)]}
        </Text>
        <Text numberOfLines={1} style={style["listings-notes-note-text"]}>
          {item.name ? UTILS.formatDiacritics(item.name) : ""}
        </Text>
      </View>
    </View>
  );
  renderListOfNotes = ({ noteId, date, note, symbol }) => {
    // console.log("renderListOfNotes", { noteId, symbol });

    return (
      <View
        key={`notes-${noteId}`}
        style={[
          {
            paddingBottom: 8,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 5,
            borderColor: colors["grey-lite"],
          },
        ]}
      >
        <Text numberOfLines={1} style={[{ color: colors.grey }]}>
          {date} - {this.state.statusSymbols[UTILS.phoneStatusLabel(symbol)]}
        </Text>
        {note ? (
          <Text style={[{ color: colors["grey-dark"] }]}>
            {UTILS.formatDiacritics(note)}
          </Text>
        ) : null}
      </View>
    );
  };
  savePhoneNotes = (noteData) => {
    const { navigation } = this.props;
    const { data: addressData } = this.state;
    const { territoryId } = addressData;

    // Data
    const dataToSave = {
      symbol: noteData.noteSymbol,
      content: noteData.comments || "",
      date: UTILS.getToday(),
    };

    // Url
    const url = `territories/${territoryId}/phones/${noteData.phoneId}/notes/add`;

    // console.log("savePhoneNotes()", { url, dataToSave });
    // return Promise.resolve();

    // save note
    Data.postApiData(url, dataToSave)
      .then((resData) => {
        // console.log("then() resData", resData);

        // Clear Errors
        this.setState(
          {
            errors: {
              note: "",
              date: "",
              message: "",
            },
            noticeMessage: null,
          },
          () => {
            // update current Address
            if (typeof navigation.getParam("updateAddress") === "function") {
              const targetPhone = (
                (addressData.phones && addressData.phones.slice(0)) ||
                []
              ).find((p) => p.phoneId === noteData.phoneId);
              const newNotes =
                (targetPhone &&
                  targetPhone.notes &&
                  targetPhone.notes.slice(0)) ||
                [];
              newNotes.push({
                note: resData.content,
                date: resData.date,
                noteId: resData.id,
                retain: resData.archived === 1,
                userId: resData.user_id,
              });
              addressData.phones = addressData.phones.map((p) => {
                if (p.phoneId === noteData.phoneId) {
                  return {
                    ...p,
                    notes: newNotes.sort(UTILS.sortNotes),
                  };
                }
                return p;
              });
              navigation.getParam("updateAddress")(addressData);
              this.setState({ data: addressData });
            }
          }
        );
      })
      .catch((e) => {
        // console.log("error", e);
        const errorMessage = Language.translate("An error occured.");
        this.setState({
          errors: {
            ...this.state.errors,
            message: errorMessage,
          },
        });
      });
  };
  callPhoneNumber = ({ name, number, phoneId, territoryId, notes = [] }) => {
    const messageBlock = (
      <View>
        {/* 
        <Text
          style={[style["text-strong"], { fontSize: 16, marginBottom: 10 }]}
        >
          {name} - {number}
        </Text>
        */}
        {(notes && notes.slice(0, 1).map(this.renderListOfNotes)) || null}
      </View>
    );
    const phoneNotesOptions = Object.values(this.state.statusSymbols).map(
      (s, inx) => {
        return {
          label: s,
          value: inx,
        };
      }
    );
    const phoneNotesInputs = [
      {
        label: `${Language.translate("Result from call")}:`,
        type: "SelectBox",
        name: "noteSymbol",
        options: phoneNotesOptions,
        value: { value: "", label: Language.translate("Add Notes") },
        required: true,
      },
      {
        label: Language.translate("Additional Notes"),
        type: "TextInput",
        name: "comments",
      },
    ];
    // console.log({ phoneNotesOptions, statusSymbols: this.state.statusSymbols });

    this.setState({
      noticeMessage: {
        title: number, // Language.translate("Call Now!"),
        description: messageBlock,
        inputs: phoneNotesInputs,
        actions: [
          {
            label: Language.translate("Continue") + " ", // Note: Leave space for icon
            iconAfter: (
              <FontAwesome
                {...{
                  name: "phone",
                  size: 16,
                  color: colors.white,
                }}
              />
            ),
            action: () => Linking.openURL(`tel://${number}`),
            style: { backgroundColor: colors["green-bright"], borderWidth: 0 },
            textStyle: {
              color: colors.white,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          {
            label: Language.translate("Done"),
            action: () => {
              const newNoteData = {};
              this.state.noticeMessage.inputs.forEach((p) => {
                newNoteData[p.name] = p.value || "";
                if (p.name === "noteSymbol") {
                  newNoteData[p.name] = p.value.value;
                }
              });

              // console.log({ newNoteData });
              if (!newNoteData.noteSymbol && !(newNoteData.noteSymbol === 0)) {
                const newData = this.state.noticeMessage.inputs.map((d) => ({
                  ...d,
                  error:
                    d.name === "noteSymbol"
                      ? Language.translate("Please add notes")
                      : "",
                }));

                this.setState({
                  noticeMessage: {
                    ...this.state.noticeMessage,
                    inputs: newData,
                  },
                  shouldRender: "Modal",
                });

                return;
              }

              this.savePhoneNotes({
                ...newNoteData,
                phoneId,
                territoryId,
              });
            },
            style: { backgroundColor: colors.red, borderWidth: 0 },
            textStyle: {
              color: colors.white,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
        ],
        saveData: (data) => {
          // console.log("saveData()", { data });

          const newNoticeMessageData = this.state.noticeMessage.inputs.map(
            (d) => {
              if (data.name === d.name) {
                return {
                  ...d,
                  value: data.option,
                  error: "",
                };
              } else if (d.name === (Object.keys(data) || {})[0])
                return {
                  ...d,
                  value: data[d.name],
                  error: "",
                };
              return d;
            }
          );
          // console.log("saveData()", { newNoticeMessageData });

          this.setState({
            noticeMessage: {
              ...this.state.noticeMessage,
              inputs: newNoticeMessageData,
              errorMesage: "",
            },
            shouldRender: "Modal",
          });
        },
      },
      shouldRender: "Territory",
    });
  };
}
