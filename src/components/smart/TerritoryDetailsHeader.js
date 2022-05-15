import React, { useState } from "react";
import { View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Language from "../../common/lang";
import { ButtonLink } from "../elements/Button";
import style, { colors } from "../../styles/main";

export default TerritoryDetailsHeader = ({
  modeOption = "",
  selectedAddresses = [],
  modeOptions = [],
  viewMap = () => {},
  viewAddressSelector = () => {},
  sendSelectedAddresses = () => {},
  showModeOptions = () => {},
  showAddressesFilter = () => {},
  showSearchModal = () => {},
}) => {
  const [subNavOpened, openCloseSubNav] = useState(true);
  const modeToSelect =
    modeOptions.find((opt) => opt.value !== modeOption) || {};

  return (
    <>
      <View style={style["territory-heading"]}>
        <ButtonLink
          onPress={() => openCloseSubNav(!subNavOpened)}
          customStyle={[
            style["heading-button-link"],
            style["border-grey-bg-lite"],
            {
              marginLeft: 10,
            },
          ]}
        >
          <FontAwesome name={"bars"} color={colors.grey} size={18} />
        </ButtonLink>
        <ButtonLink
          onPress={showModeOptions}
          customStyle={[
            style["heading-button-link"],
            style["border-grey-bg-lite"],
          ]}
        >
          <FontAwesome
            name={modeToSelect["icon-name"] || "check-circle"}
            size={18}
          />{" "}
          {Language.translate("Select")} {modeToSelect.label}
        </ButtonLink>
        <ButtonLink
          onPress={showAddressesFilter}
          customStyle={[
            style["heading-button-link"],
            style["border-grey-bg-lite"],
            {
              position: "absolute",
              right: 20,
              marginTop: 18,
              paddingTop: 6,
            },
          ]}
          customView={
            <View
              style={{
                flexDirection: "row",
                alignItems: "stretch",
                justifyContent: "center",
                paddingLeft: 5,
                paddingRight: 5,
              }}
            >
              <MaterialIcons
                name="filter-list"
                size={16}
                color={colors["territory-blue"]}
              />
              <Text
                style={{
                  padding: 0,
                  marginTop: -2,
                  paddingLeft: 3,
                  fontSize: 16,
                  color: colors["territory-blue"],
                }}
              >
                {Language.translate("Filter")}
              </Text>
            </View>
          }
        />
      </View>

      <View
        style={[
          style["territory-heading"],
          {
            backgroundColor: colors["off-white"],
            borderColor: colors["grey-lite"],
            borderWidth: 2,
            borderBottomWidth: 0,
            borderBottomColor: colors.grey,
          },
          { display: subNavOpened ? "flex" : "none" },
        ]}
      >
        <ButtonLink
          onPress={viewMap}
          customStyle={[style["heading-button-link"], style["view-map-button"]]}
          textStyle={style["heading-button-link-text"]}
          textColorWhite
        >
          {Language.translate("Map")}
        </ButtonLink>
        <ButtonLink
          onPress={viewAddressSelector}
          customStyle={[style["heading-button-link"], style["select-button"]]}
          textStyle={style["heading-button-link-text"]}
          textColorWhite
        >
          {Language.translate("Select")}
        </ButtonLink>
        <ButtonLink
          disabled={selectedAddresses.length === 0}
          onPress={sendSelectedAddresses}
          customStyle={[style["heading-button-link"], style["send-button"]]}
          textStyle={style["heading-button-link-text"]}
          textColorWhite
        >
          {Language.translate("Send")}
        </ButtonLink>
        <ButtonLink
          onPress={showSearchModal}
          customStyle={[
            style["heading-button-link"],
            {
              borderColor: colors["grey-lite"],
              borderWidth: 1,
              backgroundColor: colors["off-white"],
            },
          ]}
        >
          <FontAwesome name={"search"} size={16} />{" "}
          {Language.translate("Search")}
        </ButtonLink>
      </View>
    </>
  );
};
