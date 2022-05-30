import React from "react";
import { View, ActivityIndicator } from "react-native";

import style from "../../styles/main";

export default function Loading() {
  return (
    <View style={{ ...style.content, paddingTop: 100 }}>
      <ActivityIndicator size="large" color="#ccc" />
    </View>
  );
}
