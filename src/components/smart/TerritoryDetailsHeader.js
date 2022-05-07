import React from "react";
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Language from "../../common/lang";
import { ButtonLink } from "../elements/Button";
import style, { colors } from "../../styles/main";

export default TerritoryDetailsHeader = ({
  selectedAddresses = [],
  viewMap = () => {},
  viewAddressSelector = () => {},
  sendSelectedAddresses = () => {},
  showModeOptions = () => {},
  showAddressesFilter = () => {},
}) => {
  return (
    <View style={style["territory-heading"]}>
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
        onPress={showModeOptions}
        customStyle={[
          style["heading-button-link"],
          {
            borderColor: colors["grey-lite"],
            borderWidth: 1,
            backgroundColor: colors["off-white"],
          },
        ]}
      >
        {Language.translate("Mode")}
      </ButtonLink>

      <ButtonLink
        onPress={showAddressesFilter}
        customStyle={[
          style["heading-button-link"],
          {
            borderColor: colors["grey-lite"],
            borderWidth: 1,
            backgroundColor: colors["off-white"],
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
              color={colors["grey"]}
            />
            {/*<Text
                  style={{
                    padding: 0,
                    marginTop: -2,
                    paddingLeft: 3,
                    fontSize: 16,
                  }}
                >
                  {Language.translate("Filter")}
                </Text>*/}
          </View>
        }
      />
    </View>
  );
};
