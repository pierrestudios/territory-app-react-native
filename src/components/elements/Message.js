import React from "react";
import { Text, View, ScrollView } from "react-native";

import style from "../../styles/main";
import { colors } from "../../styles/main";

export default Message = (props) => {
  return props.error ? (
    <View style={style.errors}>
      <Text style={{ color: colors.white }}>{props.error}</Text>
    </View>
  ) : props.message ? (
    <View style={style.success}>
      <Text style={{ color: colors.white }}>{props.message}</Text>
    </View>
  ) : null;
};
