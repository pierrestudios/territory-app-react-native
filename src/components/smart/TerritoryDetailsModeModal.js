import React from "react";
import { Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Language from "../../common/lang";

import { Link } from "../elements/Button";
import { RadioBox } from "../elements/FormInput";

import style, { colors } from "../../styles/main";
import Modal from "../elements/Modal";

export default function TerritoryDetailsModeModal({
  addressesFilterOpened = false,
  onCloseModal = () => {},
  saveFilterType = () => {},
  filterType = "",
  filterTypes = [],
}) {
  return (
    <Modal
      animationType="fade"
      visible={addressesFilterOpened}
      onCloseModal={onCloseModal}
    >
      <View style={[styles["modal-view"], {}]}>
        <RadioBox
          name="filter"
          label={Language.translate("Filter Addresses")}
          options={filterTypes.map((f) => ({
            ...f,
            active: f.value === filterType,
          }))}
          onChange={saveFilterType}
        />
        <Link
          onPress={() => {
            saveFilterType({
              option: {
                value: "not-done-at-all",
              },
            });
          }}
          customStyle={[
            style["heading-button-link"],
            {
              height: 60,

              borderColor: colors["grey-lite"],
              borderWidth: 1,
            },
            filterType === "not-done-at-all"
              ? { backgroundColor: colors["territory-blue"] }
              : null,
          ]}
          customView={
            <View
              style={{
                flexDirection: "row",
                alignItems: "stretch",
                justifyContent: "center",
                paddingBottom: 10,
                paddingTop: 10,
              }}
            >
              <Text
                style={{
                  color:
                    filterType === "not-done-at-all"
                      ? colors.white
                      : colors["grey-dark"],
                  paddingTop: 5,
                }}
              >
                {Language.translate("Address & phone not worked") + "  "}
              </Text>
              <FontAwesome
                {...{
                  name: "check-circle",
                  size: 24,
                  color:
                    filterType === "not-done-at-all"
                      ? colors.white
                      : colors["grey-lite"],
                }}
              />
            </View>
          }
        ></Link>
      </View>
    </Modal>
  );
}
