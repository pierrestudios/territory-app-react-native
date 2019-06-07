import React from "react";
import {
  View,
  Text,
  ScrollView,
  Picker,
  TouchableHighlight
} from "react-native";

import Language from "../common/lang";
import {
  SelectBox,
  RadioBox,
  TextInput,
  InputLabel
} from "../elements/FormInput";

import style, { colors } from "../styles/main";

export default (NotesModal = props => {
  return (
    <Modal
      visible={props.visible}
      onCloseModal={() => {
        // props.setModalVisible({ visible: false });
      }}
      style={{
        margin: 0
      }}
      customButtons={[
        {
          label: Language.translate("Close"),
          onPress: () => props.setModalVisible({ NotesOptionsModal: false })
        }
      ]}
    >
      <ScrollView
        style={{
          padding: 10,
          margin: 0
        }}
      >
        <SelectBox
          name="symbolsLang"
          data-name="symbolsLang"
          showLabel={true}
          label={Language.translate("Selected Language")}
          options={Object.keys(props.languages).map(l => ({
            value: l,
            label: props.languages[l]["lang-name"]
          }))}
          value={
            !!props.symbolsLang
              ? {
                  value: props.symbolsLang,
                  label: props.languages[props.symbolsLang]["lang-name"]
                }
              : { value: "", label: "" }
          }
          error={props.errors.streetId}
          onInput={props.saveNotesSymbolsLang}
        />

        <RadioBox
          name="noteSymbol"
          labelView={
            <View style={{ flex: 1, flexDirection: "row" }}>
              <InputLabel>
                {Language.translate("Select Note Symbol")}
              </InputLabel>
            </View>
          }
          options={props.symbolsOptions}
          onChange={props.saveNotesSymbol}
        />
      </ScrollView>
    </Modal>
  );
});

export const NotesInput = props => {
  return (
    <View>
      {props.noteData.noteId ? (
        <TextInput
          name="note"
          placeholder={Language.translate("Edit Notes")}
          onInput={props.saveData}
          value={props.noteData.note}
          error={props.errors.note}
        />
      ) : (
        <TouchableHighlight
          style={style["date-input-wrapper"]}
          onPress={() => props.setModalVisible({ NotesOptionsModal: true })}
        >
          <Text
            style={[
              {
                fontSize: 18,
                padding: 5,
                color: props.noteData.noteSymbol
                  ? colors["grey-dark"]
                  : colors["grey-lite"]
              }
            ]}
          >
            {!!props.noteData.noteSymbol
              ? `${props.noteData.noteSymbol} - ${
                  props.notesSymbols[props.noteData.noteSymbol]
                }`
              : Language.translate("Add Notes")}
          </Text>
        </TouchableHighlight>
      )}

      {!props.noteData.noteId && !!props.noteData.noteSymbol ? (
        <TextInput
          name="notesAddl"
          placeholder={Language.translate("Additional Notes")}
          onInput={props.saveData}
          value={props.noteData.notesAddl}
        />
      ) : null}
    </View>
  );
};
