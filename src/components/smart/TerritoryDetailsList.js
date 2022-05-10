import React from "react";
import { FlatList, TouchableOpacity, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swipeout from "react-native-swipeout";

import Language from "../../common/lang";
import UTILS from "../../common/utils";

import { ButtonLink } from "../elements/Button";
import { Checkbox } from "../elements/FormInput";

import style, { colors } from "../../styles/main";

export default TerritoryDetailsList = ({
  modeOption = "",
  activeRow = null,
  selectorOpened = false,
  hasWarning = false,
  selectedAddresses = [],
  notesSymbols = {},
  user = {},
  data = {},
  onOpenRow = () => {},
  viewNotes = () => {},
  viewAddress = () => {},
  notifyDelete = () => {},
  selectAddressRow = () => {},
  viewPhoneNumbers = () => {},
  filterAddresses = () => {},
}) => {
  return (
    <View
      style={[
        style.section,
        style["listings-results"],
        style["listings-results-address"],
      ]}
    >
      <FlatList
        contentContainerStyle={style.listings}
        ListEmptyComponent={() => (
          <View style={[style["listings-item"]]}>
            <Text>
              {modeOption === "phone"
                ? Language.translate("No Phone")
                : Language.translate("No Address")}
            </Text>
          </View>
        )}
        data={data.addresses.filter(filterAddresses).sort(UTILS.sortAddress)}
        keyExtractor={(item) => item.addressId.toString()}
        renderItem={({ item }) => {
          const selected = selectedAddresses.indexOf(item.addressId) !== -1;
          item.hasWarning = hasWarning(item);

          return (
            <Swipeout
              onOpen={() => onOpenRow(item)}
              key={item.addressId}
              right={[
                {
                  text: Language.translate("Notes"),
                  type: "primary",
                  onPress: () => viewNotes(item),
                },
                user.isEditor
                  ? {
                      text: Language.translate("Delete"),
                      type: "delete",
                      onPress: () => notifyDelete(item, user),
                    }
                  : { text: "" }, // Empty object with "text" prop is required to prevent error
              ]}
              rowID={item.addressId}
              autoClose={true}
              close={activeRow !== item.addressId}
            >
              <View
                style={[
                  style["listings-item"],
                  item.inActive ? style["listings-item-inactive"] : null,
                  item.hasWarning ? style["listings-item-warning"] : null,
                ]}
              >
                {selectorOpened ? (
                  <View style={{}}>
                    <Checkbox
                      style={{ margin: 0 }}
                      value={selected}
                      onChange={() => {
                        selectAddressRow(item.addressId, selected);
                      }}
                    />
                  </View>
                ) : null}
                {modeOption === "phone" ? (
                  <View style={[style["listings-notes"]]}>
                    {item.phones && item.phones.length ? (
                      <ButtonLink
                        key="listings-add-notes"
                        customStyle={[style["add-notes"]]}
                        onPress={() => {
                          viewPhoneNumbers(item);
                        }}
                      >
                        <Text
                          style={[item.hasWarning ? style["text-white"] : null]}
                        >
                          {Language.translate("Phone")}
                        </Text>
                      </ButtonLink>
                    ) : (
                      <Text
                        style={{
                          marginTop: 10,
                          color: colors.grey,
                        }}
                      >
                        {Language.translate("No Phone")}
                      </Text>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[style["listings-notes"]]}
                    onPress={() =>
                      user.isNoteEditor
                        ? viewNotes(item)
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
                              item.hasWarning ? style["text-white"] : null,
                            ]}
                          >
                            {item.notes[0].date}
                          </Text>,
                          <Text
                            key="listings-notes"
                            numberOfLines={1}
                            style={[
                              style["listings-notes-note-text"],
                              item.hasWarning ? style["text-white"] : null,
                            ]}
                          >
                            {Number.isInteger(item.notes[0].symbol) &&
                            !UTILS.isLegacyNote(
                              UTILS.getLegacyNoteSymbol(item.notes[0].note)
                            )
                              ? `${
                                  Object.values(notesSymbols)[
                                    item.notes[0].symbol
                                  ]
                                } - `
                              : ""}
                            {UTILS.formatDiacritics(item.notes[0].note)}
                          </Text>,
                        ]
                      : [
                          user.isNoteEditor ? (
                            <ButtonLink
                              key="listings-add-notes"
                              customStyle={[style["add-notes"]]}
                              onPress={() => viewNotes(item)}
                            >
                              <Text
                                style={[
                                  item.hasWarning ? style["text-white"] : null,
                                ]}
                              >
                                {Language.translate("Add Notes")}
                              </Text>
                            </ButtonLink>
                          ) : null,
                        ]}
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    style["listings-name"],
                    style["address-listings-name"],
                    selectorOpened ? { left: 50 } : null,
                  ]}
                  onPress={() =>
                    user.isEditor
                      ? viewAddress(item)
                      : console.log("Not Editor")
                  }
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      style["listings-name-text"],
                      style["listings-address-name"],
                      item.hasWarning ? style["text-white"] : null,
                    ]}
                  >
                    {UTILS.formatDiacritics(item.name)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      style["listings-address"],
                      item.hasWarning ? style["text-white"] : null,
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
    </View>
  );
};
