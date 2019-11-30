import React from "react";
import { View, Text, Platform } from "react-native";

import appVersion from "../../app-version.json";
import { version as packageVersion } from "../../package.json";

export default () => {
  return (
    <View style={{ marginBottom: 10, marginTop: 10 }}>
      <Text>
        VER: {appVersion ? appVersion[`${Platform.OS}-version`] : ""}
        {packageVersion ? `-DEV-${packageVersion}` : ""}
      </Text>
    </View>
  );
};
