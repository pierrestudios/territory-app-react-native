import React from "react";
import { View, Text, ScrollView, TouchableHighlight } from "react-native";

import Language from "../../common/lang";
import {
  SelectBox,
  RadioBox,
  TextInput,
  InputLabel,
} from "../elements/FormInput";

import style, { colors } from "../../styles/main";

export default function NotesModal(props) {
  return (
    <Modal
      visible={props.visible}
      style={{
        margin: 0,
      }}
      customButtons={[
        {
          label: Language.translate("Close"),
          onPress: () => props.setModalVisible({ NotesOptionsModal: false }),
        },
      ]}
    >
      <ScrollView
        style={{
          padding: 10,
          margin: 0,
        }}
      >
        <SelectBox
          name="symbolsLang"
          data-name="symbolsLang"
          showLabel={true}
          label={Language.translate("Selected Language")}
          options={Object.keys(props.languages).map((l) => ({
            value: l,
            label: props.languages[l]["lang-name"],
          }))}
          value={
            !!props.symbolsLang
              ? {
                  value: props.symbolsLang,
                  label: props.languages[props.symbolsLang]["lang-name"],
                }
              : { value: "", label: "" }
          }
          error={props.errors.streetId}
          onInput={props.saveNotesSymbolsLang}
        />

        <RadioBox
          name="symbol"
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
}

export const NotesInput = (props) => {
  return (
    <View>
      <TouchableHighlight
        style={style["date-input-wrapper"]}
        onPress={() => props.setModalVisible({ NotesOptionsModal: true })}
      >
        <Text
          style={[
            {
              fontSize: 18,
              padding: 5,
              color: Number.isInteger(props.noteData.symbol)
                ? colors["grey-dark"]
                : colors["grey-lite"],
            },
          ]}
        >
          {Number.isInteger(props.noteData.symbol)
            ? `${Object.values(props.notesSymbols)[props.noteData.symbol]}`
            : Language.translate("Add Notes")}
        </Text>
      </TouchableHighlight>

      {props.noteData.noteId ? (
        <TextInput
          name="note"
          placeholder={Language.translate("Add Notes")}
          onInput={props.saveData}
          value={props.noteData.note}
          error={props.errors.note}
        />
      ) : null}

      {!props.noteData.noteId && Number.isInteger(props.noteData.symbol) ? (
        <TextInput
          name="notesAddl"
          placeholder={
            props.errors.notesAddl || Language.translate("Additional Notes")
          }
          onInput={props.saveData}
          value={props.noteData.notesAddl}
          error={props.errors.notesAddl}
        />
      ) : null}
    </View>
  );
};
