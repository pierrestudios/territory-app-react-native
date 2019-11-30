import React from "react";
import { View, Text, Platform } from "react-native";

import { expo } from "../../app.json";
import { version as packageVersion } from "../../package.json";

export default () => {
  return (
    <View style={{ marginBottom: 10, marginTop: 10 }}>
      <Text>
        VER: {expo ? expo[`${Platform.OS}-version`] : ""}
        {packageVersion ? `-DEV-${packageVersion}` : ""}
      </Text>
    </View>
  );
};
